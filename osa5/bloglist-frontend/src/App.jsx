import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import {
  Routes, Route, Link, useNavigate
} from 'react-router-dom'

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      setNotification({ message: 'wrong username/password', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    navigate('/')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)

      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility()
      }

      navigate('/')
    } catch (error) {
      setNotification({ message: 'error creating blog', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      await blogService.remove(id)   // 🔹 tämä puuttuu
      setBlogs(blogs.filter(blog => blog.id !== id))
      navigate('/')
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const handleLikeBlog = async (id) => {
    const blogToLike = blogs.find(b => b.id === id)
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user.id
    }

    const returnedBlog = await blogService.update(id, updatedBlog)
    setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
  }


  return (

    <div>
      <nav>
        <Link to="/">blogs</Link>{' '}
        {user && <Link to="/create">new blog</Link>}{' '}
        {!user && <Link to="/login">login</Link>}{' '}
        {user && <button onClick={handleLogout}>logout</button>}
      </nav>

      <Notification message={notification} />

      <Routes>
        <Route path="blogs/:id"
          element={
            <Blog
              blogs={blogs}
              user={user}
              onDelete={handleDeleteBlog}
              onLike={handleLikeBlog} />
          } />
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              user={user}
              handleLogout={handleLogout}
              handleCreateBlog={handleCreateBlog}
              handleDeleteBlog={handleDeleteBlog}
              handleLikeBlog={handleLikeBlog}
              blogFormRef={blogFormRef}
            />

          }
        />
        <Route
          path="/login"
          element={
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
          }
        />
        <Route
          path="/create"
          element={
            <BlogForm
              createBlog={handleCreateBlog}
            />
          }
        />
      </Routes>
    </div>

  )
}

export default App
