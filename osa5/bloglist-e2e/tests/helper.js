const { expect } = require('@playwright/test')


async function loginWith(page, username, password = null) {

  await page.goto('/login')

  await expect(page.getByPlaceholder('Username')).toBeVisible({ timeout: 10000 })

  await page.getByPlaceholder('Username').fill(username)
  await page.getByPlaceholder('Password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()

  await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible({ timeout: 10000 })
}

async function createBlog(request, token, blogData) {
  const response = await request.post('/api/blogs', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: blogData
  })

  return await response.json()
}

module.exports = { loginWith, createBlog }