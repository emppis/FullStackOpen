import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls createBlog with correct data when form is submitted', async () => {
  const createBlog = vi.fn()
  const userSim = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText(/title/i)
  const authorInput = screen.getByLabelText(/author/i)
  const urlInput = screen.getByLabelText(/url/i)

  const submitButton = screen.getByRole('button', { name: /create/i })

  await userSim.type(titleInput, 'Testiblogi')
  await userSim.type(authorInput, 'Emmiina Testaaja')
  await userSim.type(urlInput, 'http://example.com/testiblogi')

  await userSim.click(submitButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testiblogi',
    author: 'Emmiina Testaaja',
    url: 'http://example.com/testiblogi'
  })
})
