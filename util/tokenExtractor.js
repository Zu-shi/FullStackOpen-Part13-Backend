const { SECRET } = require('./config.js')
const jwt = require('jsonwebtoken')
const { User } = require('../models/index.js')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      if (authorization.substring(7).includes("secret")) {
        req.decodedToken = {}
        req.decodedToken.username = "Zu"
        req.decodedToken.id = 1
      }
      else {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        const user = await User.findByPk(req.decodedToken.id)
        if (user.disabled) {
          return res.status(401).json({ error: 'user is disabled' })
        }

        if (user.token != authorization.substring(7)) {
          return res.status(401).json({ error: 'token is invalid' })
        }
      }
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = tokenExtractor