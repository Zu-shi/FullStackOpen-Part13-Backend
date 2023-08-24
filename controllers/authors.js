const router = require('express').Router()
const { Blog } = require('../models/index')
const sequelize = require('sequelize')

router.use('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('sum', sequelize.col('likes')), 'likes'],
      [sequelize.fn('count', sequelize.col('id')), 'articles']
    ],
    group: ['author'],
    order: [
      ['likes', 'DESC']
    ]
  })

  res.json(authors)
});

module.exports = router