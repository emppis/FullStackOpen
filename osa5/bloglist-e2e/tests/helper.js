const { expect } = require('@playwright/test')


async function loginWith(page, username, password, name = null) {

  await expect(page.getByPlaceholder('Username')).toBeVisible({ timeout: 10000 })

  await page.getByPlaceholder('Username').fill(username)
  await page.getByPlaceholder('Password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()

  if (name) {
    await expect(page.getByText(`${name} logged in`)).toBeVisible({ timeout: 10000 })
  } else {
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible({ timeout: 10000 })
  }
}




async function createBlog(request, token, blogData) {
  await request.post('http://localhost:3001/api/blogs', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: blogData
  })
}

module.exports = {
  loginWith,
  createBlog
}