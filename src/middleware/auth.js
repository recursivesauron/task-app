const jwt = require('jsonwebtoken')
const User = require('../models/user')
const jwtSecret = process.env.JWT_SECRET
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, jwtSecret)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            console.log('Could not find user with id: ' + decoded._id + 'and tokens.token' + token)
            throw new Error()
        }

        req.user = user
        req.token = token
        next()
    } catch(e){
        res.status(401).send({ error: 'Please authenticate.'})
    }
}

module.exports = auth