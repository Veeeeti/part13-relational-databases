const blogsRouter = require('express').Router()
// const Blog = require('../models/blog')
// const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

// POSTGRES MODEL FOR BLOGS
const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync()



blogsRouter.get('/', async (request, response) => {
    console.log('blogsRouter.get')

    const blogs = await Blog.findAll()

    // MONGODB SOLUTION
    // const blogs = await Blog
    // .find({}).populate('user', {username: 1, id: 1})
    // response.json(blogs.map(blog => blog.toJSON()))

    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  console.log('Adding blog with body: ',body)

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const blog = await Blog.create(newBlog).catch((e) => {
    return response.status(400).json({e})
  })
  
  response.json(blog)

  // We'll worry about verification and users later.
  //  const token = middleware.tokenExtractor(request)
  //  const decodedToken = jwt.verify(token, process.env.SECRET)
  //  if (!token || !decodedToken.id) {
  //    return response.status(401).json({ error: 'token missing or invalid' })
  //  }
   

  // MONGODB SOLUTION
  //  const user = await User.findById(decodedToken.id)
  //  console.log('blogsRouter.post user:',user)

  //  const blog = new Blog({
  //      title: body.title,
  //      author: body.author,
  //      url: body.url,
  //      likes: body.likes,
  //      user: user._id,
  //  })

  //  const savedBlog = await blog.save()
  //  user.blogs = user.blogs.concat(savedBlog._id)
  //  await user.save()

  //  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
    console.log('Id to be fetched and delted: ',request.params.id)
    const blog = await Blog.findByPk(request.params.id)

    if (blog) {
      console.log('blog to be deleted: ', blog)
      await blog.destroy()
      response.status(204).end()
    } else {
      console.log('Did not find blog with id:', request.params.id)
      response.status(400).end()
    }

    // MONGODB SOLUTION
    // const token = middleware.tokenExtractor(request)
    // const decodedToken = jwt.verify(token, process.env.SECRET)
    // if (!token || !decodedToken.id) {
    //   return response.status(401).json({ error: 'token missing or invalid' })
    // }
    
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

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)

  const body = request.body

  // if (blog) {
  //   const newBlog = {
  //     title: body.title,
  //     author: body.author,
  //     url: body.url,
  //     likes: body.likes
  //   }

    
  //   blog.
  //   response.json(newBlog)
  // } else {
  //   response.status(400).end()
  // }

  // MONGODB SOLUTION
  // const body = request.body
  // console.log('blogs.js body:',body)
  // const newBlog = {
  //     title: body.title,
  //     author: body.author,
  //     url: body.url,
  //     likes: body.likes
  // }

  // Blog.findByIdAndUpdate(request.params.id, newBlog)
  // .then(updatePerson => {
  //     response.json(updatePerson)
  // })
})

module.exports = blogsRouter