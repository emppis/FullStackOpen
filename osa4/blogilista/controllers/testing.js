const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Promise.all([
    Blog.deleteMany({}),
    User.deleteMany({})
  ])
  response.status(204).end()
})

module.exports = router