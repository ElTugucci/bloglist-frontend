import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
    name: "error",
    initialState: "",
    reducers: {
        showError(state, action) {
            return action.payload;
        },
        hideError() {
            return "";
        },
    },
});

export const setError = (text, time) => {
    return (dispatch) => {
        dispatch(showError(text));
        setTimeout(() => {
            dispatch(hideError());
        }, time * 1000);
    };
};

export const { showError, hideError } = errorSlice.actions;
export default errorSlice.reducer;
