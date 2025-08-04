import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
    } catch (exception) {
      setNotification({ message: 'wrong username/password', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    const returnedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(returnedBlog))

    setNotification({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' })
    setTimeout(() => setNotification(null), 5000)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>    
    </div>  
  )

   const bloglist = () => (
<div>
  <h2>Blogs</h2>
  <p>
    {user.name} logged in
    <button onClick={handleLogout}>logout</button>
  </p>

  <h3>Create new</h3>
  <form onSubmit={handleCreateBlog}>
    <div>
      title:
      <input 
        type="text"
        value={newTitle}
        onChange={({ target }) => setNewTitle(target.value)}
      />
    </div>
    <div>
      author:
      <input 
        type="text"
        value={newAuthor}
        onChange={({ target }) => setNewAuthor(target.value)}
      />
    </div>
    <div>
      url:
      <input 
        type="text"
        value={newUrl}
        onChange={({ target }) => setNewUrl(target.value)}
      />
    </div>
    <button type="submit">create</button>
  </form>

  {blogs.map(blog =>
    <Blog key={blog.id} blog={blog} />
  )}
</div>
  ) 

  

  return (
    <div>
      <Notification message={notification} />
      {!user ? loginForm() : bloglist()}
    </div>
  )
}

export default App