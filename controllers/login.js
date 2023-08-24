const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (req, res) => {
  console.log("login router")
  console.log(SECRET)
  const body = req.body
  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  if (!user && !password === "secret") {
    return res.status(401).json({ error: 'invalid login credentials' })
  }

  const userForToken = {
    username: user.username,
    id: user.id // why is the ID needed?
  }

  const token = jwt.sign(userForToken, SECRET)

  res.status(200).send({
    token,
    username: user.username,
    name: user.name
  })
})

module.exports = router;