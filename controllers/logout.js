const jwt = require('jsonwebtoken')
const router = require('express').Router()
const User = require('../models/user')

router.delete('/:id', async (req, res) => {
  console.log("logout router")
  const user = await User.findByPk(req.params.id)

  user.token = ""
  await user.save()

  res.status(200).send(user)
})

module.exports = router;