const blogsRouter = require('express').Router()
// const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')
const { SECRET } = require('../utils/config')
const { Op } = require('sequelize')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}


blogsRouter.get('/', async (request, response, next) => {
    console.log('blogsRouter.get')

    let where = {}

    if (request.query.search) {
      where = {
        [Op.or]: [
          {
            title: { [Op.iLike]: request.query.search }            
          },
          {
            author: { [Op.iLike]: request.query.search }
          }
        ]
      }
    }

    const blogs = await Blog
      .findAll({
        include: {
          model: User,
          attributes: ['name']
        },
        order: [ 'likes', 'ASC'],
        where
      })
      .catch(e => next(e))
    response.json(blogs)
})

blogsRouter.post('/', tokenExtractor, async (request, response, next) => {
  const body = request.body
  console.log('Adding blog with body: ',body)

  try {
    const user = await User.findByPk(request.decodedToken.id)
    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      userId: user.id
    }
    const blog = await Blog.create(newBlog)
    response.json(blog)
  } catch(error) {
    return response.status(400).json({ error })
  }
  
  // const newBlog = {
  //   title: body.title,
  //   author: body.author,
  //   url: body.url,
  //   likes: body.likes
  // }

  // const blog = await Blog
  //   .create(newBlog)
  //   .catch(e => next(e))
  // response.json(blog)

  // We'll worry about verification and users later.
  //  const token = middleware.tokenExtractor(request)
  //  const decodedToken = jwt.verify(token, process.env.SECRET)
  //  if (!token || !decodedToken.id) {
  //    return response.status(401).json({ error: 'token missing or invalid' })
  //  }
})

blogsRouter.delete('/:id', tokenExtractor,async (request, response, next) => {
    console.log('Id to be fetched and delted: ',request.params.id)
    const blog = await Blog.findByPk(request.params.id).catch(e => next(e))
    const user = await User.findByPk(request.decodedToken.id)

    if (blog && user.id === blog.userId) {
      console.log('blog to be deleted: ', blog)
      await blog.destroy().catch(e => next(e))
      response.status(204).end()
    } else {
      console.log('Did not find blog with id:', request.params.id)
      response.status(400).end()
    }

    // const user = await User.findById(decodedToken.id)

    // const blog = await Blog.findById(request.params.id)

    // if (blog.user.toString() === user._id.toString()) {
    //   console.log('Blog deleting in progress...')
    //   Blog.findByIdAndRemove(request.params.id)
    //   .then(result => {
    //     response.status(204).end()
    //   })
    // }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = await Blog
    .findByPk(request.params.id)
    .catch(e => next(e))
    
  console.log('blog to be updated: ', blog)

  if (blog) {
    const newLikes = blog.likes + 1
    console.log('Updating likes to ', newLikes, typeof newLikes)
    await blog
      .update({likes: newLikes}, {where: request.params.id})
      .catch(e => next(e))

    response.status(200).end()
  }
})

module.exports = blogsRouter