import { Link } from 'react-router-dom'
import { Card, CardContent, Typography, Link as MuiLink, Box } from '@mui/material'

const BlogList = ({ blogs }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Blogs
      </Typography>

      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <Box
              key={blog.id}
              component="li"
              sx={{
                py: 1.2,
                borderBottom: '1px solid #e0e0e0',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(25,118,210,0.06)'
                }
              }}
            >
              <MuiLink
                component={Link}
                to={`/blogs/${blog.id}`}
                underline="none"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: 'primary.main'
                }}
              >
                {blog.title}
              </MuiLink>

              <Typography variant="body2" color="text.secondary">
                by {blog.author}
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default BlogList
