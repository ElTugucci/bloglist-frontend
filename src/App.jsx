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
import { createBlog, blogDelete, blogLike, initializeBlogs } from "./reducers/blogReducer";
import { initializeUsers, setUser } from "./reducers/userReducer";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  const like = (id) => {
    try {
      dispatch(blogLike(id))
    } catch (exception) {
      console.log("Error updating blog:", exception);
    }
  }

  const deleteBlog = async (id) => {
    const currentBlog = blogs.find((b) => b.id === id);
    if (window.confirm(`Do you want to delete ${currentBlog.title} by ${currentBlog.author}`)) {
      try {
        dispatch(blogDelete(currentBlog.id))
        dispatch(setNotification(`${currentBlog.title} deleted successfully`, 5))
      } catch (exception) {
        dispatch(setError(`${exception.response.data.error}`, 5))

      }
    }
  };

  const addBlog = (blogObject) => {
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`${blogObject.title} by ${blogObject.author} is added`, 5))
  };

  const loginForm = () => (
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
  );

  const userStatus = () => {
    return (
      <div>
        <h3>{user.name}</h3>
        <button onClick={() => logout()}>logout</button>
      </div>
    );
  };

  const blogForm = () => (
    <Togglable buttonLabel="Add Blog">
      <BlogForm createBlog={addBlog}></BlogForm>
    </Togglable>
  );

  const blogList = () => {
    return (
      <div>
        <h2>Blogs</h2>
        {sortBlogs(blogs).map((blog) => (
          <Blog key={blog.id} blog={blog} like={() => like(blog.id)} deleteBlog={() => deleteBlog(blog.id)} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <Notification />
      <Error />
      {user === null && loginForm()}
      {user && userStatus()}
      {user && blogForm()}
      {user && blogList()}
    </div>
  );
};

export default App;
