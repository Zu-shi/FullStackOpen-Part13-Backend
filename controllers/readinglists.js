const router = require('express').Router()
const { ReadingList } = require('../models/index')
const sequelize = require('sequelize')

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

const errorHandler = (error, req, res, next) => {
  console.log("user error handler evoked")
  console.error(error.message)
  res.send({ message: error.message })

  next(error)
}

router.use(errorHandler)

module.exports = router