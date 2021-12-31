require('dotenv').config()

let PORT = process.env.PORT

const MONGODB_URI = process.env.MODE_ENV === 'test'
? process.env.TEST_MONGODB_URI
: process.env.MONGODB_URI

const DATABASE_URL = process.env.DATABASE_URL

const SECRET = process.env.SECRET

module.exports = {
    DATABASE_URL,
    MONGODB_URI,
    PORT,
    SECRET
}