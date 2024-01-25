import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorNotification, setErrorNotification] = useState(null)

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
    setNotification('Logged out')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`${user.username} logged in`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setErrorNotification(`${exception.response.data.error}`)
      setTimeout(() => {
        setErrorNotification(null)
      }, 5000)
    }
  }

  const like = async (id) => {
    try {
      const blog = await blogs.find((n) => n.id === id)
      const newObject = {
        ...blog,
        likes: blog.likes + 1
      }
      try {
        const response = await blogService.like(blog.id, newObject)
        setBlogs(blogs.map((b) => (b.id !== id ? b : response)))
      } catch (exception) {
        console.log('Error updating blog:', exception)
      }
    } catch (error) {
      console.log('Error finding blog:', error)
    }
  }

  const deleteBlog = async (id) => {
    const currentBlog = blogs.find(b => b.id === id)
    if (window.confirm(`Do you want to delete ${currentBlog.title} by ${currentBlog.author}`)) {

      try {
        await blogService.remove(id)
        setBlogs(blogs.filter((b) => b.id !== id))
      }
      catch (exception) {
        setErrorNotification(`${exception.response.data.error}`)
        setTimeout(() => {
          setErrorNotification(null)
        }, 5000)
      }
    }
  }

  const addBlog = (blogObject) => {
    const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat({ ...returnedBlog, user: user }))
        setNotification(`${blogObject.title} by ${blogObject.author} is added`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input type="text"
          id='username'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input type="password"
          id='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type='submit'>login</button>
    </form>
  )

  const userStatus = () => {
    return (
      <div>
        <h3>{user.name}</h3><button onClick={() => logout()}>logout</button>
      </div>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel='Add Blog'>
      <BlogForm
        createBlog={addBlog}
      ></BlogForm>
    </Togglable>
  )

  const blogList = () => (
    <div>
      <h2>Blogs</h2>
      {(sortBlogs(blogs))
        .map((blog) =>
          <Blog key={blog.id} blog={blog} like={() => like(blog.id)} deleteBlog={() => deleteBlog(blog.id)} />
        )}
    </div>
  )

  return (
    <div>
      <Notification message={notification} />
      <Error message={errorNotification} />
      {user === null && loginForm()}
      {user && userStatus()}
      {user && blogForm()}
      {user && blogList()}
    </div>
  )
}

export default App