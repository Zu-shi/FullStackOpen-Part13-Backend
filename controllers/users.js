const router = require('express').Router()
const { Op } = require('sequelize')
const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res, next) => {
  const result = await User.findAll(
    {
      include: [
        { model: Blog },
        {
          model: Blog,
          as: 'reading_list',
          through: {
            attributes: []
          },
          attributes: { exclude: ['userId'] }
        }
      ]
    }
  )
  res.json(result)
})

router.get('/:id', async (req, res, next) => {
  // Wait what format is this???
  let isRead = {
    [Op.in]: [true, false]
  }

  if (req.query.isRead) {
    console.log("Set query for isRead to ", isRead)
    isRead = req.query.isRead === "true"
  }

  const result = await User.findAll(
    {
      where: { id: req.params.id },
      include: [
        {
          model: Blog,
          attributes: { exclude: ['userId'] },
          include: {
            model: User,
            as: 'users_bookmarked',
            attributes: ['name'],
            through: {
              where: { isRead },
              attributes: ['userId', 'isRead']
            },
          }
        }
      ]
    })
  res.json(result)
})

router.put('/:username', async (req, res, next) => {
  const user = await User.findAll({
    where: { id: req.body.id }
  })
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