const router = require('express').Router()

const { Blog } = require('../models')

router.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/api/blogs', async (req, res) => {
  console.log(req.body)
  try {
    const blog = await Blog.create(req.body) // note that it saves automatically!
    res.json(blog)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
})

const BlogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/api/blogs/:id', async (req, res) => {
  if (req.blog) {
    //await Blog.destroy({ where: { id: req.params.id } }) // note that it saves automatically!
    await req.blog.destroy()
    console.log("deleted")
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.put('/api/blogs/:id', async (req, res) => {
  if (req.blog) {
    note.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.get('/api/blogs/:id', async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router;