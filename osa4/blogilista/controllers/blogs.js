const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deletedBlog = await Blog.findByIdAndDelete(id)

  if (deletedBlog) {
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})


blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})

module.exports = blogsRouter
