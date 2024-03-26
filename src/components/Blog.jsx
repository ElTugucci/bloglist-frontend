import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { blogLike, blogDelete, commentAdd } from "../reducers/blogReducer";
import { setError } from "../reducers/errorReducer";
import { setNotification } from "../reducers/notificationReducer";
const Blog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showDelete, setShowDelete] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem("loggedBlogappUser"));
  const navigate = useNavigate()

  const blogs = useSelector(state => {
    return state.blogs
  })


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
        navigate('/')
      } catch (exception) {
        console.log(exception);
        dispatch(setError(`${exception.response.data.error}`, 5));
      }
    }
  };


  const addCommentHandler = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    event.target.comment.value = '';
    try {
      await dispatch(commentAdd(id, comment));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  const blogDiv = () => {
    const blog = blogs.find(b => b.id === id);
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
        <h4>comments</h4>
        <form onSubmit={addCommentHandler}>
          <input name="comment" />
          <button type="submit">add</button>
        </form>
        {blog.comments && blog.comments.length > 0 ? (
          <div>
            <ul>
              {blog.comments.map((c) => {
                return <li key={c + Math.random(10000000)}>{c}</li>
              })}
            </ul>
          </div >
        ) : (
          <div>no comments</div>
        )}

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
