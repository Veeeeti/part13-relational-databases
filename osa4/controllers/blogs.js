const blogsRouter = require('express').Router()
// const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
    console.log('blogsRouter.get')

    const blogs = await Blog.findAll().catch(e => next(e))
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  console.log('Adding blog with body: ',body)

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const blog = await Blog
    .create(newBlog)
    .catch(e => next(e))
  response.json(blog)

  // We'll worry about verification and users later.
  //  const token = middleware.tokenExtractor(request)
  //  const decodedToken = jwt.verify(token, process.env.SECRET)
  //  if (!token || !decodedToken.id) {
  //    return response.status(401).json({ error: 'token missing or invalid' })
  //  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    console.log('Id to be fetched and delted: ',request.params.id)
    const blog = await Blog.findByPk(request.params.id).catch(e => next(e))

    if (blog) {
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