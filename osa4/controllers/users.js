const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

console.log('users.js alku', User)

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs')
    response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    
    console.log('got to post processing. body:', body)

    const password = body.password
    if(password.length < 3) {
        return response.status(401).json({
            error: 'password is too short'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })


    console.log('user:',user)
    const savedUser = await user.save()

    response.json(savedUser)
})


module.exports = usersRouter