import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, onDelete, onLike }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleDelete = async () => {
    const confirm = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if (!confirm) return

    try {
      await onDelete(blog.id)
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const showDelete = user && blog.user && user.username === blog.user.username

  return (
    <div style={blogStyle} className="blog">
      {!visible ? (
        <div>
          <span data-testid="blog-title">{blog.title} {blog.author}</span>
          <button onClick={toggleVisibility}>view</button>
        </div>
      ) : (
        <div>
          <span data-testid="blog-title">{blog.title} {blog.author}</span>
          <button onClick={toggleVisibility}>hide</button>
          <div data-testid="blog-url">{blog.url}</div>
          <div>
            <span data-testid="blog-likes">likes {blog.likes}</span>
            <button onClick={() => onLike(blog.id)}>like</button>
          </div>
          <div data-testid="blog-user">{blog.user?.name}</div>
          {showDelete && (
            <button onClick={handleDelete} data-testid="blog-remove">delete</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired
}

export default Blog
