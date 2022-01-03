const authorsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { Op } = require('sequelize')
const { sequelize } = require('../models/blog')


authorsRouter.get('/', async (request, response, next) => {
    console.log('authorsRouter.get')

    const authors = await Blog
      .findAll({
            attributes: [
                'author', 
                [sequelize.fn('COUNT', sequelize.col('blog.id')), 'blogs'],
                [sequelize.fn('SUM', sequelize.col('blog.likes')), 'likes']
            ],
            group: 'author'
      })
      .catch(e => next(e))
    response.json(authors)
})

module.exports = authorsRouter