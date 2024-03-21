import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: [],
    reducers: {
        setUser(state, action) {
            return action.payload
        }
    }
})

export const initializeUsers = () => {
    return dispatch => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            dispatch(setUser(user));
        }
    };
};

export default userSlice.reducer
export const { setUser } = userSlice.actions