const { test, expect, beforeEach, describe, request } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder('Username').fill('mluukkai')
    await page.getByPlaceholder('Password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    await page.waitForURL('/', { timeout: 10000 })

    await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible({ timeout: 10000 })
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Username').fill('mluukkai')
    await page.getByPlaceholder('Password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('wrong username/password')).toBeVisible()

  })


  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('logged-in user can create a blog', async ({ page }) => {
      await page.goto('/create')

      await page.getByPlaceholder('Title').fill('Playwright Test Blog')
      await page.getByPlaceholder('Author').fill('Test Author')
      await page.getByPlaceholder('URL').fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible({ timeout: 10000 })
      await expect(page.getByRole('link', { name: 'Playwright Test Blog by Test Author' })).toBeVisible({ timeout: 10000 })
    })

    test('logged-in user can like a blog', async ({ page, request }) => {
      const loginResponse = await request.post('/api/login', {
        data: { username: 'mluukkai', password: 'salainen' }
      })
      const { token } = await loginResponse.json()

      const created = await createBlog(request, token, {
        title: 'Like Test Blog',
        author: 'Tester',
        url: 'http://test.com'
      })

      await page.goto(`/blogs/${created.id}`)

      const likes = page.getByTestId('blog-likes')
      const likeButton = page.getByTestId('like-button')

      await expect(likes).toContainText('likes 0')
      await likeButton.click()
      await expect(likes).toContainText('likes 1')
    })
  })

  test('logged-in user can delete their own blog', async ({ page, request }) => {
    const loginResponse = await request.post('/api/login', {
      data: { username: 'mluukkai', password: 'salainen' }
    })
    const { token } = await loginResponse.json()

    const created = await createBlog(request, token, {
      title: 'Delete Test Blog',
      author: 'Tester',
      url: 'http://delete.com'
    })

    await loginWith(page, 'mluukkai', 'salainen')
    await page.goto(`/blogs/${created.id}`)

    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible({ timeout: 10000 })

    const deleteButton = page.getByTestId('delete-button')
    await expect(deleteButton).toBeVisible({ timeout: 10000 })
    
    page.once('dialog', dialog => dialog.accept())
    await deleteButton.click()

    await page.waitForURL('/', { timeout: 10000 })

    await expect(page.getByText('Delete Test Blog')).toHaveCount(0)
  })

})