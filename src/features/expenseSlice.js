import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    expenses: [],
    userId: 0
}

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        addExpense: (state, action) => {
            state.expenses.push(action.payload)
        },
        removeExpense: (state, action) => {
            state.expenses = state.expenses.filter(exp => exp.id != action.payload)
        },
        addUser: (state, action) => {
            state.userId = action.payload
        }
    }
})

export const { addExpense, removeExpense } = expenseSlice.actions;
export default expenseSlice.reducer