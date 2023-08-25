const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: ReadingList, as: 'reading_list' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_bookmarked' })

module.exports = {
  Blog,
  User,
  ReadingList
}