const { test, describe } = require('node:test')
const assert = require('node:assert')
const { mostLikes } = require('../utils/list_helper')

describe('mostLikes', () => {
    test('return null for an empty list', () => {
        const emptyList = []
        const result = mostLikes(emptyList)
        assert.strictEqual(result, null)
    })

    test('returns the only author and likes for a single blog', () => {
        const singleBlog = [
        {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0
            }
            ]
        const result = mostLikes(singleBlog)
        assert.deepStrictEqual(result, {
            author: "Robert C. Martin",
            likes: 10
            })
  })

    test('returns one of the authors with the most total likes if there is a tie', () => {
    const tiedLikes = [
        {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Joku Muu",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 12,
    __v: 0
  },
    ]
    const result = mostLikes(tiedLikes)
    const expectedAuthors = ["Edsger W. Dijkstra", "Robert C. Martin"]
    const expectedLikes = 12

    assert.strictEqual(result.likes, expectedLikes)
    assert.ok(expectedAuthors.includes(result.author))
  })

  describe('mostLikes', () => {
  test('returns the author whose blogs have the highest combined likes', () => {
    const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
    ]

    const result = mostLikes(blogs)

    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }

    assert.deepStrictEqual(result, expected)
  })
})

}) 

