import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    expense: []
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
        }
    }
})

export const { addExpense, removeExpense } = expenseSlice.actions;
export default expenseSlice.reducer