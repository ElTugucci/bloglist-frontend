import { useState, useEffect } from "react";
import Blog from "./Blog";

import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import { setNotification } from "../reducers/notificationReducer";
import { useSelector, useDispatch } from "react-redux"
import { setError } from "../reducers/errorReducer";
import { createBlog, blogDelete, blogLike, initializeBlogs } from "../reducers/blogReducer";
const Home = () => {
    const dispatch = useDispatch()
    const blogs = useSelector(state => {
        return state.blogs
    })

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])


    const sortBlogs = (blogs) => {
        const sortedBlogs = [...blogs];
        return sortedBlogs.sort((a, b) => b.likes - a.likes);
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
            {user && blogForm()}
            {user && blogList()}
        </div>
    )
}
export default Home