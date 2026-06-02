import { useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box, Link as MuiLink } from '@mui/material'

const Blog = ({ blogs, user, onDelete, onLike }) => {
  const id = useParams().id
  const blog = blogs.find(n => n.id === id)
  if (!blog) return null

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
    <Card sx={{ mt: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          by {blog.author}
        </Typography>

        <MuiLink href={blog.url} target="_blank" rel="noopener" underline="hover">
          {blog.url}
        </MuiLink>


        <Typography variant="body2" sx={{ mt: 1 }}>
          Added by {blog.user?.name}
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">{blog.likes} likes</Typography>
          {user && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLike}
              data-testid="like-button"
            >
              LIKE
            </Button>
          )}
          {showDelete && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              data-testid="delete-button"
            >
              REMOVE
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

Blog.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired
}

export default Blog
