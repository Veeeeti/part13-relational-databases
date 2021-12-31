const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()

const { SECRET } = require('../utils/config')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body
  console.log('login body: ', body)

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'salainen'
  
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })

  // const user = await User.findOne({ username: body.username })
  // const passwordCorrect = user === null
  //   ? false
  //   : await bcrypt.compare(body.password, user.passwordHash)

  // if (!(user && passwordCorrect)) {
  //   return response.status(401).json({
  //     error: 'invalid username or password'
  //   })
  // }

  // const userForToken = {
  //   username: user.username,
  //   id: user._id,
  // }

  // const token = jwt.sign(userForToken, process.env.SECRET)

  // response
  //   .status(200)
  //   .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter