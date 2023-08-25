const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: ReadingList })
Blog.belongsToMany(User, { through: ReadingList })

module.exports = {
  Blog,
  User,
  ReadingList
}