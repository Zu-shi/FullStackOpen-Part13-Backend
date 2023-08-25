const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const index = require('./models')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingListsRouter = require('./controllers/readingLists')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readingLists', readingListsRouter)

const start = async () => {
  await connectToDatabase()

  // const schema = await sequelize.getQueryInterface().showAllSchemas()
  // console.log('// Tables in database', '==========================');
  // console.log(schema);

  // const tables = await sequelize.query('select table_schema, table_name from information_schema.tables')
  // console.log(JSON.stringify(tables[0].slice(0, 5)));

  const blogs = await index.Blog.findAll()
  const users = await index.User.findAll()
  const readingLists = await index.ReadingList.findAll()

  console.log("Blogs: ", JSON.stringify(blogs))
  console.log("Users: ", JSON.stringify(users))
  console.log("ReadingLists: ", readingLists)

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()