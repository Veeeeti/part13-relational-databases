const Blog = require('./models/blog')
const User = require('./models/user')

User.hasMany(Blog)
Blog.belongsTo(User)

// Blog.sync({ alter: true })
// User.sync({ alter: true })

module.exports = {
  Blog, User
}