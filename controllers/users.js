const router = require('express').Router()

const { User } = require('../models')

router.get('/', async (req, res, next) => {
  const result = await User.findAll()
  res.json(result)
})

router.get('/:id', async (req, res, next) => {
  const result = await User.findByPk(req.params.id)
  res.json(result)
})

router.put('/:username', async (req, res, next) => {
  const user = await User.find({ where: { id: req.body.id } })
  try {
    user.username = req.params.username
    await user.save()
    res.json(user)
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.json(user)
  } catch (error) { next(error) }
})

const errorHandler = (error, req, res, next) => {
  console.log("user error handler evoked")
  console.error(error.message)
  res.send({ message: error.message })

  next(error)
}

// this has to be the last loaded middleware.
router.use(errorHandler)

module.exports = router;