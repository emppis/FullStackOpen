import { useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

const Blog = ({ blogs, user, onDelete, onLike }) => {
  const id = useParams().id
  const [visible, setVisible] = useState(false)
  const blog = blogs.find(n => n.id === id)

  if (!blog) return null

  console.log('Blog.jsx render, user:', user)
  console.log('Blog.jsx render, blog.user:', blog.user)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
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

  const handleLike = () => {
    if (!user) return
    onLike(blog.id)
  }

  const showDelete =
    user &&
    blog.user &&
    (blog.user.username === user.username || blog.user === user.id)

  return (
    <div style={blogStyle} className="blog">
      <div>
        <h3><span data-testid="blog-title">{blog.author}: {blog.title}</span></h3>
        <div data-testid="blog-url"><a href={blog.url}>{blog.url}</a></div>
        <div>
          <span data-testid="blog-likes">likes {blog.likes}</span>
          {user && (
            <button onClick={handleLike} data-testid="like-button">like</button>
          )}
        </div>
        <div data-testid="blog-user">Added by {blog.user?.name}</div>
        {showDelete && (
          <button onClick={handleDelete} data-testid="delete-button">remove</button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired
}

export default Blog
