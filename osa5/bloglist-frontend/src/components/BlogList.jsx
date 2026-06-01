import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, user, handleLogout, handleCreateBlog, handleDeleteBlog, handleLikeBlog, blogFormRef }) => {
    return (
        <div>
            <h2>Blogs</h2>
            <ul>
                {blogs
                    .slice()
                    .sort((a, b) => b.likes - a.likes)
                    .map(blog => (
                        <li key={blog.id}>
                            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export default BlogList
