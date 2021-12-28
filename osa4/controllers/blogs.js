const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    console.log('blogsRouter.get')
    const blogs = await Blog
    .find({}).populate('user', {username: 1, id: 1})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
   const body = request.body

   const token = middleware.tokenExtractor(request)
   const decodedToken = jwt.verify(token, process.env.SECRET)
   if (!token || !decodedToken.id) {
     return response.status(401).json({ error: 'token missing or invalid' })
   }
   
   const user = await User.findById(decodedToken.id)
   console.log('blogsRouter.post user:',user)

   const blog = new Blog({
       title: body.title,
       author: body.author,
       url: body.url,
       likes: body.likes,
       user: user._id,
   })

   const savedBlog = await blog.save()
   user.blogs = user.blogs.concat(savedBlog._id)
   await user.save()

   response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
    const token = middleware.tokenExtractor(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    
    const user = await User.findById(decodedToken.id)

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user._id.toString()) {
      console.log('Blog deleting in progress...')
      Blog.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
    }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  console.log('blogs.js body:',body)
  const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, newBlog)
  .then(updatePerson => {
      response.json(updatePerson)
  })
})

module.exports = blogsRouter