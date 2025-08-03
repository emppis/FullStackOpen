const { test, describe } = require('node:test')
const assert = require('node:assert')
const { mostBlogs } = require('../utils/list_helper')

describe('mostBlogs', () => {
    
  const emptyList = []

  const singleBlog = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    }
  ]

  const multipleBlogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }
  ]

  test('returns null for an empty list', () => {
    const result = mostBlogs(emptyList)
    assert.strictEqual(result, null)
  })

  test('returns the author and blog count from a single blog list', () => {
    const result = mostBlogs(singleBlog)
    assert.deepStrictEqual(result, {
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('returns the author with the most blogs from a multi-blog list', () => {
    const result = mostBlogs(multipleBlogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 2
    })
  })

  test('returns one of the authors with the most blogs if there are multiple', () => {
    const tiedBloggers = [
      { title: 'A', author: 'Emmiina', likes: 2 },
      { title: 'B', author: 'Emmiina', likes: 3 },
      { title: 'C', author: 'Misa', likes: 4 },
      { title: 'D', author: 'Misa', likes: 5 }
    ]

    const result = mostBlogs(tiedBloggers)
    const expectedAuthors = ['Emmiina', 'Alex']
    const expectedBlogs = 2

    assert.strictEqual(result.blogs, expectedBlogs)
    assert.ok(expectedAuthors.includes(result.author))
  })

})