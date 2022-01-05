const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

// const Blog = require('./models/blog')
// const User = require('./models/user')

// User.hasMany(Blog)
// Blog.belongsTo(User)

// // Blog.sync({ alter: true })
// // User.sync({ alter: true })

// module.exports = {
//   Blog, User
// }


server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})