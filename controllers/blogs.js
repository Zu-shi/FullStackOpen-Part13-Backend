const router = require('express').Router()
const tokenExtractor = require('../util/tokenExtractor')
const { Sequelize, Op } = require('sequelize')
const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  let conditions = {}

  if (req.query.search) {
    conditions = { [Op.or]: [] }
    conditions[Op.or].push(
      {
        title:
        {
          [Op.iLike]: "%" + req.query.search + "%"
        }
      }
    )
    conditions[Op.or].push(
      {
        url:
        {
          [Op.iLike]: "%" + req.query.search + "%"
        }
      }
    )
  }

  const blogs = await Blog.findAll({
    include: {
      model: User
    },
    where: conditions,
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  console.log(req.body)
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id, updatedAt: new Date() })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

const BlogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', tokenExtractor, BlogFinder, async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (req.blog) {
    if (!req.decodedToken || req.blog.userId != req.decodedToken.id) {
      console.log(req.blog.userId, ", ", req.decodedToken.id)
      next({ ErrorMessage: "token verification failed." })
      res.status(404).end()
      return;
    }

    await Blog.destroy({ where: { id: req.params.id } }) // note that it saves automatically!
    // await req.blog.destroy()
    console.log("deleted")
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.put('/:id', BlogFinder, async (req, res, next) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    try {
      await req.blog.save()
      res.json(req.blog)
    }
    catch (error) {
      next(error)
    }
  } else {
    res.status(404).end()
  }
})

router.get('/:id', BlogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

const errorHandler = (error, request, response, next) => {
  console.log("error handler evoked")
  console.error(error.message)
  response.status(400).send(error.message).end()

  next(error)
}

// this has to be the last loaded middleware.
router.use(errorHandler)

module.exports = router;