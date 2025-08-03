const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('GET /api/blogs tests', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blog objects contain id and not _id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]

        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })

})

describe('POST /api/blogs tests', () => {
    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: 'New blog',
            author: 'Maija Meikäläinen',
            url: 'maija.fi',
            likes: 8,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(blog => blog.title)
        assert(titles.includes('New blog'))
    })

    test('if likes is missing, default value is 0', async () => {
        const newBlog = {
            title: 'Blog without likes',
            author: 'Test Author',
            url: 'test.com'
            //ei tykkäyksiä
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const addedBlog = blogsAtEnd.find(blog => blog.title === 'Blog without likes')

        assert.strictEqual(addedBlog.likes, 0)
    })

    test('blog without title returns 400 Bad request', async () => {
        const newBlog = {
            author: 'Test Author',
         url: 'test.com',
            likes: 5,   
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    test('blog without url returns 400 Bad request', async () => {
        const newBlog = {
            title: 'Test blog',
            author: 'Test Author',
            likes: 5,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})



describe('DELETE /api/blogs/:id tests', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('PUT /api/blogs/:id tests', () => {
  test("blog's likes can be updated", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = { likes: blogToUpdate.likes + 1 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})