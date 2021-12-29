const { Model, DataTypes} = require('sequelize')
const { DATABASE_URL } = require('../utils/config')

const { sequelize } = require('../utils/db')

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

// const mongoose = require('mongoose')

// const blogSchema = new mongoose.Schema({
//   url: String,
//   title: String,
//   author: String,
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   likes: Number,
// })

// blogSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// module.exports = mongoose.model('Blog', blogSchema)

module.exports = Blog