const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const middleware = require('../utils/middleware')
const User = require('../models/user')

console.log('users.js alku', User)

usersRouter.get('/', async (request, response, next) => {
    const users = await User.findAll().catch(e => next(e))
    response.json(users)
})

usersRouter.get('/:username', async (req, res) => {
    const username = req.params.username
    console.log('searching for username: ', username)
    const user = await User.findOne({ where: { username: username }})
    console.log('found user: ', user)
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

usersRouter.post('/', async (request, response) => {
    const body = request.body

    try {
        const user = await User.create(body)
        response.json(user)
    } catch(e) {
        const errorMessage = e.message
        return response.status(400).json({ errorMessage })
    }

    // const body = request.body
    
    // console.log('got to post processing. body:', body)

    // const password = body.password
    // if(password.length < 3) {
    //     return response.status(401).json({
    //         error: 'password is too short'
    //     })
    // }

    // const saltRounds = 10
    // const passwordHash = await bcrypt.hash(body.password, saltRounds)

    // const user = new User({
    //     username: body.username,
    //     name: body.name,
    //     passwordHash,
    // })


    // console.log('user:',user)
    // const savedUser = await user.save()

    // response.json(savedUser)
})

// usersRouter.get('/:id', async (req, res) => {
//     const user = await User.findByPk(req.params.id)
//     if (user) {
//         res.json(user)
//     } else {
//         res.status(404).end()
//     }
// })

module.exports = usersRouter