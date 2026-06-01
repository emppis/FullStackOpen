import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'

vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'abc123' })
}))

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

  const otherUser = {
    username: 'someoneelse',
    name: 'Other User'
  }

  test('unauthenticated user sees blog info and likes but no buttons', () => {
    render(
      <Blog
        blogs={[blog]}
        user={null}
        onDelete={() => { }}
        onLike={() => { }}
      />
    )

    expect(screen.getByText(/Testi testi testi/)).toBeInTheDocument()
    expect(screen.getByText(/Matti Meikäläinen/)).toBeInTheDocument()
    expect(screen.getByText(/likes 5/)).toBeInTheDocument()

    expect(screen.queryByTestId('like-button')).toBeNull()
    expect(screen.queryByTestId('delete-button')).toBeNull()
  })

  test('logged-in non-creator sees only like button', () => {
    render(
      <Blog
        blogs={[blog]}
        user={otherUser}
        onDelete={() => { }}
        onLike={() => { }}
      />
    )

    expect(screen.getByText(/likes 5/)).toBeInTheDocument()
    expect(screen.getByTestId('like-button')).toBeInTheDocument()
    expect(screen.queryByTestId('delete-button')).toBeNull()
  })

  test('creator sees both like and delete buttons', () => {
    render(
      <Blog
        blogs={[blog]}
        user={user}
        onDelete={() => { }}
        onLike={() => { }}
      />
    )

    expect(screen.getByTestId('like-button')).toBeInTheDocument()
    expect(screen.getByTestId('delete-button')).toBeInTheDocument()
  })

  test('like handler is called when like button is clicked', async () => {
    const mockLikeHandler = vi.fn()
    const userSim = userEvent.setup()

    render(
      <Blog
        blogs={[blog]}
        user={user}
        onDelete={() => { }}
        onLike={mockLikeHandler}
      />
    )

    const likeButton = screen.getByTestId('like-button')
    await userSim.click(likeButton)
    await userSim.click(likeButton)

    expect(mockLikeHandler).toHaveBeenCalledTimes(2)
  })
})

