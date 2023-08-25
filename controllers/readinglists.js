const router = require('express').Router()
const { ReadingList } = require('../models/index')
const sequelize = require('sequelize')
const tokenExtractor = require('../util/tokenExtractor')

router.post('/', async (req, res, next) => {
  try {
    const readingList = await new ReadingList(req.body).save()
    res.json(readingList)
  }
  catch (error) {
    next(error)
  }
});

router.get('/', async (req, res, next) => {
  const readingLists = await ReadingList.findAll()
  res.json(readingLists)
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const read = await ReadingList.findByPk(req.params.id)
    read.isRead = req.body.isRead
    if (req.user === read.userId) {
      await read.save()
    } else {
      res.status(400).json({ error: "user does not have edit permission for this reading item" })
    }
    res.json(req.user)
  }
  catch (error) {
    next(error)
  }
})

const errorHandler = (error, req, res, next) => {
  console.log("user error handler evoked")
  console.error(error.message)
  res.send({ message: error.message })

  next(error)
}

router.use(errorHandler)

module.exports = router