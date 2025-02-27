import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from '../features/expenseSlice'
import authReducer from "../features/authSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        expenses: expenseReducer
    }
})