import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Error from "./components/Error";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import { setNotification } from "./reducers/notificationReducer";
import { useSelector, useDispatch } from "react-redux"
import { setError } from "./reducers/errorReducer";
import { createBlog, initializeBlogs } from "./reducers/blogReducer";
import { initializeUsers, setUser } from "./reducers/userReducer";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { getUsers } from "./services/users"
import { Table } from 'react-bootstrap'
import User from "./components/User";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()

  const blogs = useSelector(state => {
    return state.blogs
  })

  const user = useSelector(state => {
    return state.user
  })

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers()
        setUsers(users)
      }
      catch {
        console.log('Error fetching users ');
      }
    }
    fetchUsers()
  }, [])


  const sortBlogs = (blogs) => {
    const sortedBlogs = [...blogs];
    return sortedBlogs.sort((a, b) => b.likes - a.likes);
  };

  const logout = () => {
    window.localStorage.clear();
    dispatch(setUser(null))
    dispatch(setNotification("Logged out", 5))
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user))
      setUsername("");
      setPassword("");
      dispatch(setNotification(`${user.username} logged in`, 5))

    } catch (exception) {
      console.log(exception);
      dispatch(setError(`${exception.response.data.error}`, 5));
    }
  };

  const addBlog = (blogObject) => {
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`${blogObject.title} by ${blogObject.author} is added`, 5))
  };

  const LoginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            id="username"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            id="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    )
  }

  const UserPage = () => {
    return (
      <div>
        <h1>users</h1>
        <Table striped>
          <tbody>
            <tr key="name">
              <td>
                name
              </td>
              <td>
                number of blogs
              </td>
            </tr>
            {users.map(u =>
              <tr key={u.id}>
                <td>
                  <Link to={`/users/${u.id}`}>
                    {u.name}
                  </Link>
                </td>
                <td>
                  {u.blogs.length}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    )
  }

  const UserStatus = () => {
    return (
      <div>{user.name} logged in
        <button onClick={() => logout()}>logout</button>
      </div>
    );
  };

  const TogglableForm = () => {
    return (
      <Togglable buttonLabel="Add Blog">
        <BlogForm createBlog={addBlog}></BlogForm>
      </Togglable>
    )
  }

  const BlogList = () => {
    return (
      <div>
        <h2>Blogs</h2>
        {sortBlogs(blogs).map((blog) => (
          <div key={blog.id}>
            <Link key={blog.id} to={`/blogs/${blog.id}`} >
              {blog.title}
            </Link>
          </div>
        ))
        }
      </div >
    )
  }

  const Home = () => {
    return (
      <div>
        {user && <TogglableForm />}
        {user && < BlogList />}
      </div>
    )
  }

  return (
    <Router>
      <div>
        <Link to="/">home</Link>
        <Link to="/users"> users</Link>
        {!user && <LoginForm />}
        {user && <UserStatus />}
      </div>
      <div>
        <Notification />
        <Error />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/users/:id" element={<User users={users} />} />
          <Route path="/blogs/:id" element={<Blog blogs={blogs}></Blog>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
