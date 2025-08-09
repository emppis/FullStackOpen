import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, onDelete, onLike }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

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

  const handleLike = async () => {
    const updatedBlog = {
      user: blog.user.id,
      likes: likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setLikes(returnedBlog.likes)
      if (onLike) {
        onLike(blog)
      }
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const handleDelete = async () => {
    const confirm = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if (!confirm) return

    try {
      await blogService.remove(blog.id)
      onDelete(blog.id)
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const showDelete = user && blog.user && user.username === blog.user.username

  return (
    <div style={blogStyle}>
      {!visible ? (
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>view</button>
        </div>
      ) : (
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
          <div>{blog.url}</div>
          <div>
            likes {likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {showDelete && (
            <button onClick={handleDelete}>delete</button>
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
  onLike: PropTypes.func
}


export default Blog
