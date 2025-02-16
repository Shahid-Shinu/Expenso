import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export const loginUser = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/login`, { username, password });
    dispatch(loginSuccess(response.data));
  } catch (error) {
    console.error("Login failed", error);
  }
};

export const logoutUser = () => async (dispatch) => {
  await axios.post(`${BACKEND_URL}/api/logout`);
  dispatch(logoutSuccess());
};

export const signupUser = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/signup`, { username, password });
    dispatch(loginSuccess(response.data));
  } catch (error) {
    console.error("Signup failed", error);
  }
};

export default authSlice.reducer;
