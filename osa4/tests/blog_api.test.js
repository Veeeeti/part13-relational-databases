const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

/*
const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  })
  */
test('blogs can be added', async () => {

    const newBlog = {
        title: "testTitle",
        author: "testAuthor",
        url: "testUrl",
        likes: 1,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


afterAll(() => {
    mongoose.connection.close()
})