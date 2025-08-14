const { test, expect, beforeEach, describe, request } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    
    await page.goto('http://localhost:5173')

    await page.evaluate(() => localStorage.clear())

    await page.reload()

    await expect(page.getByPlaceholder('Username')).toBeVisible({ timeout: 10000 })
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible({ timeout: 10000 })
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen', 'Matti Luukkainen')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByPlaceholder('Username').fill('mluukkai')
      await page.getByPlaceholder('Password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username/password')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible({ timeout: 10000 })
    })
  })

  describe('When logged in', () => {
  let uniqueTitle

  async function waitForBlog(page, title, timeout = 10000) {
    const locator = page.getByTestId('blog-title').filter({ hasText: title })
    await expect(locator).toBeVisible({ timeout })
    return locator.locator('xpath=..')
  }

  beforeEach(async ({ page, request }) => {
    await loginWith(page, 'mluukkai', 'salainen')

    const loginResponse = await request.post('http://localhost:3001/api/login', {
      data: {
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    const { token } = await loginResponse.json()

    uniqueTitle = `Test Blog ${Date.now()}`
    await createBlog(request, token, {
      title: uniqueTitle,
      author: 'Test Author',
      url: 'http://testblog.com'
    })

    await page.reload()
    await page.waitForTimeout(1000)
  })

  test('created blog is visible', async ({ page }) => {
    const blogContainer = await waitForBlog(page, uniqueTitle)
    await expect(blogContainer).toContainText(uniqueTitle, { timeout: 10000 })
  })

  test('user can like the created blog', async ({ page }) => {
    const blogContainer = await waitForBlog(page, uniqueTitle)
    await blogContainer.getByRole('button', { name: 'view' }).click()

    const likesText = blogContainer.getByTestId('blog-likes')
    await expect(likesText).toContainText('likes 0', { timeout: 10000 })

    const likeButton = blogContainer.getByRole('button', { name: 'like' })
    await likeButton.click()
    await expect(likesText).toContainText('likes 1', { timeout: 10000 })
  })

  test('user can delete the created blog', async ({ page }) => {
    const blogContainer = await waitForBlog(page, uniqueTitle)
    await blogContainer.getByRole('button', { name: 'view' }).click()

    const removeButton = blogContainer.getByTestId('blog-remove')
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Remove blog')
      await dialog.accept()
    })

    await removeButton.click()
    const blogTitleLocator = page.getByTestId('blog-title').filter({ hasText: uniqueTitle })
    await expect(blogTitleLocator).not.toBeVisible({ timeout: 10000 })
  })

  test('only the user who created the blog sees the delete button', async ({ page, request }) => {
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Testaaja',
        username: 'testaaja',
        password: 'salasana'
      }
    })

    await page.getByRole('button', { name: 'logout' }).click()
    await loginWith(page, 'testaaja', 'salasana')
    await page.waitForTimeout(1000)

    const blogContainer = await waitForBlog(page, uniqueTitle)
    await blogContainer.getByRole('button', { name: 'view' }).click()
    await expect(blogContainer.getByTestId('blog-remove')).toHaveCount(0)
  })

  test('blogs are ordered by likes in descending order', async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    const loginResponse = await request.post('http://localhost:3001/api/login', {
      data: {
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    const { token } = await loginResponse.json()

    const blogs = [
      { title: 'Blog A', author: 'Author A', url: 'http://a.com', likes: 2 },
      { title: 'Blog B', author: 'Author B', url: 'http://b.com', likes: 5 },
      { title: 'Blog C', author: 'Author C', url: 'http://c.com', likes: 1 }
    ]

    for (const blog of blogs) {
      await createBlog(request, token, blog)
    }

    await page.reload()
    await page.waitForTimeout(1000)

    const blogTitles = await page.locator('[data-testid="blog-title"]').allTextContents()
    expect(blogTitles).toEqual([
      'Blog B Author B',
      'Blog A Author A',
      'Blog C Author C'
    ])
  })

  test('blogs reorder dynamically when likes change', async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    })

    await page.goto('http://localhost:5173')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()

await loginWith(page, 'mluukkai', 'salainen')

    const blogs = [
      { title: 'Blog A', author: 'Author A', url: 'http://a.com' },
      { title: 'Blog B', author: 'Author B', url: 'http://b.com' },
      { title: 'Blog C', author: 'Author C', url: 'http://c.com' }
    ]

    for (const blog of blogs) {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill(blog.title)
      await page.getByPlaceholder('author').fill(blog.author)
      await page.getByPlaceholder('url').fill(blog.url)
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(500)
    }

    const blogCLocator = page.getByTestId('blog-title').filter({ hasText: 'Blog C' }).locator('xpath=..')
    await blogCLocator.getByRole('button', { name: 'view' }).click()
    const likeButton = blogCLocator.getByRole('button', { name: 'like' })

    for (let i = 0; i < 3; i++) {
      await likeButton.click()
      await page.waitForTimeout(300)
    }

    const blogTitles = await page.locator('[data-testid="blog-title"]').allTextContents()
    expect(blogTitles[0]).toContain('Blog C')
  })
})

})
