import { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Button, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Create new
      </Typography>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            placeholder="Title"
            id="title"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            placeholder="Author"
            id="author"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            placeholder="URL"
            id="url"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  )
}


BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
