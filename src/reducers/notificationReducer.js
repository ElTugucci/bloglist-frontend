import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: "",
    reducers: {
        showNotification(state, action) {
            return action.payload;
        },
        hideNotification() {
            return "";
        },
    },
});

export const setNotification = (text, time) => {
    return (dispatch) => {
        dispatch(showNotification(text));
        setTimeout(() => {
            dispatch(hideNotification());
        }, time * 1000);
    };
};

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
