const { test, describe } = require('node:test')
const assert = require('node:assert')
const { favoriteBlog } = require('../utils/list_helper')

describe('favorite blog', () => {

  test('return null for an empty list', () => {
    const emptyList = []
    const result = favoriteBlog(emptyList)
    assert.strictEqual(result, null)
  })

  test('returns the only blog if list has one', () => {
    const singleBlogList = [
      {
        _id: '123',
        title: 'Joku Joku Joku',
        author: 'Minna',
        url: 'http://example.com/minna',
        likes: 8,
        __v: 0
      }
    ]
    const result = favoriteBlog(singleBlogList)
    assert.deepStrictEqual(result, singleBlogList[0])
  })

  test('returns blog with most likes', () => {
    const listWithThreeBlogs = [
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
      },
    ]
            
    const expected = {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }
    const result = favoriteBlog(listWithThreeBlogs)
    assert.deepStrictEqual(result, expected)

  })

  test('returns one of the blogs if multiple have equal max likes', () => {
    const listWithTie = [
      {
        _id: '111',
        title: 'Joku 1',
        author: 'Author A',
        url: 'http://example.com/a',
        likes: 10,
        __v: 0
      },
      {
        _id: '222',
        title: 'Joku 2',
        author: 'Author B',
        url: 'http://example.com/b',
        likes: 10,
        __v: 0
      }
    ]

    const result = favoriteBlog(listWithTie)
    const expectedLikes = 10
    const possibleIds = ['111', '222']

    assert.strictEqual(result.likes, expectedLikes)
    assert.ok(possibleIds.includes(result._id))
  })
})