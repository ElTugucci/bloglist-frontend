import { createSlice } from "@reduxjs/toolkit";
import blogs from "../services/blogs";

const blogSlice = createSlice({
    name: "blogs",
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        appendBlog(state, action) {
            state.push(action.payload)
        },
        likeBlog(state, action) {
            const id = action.payload.id
            const blogToLike = state.find(b => b.id === id)
            const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1 }
            return state.map(blog =>
                blog.id === id ? likedBlog : blog)
        },
        removeBlog(state, action) {
            return state.filter((blog) => blog.id !== action.payload.id)
        },
        addComment(state, action) {
            const { id, comments } = action.payload;
            console.log(action.payload)
            const blog = state.find(blog => blog.id === id);
            const newBlogComment = { ...blog, comments: comments }
            console.log(newBlogComment);
            return state.map(blog => blog.id === id ? newBlogComment : blog)
        },
    }
})

export const { setBlogs, appendBlog, likeBlog, removeBlog, addComment } = blogSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogList = await blogs.getAll()
        dispatch(setBlogs(blogList))
    }
}

export const createBlog = content => {
    return async dispatch => {
        const newBlog = await blogs.create(content)
        dispatch(appendBlog(newBlog))
    }
}

export const blogDelete = id => {
    return async dispatch => {
        await blogs.remove(id)
        dispatch(removeBlog({ id }))
    }
}

export const blogLike = id => {
    return async dispatch => {
        const newLike = await blogs.like(id)
        dispatch(likeBlog(newLike))
    }
}

export const commentAdd = (id, comment) => {
    return async dispatch => {
        try {
            const newComment = await blogs.comment(id, comment);
            dispatch(addComment(newComment));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
};
export default blogSlice.reducer