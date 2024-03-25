import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { blogLike, blogDelete } from "../reducers/blogReducer"; // assuming blogDelete is imported from blogReducer
import { setError } from "../reducers/errorReducer";
import { setNotification } from "../reducers/notificationReducer";
const Blog = ({ blogs }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showDelete, setShowDelete] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem("loggedBlogappUser"));

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      const blog = blogs.find(b => b.id === id);
      if (blog && blog.user && loggedUser) {
        setShowDelete(loggedUser.name === blog.user.name);
      }
    }
  }, [blogs, id, loggedUser]);

  const like = () => {
    try {
      dispatch(blogLike(id));
    } catch (exception) {
      console.log("Error updating blog:", exception);
    }
  };

  const deleteBlog = async () => {
    const currentBlog = blogs.find(b => b.id === id);
    if (window.confirm(`Do you want to delete ${currentBlog.title} by ${currentBlog.author}`)) {
      try {
        dispatch(blogDelete(currentBlog.id));
        dispatch(setNotification(`${currentBlog.title} deleted successfully`, 5));
      } catch (exception) {
        console.log(exception);
        dispatch(setError(`${exception.response.data.error}`, 5));
      }
    }
  };

  const blogDiv = () => {
    const blog = blogs.find(b => b.id === id);

    const addComment = async (event) => {
      event.preventDefault()
      const comment = event.target.comment.value
      event.target.comment.value = ''

      console.log(comment);
    }

    return (
      <>
        <h2>{blog.title}</h2>
        <div> by {blog.author}</div>
        <a href={blog.url}>{blog.url}</a>
        <div>likes: {blog.likes}
          <button onClick={like}>like</button><br /></div>

        added by {blog.user && blog.user.name}<br />

        {showDelete && (
          <button className="deleteButton" onClick={deleteBlog}>
            delete
          </button>
        )}

        <p>comments</p>
        <form onSubmit={addComment}>
          <input name="comment" />
          <button type="submit">add</button>
        </form>


      </>
    );


  };

  if (!blogs) {
    return <h1>Loading....</h1>;
  }

  const blog = blogs.find(b => b.id === id);
  if (!blog) {
    return <h1>Loading...</h1>;
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} key={blog.id} className="blogDiv">
      {blogDiv()}
    </div>
  );
};

export default Blog;
