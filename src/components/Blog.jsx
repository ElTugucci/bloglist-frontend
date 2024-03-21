import { useState, useEffect } from "react";

const Blog = ({ blog, like, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [viewAll, setViewAll] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem("loggedBlogappUser"));
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (blog && blog.user && loggedUser) {
      setShowDelete(loggedUser.name === blog.user.name);
    }
  }, [blog, loggedUser]);

  const toggleView = () => {
    setViewAll((prevViewAll) => !prevViewAll);
  };

  const blogDiv = () => {
    return (
      <div>
        <ul>
          <li>
            {blog.title}
            <button onClick={toggleView}> {viewAll ? "hide" : "show"} </button>
          </li>
          <li>{blog.author}</li>
        </ul>
      </div>
    );
  };
  const details = () => {
    return (
      <ul>
        <li>
          {blog.url}
          <br />
        </li>
        <li>
          {blog.likes}
          <button onClick={like}>like</button>
          <br />
        </li>
        <li>
          {blog.user.name}
          <br />
        </li>
        {showDelete && (
          <li>
            <button className="deleteButton" onClick={deleteBlog}>
              delete
            </button>
          </li>
        )}
      </ul>
    );
  };

  return (
    <div style={blogStyle} key={blog.id} className="blogDiv">
      {blogDiv()}
      {viewAll && details()}
    </div>
  );
};

export default Blog;
