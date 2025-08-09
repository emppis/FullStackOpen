import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'

describe('<Blog />', () => {
  const blog = {
    title: 'Testi testi testi',
    author: 'Matti Meikäläinen',
    url: 'http://example.com/testi',
    likes: 5,
    user: {
      username: 'emmiina',
      name: 'Emmiina Testaaja',
      id: '12345'
    },
    id: 'abc123'
  }

  const user = {
    username: 'emmiina',
    name: 'Emmiina Testaaja'
  }

  test('renders title and author but not url or likes by default', () => {
    render(<Blog blog={blog} user={user} onDelete={() => {}} />)

    expect(screen.getByText(/Testi testi testi/)).toBeDefined()
    expect(screen.getByText(/Matti Meikäläinen/)).toBeDefined()

    expect(screen.queryByText(/http:\/\/example.com\/testi/)).toBeNull()
    expect(screen.queryByText(/likes 5/)).toBeNull()
  })

  test('shows url, likes and user name after clicking the view button', async () => {
    render(<Blog blog={blog} user={user} onDelete={() => {}} />)

    const userSim = userEvent.setup()
    const button = screen.getByText('view')
    await userSim.click(button)

    expect(screen.getByText('http://example.com/testi')).toBeDefined()
    expect(screen.getByText('likes 5')).toBeDefined()
    expect(screen.getByText('Emmiina Testaaja')).toBeDefined()
  })

  test('calls like handler twice when like button is clicked twice', async () => {
    const mockLikeHandler = vi.fn()
    blogService.update = vi.fn().mockResolvedValue({ likes: 6 })

    render(
      <Blog
        blog={blog}
        user={user}
        onDelete={() => {}}
        onLike={mockLikeHandler}
      />
    )

    const userSim = userEvent.setup()

    const viewButton = screen.getByText('view')
    await userSim.click(viewButton)

    const likeButton = screen.getByText('like')
    await userSim.click(likeButton)
    await userSim.click(likeButton)

    expect(mockLikeHandler).toHaveBeenCalledTimes(2)
  })

})