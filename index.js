require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')
const express = require('express')
var bodyParser = require('body-parser');

const app = express()
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

class Blog extends Model { }
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  console.log(req.body)
  try {
    const blog = await Blog.create(req.body) // note that it saves automatically!
    res.json(blog)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.destroy({ where: { id: req.params.id } }) // note that it saves automatically!
    console.log("deleted")
    res.json(blog)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

// app.put('/api/blogs', async (req, res) => {
//   const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
//   res.json(blogs)
// })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})