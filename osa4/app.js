const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')


const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
})
  
const main = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
        const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
        console.log(blogs)
        sequelize.close()
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}
  
main()

/* THIS CODE IS FROM THE PREVIOUS PARTS. ITS USED TO CONNECT TO MONGODB

const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
.then(result => {
    logger.error('connected to MongoDB')
})           
.catch((error) => {
    logger.error('error connecting to MongoDB:',error.message)
})

*/

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

console.log('pricess.env.NODE_ENV',process.env.NODE_ENV)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app