import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import ExpenseMenu from "./components/Menu";
import DashboardFooter from './components/DashboardFooter';
import { Home } from './Home';
import Expense  from './Expense';

function App() {

  return (
    <Router>
      <div>
        <div className="flex justify-end m-5">
          <ExpenseMenu />
        </div>
        <div className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add-expense" element={<Expense />} />
          </Routes>
        </div>
        <div className="flex flex-col min-h-screen justify-between">
          <DashboardFooter />
        </div>
      </div>
    </Router>
  )
}

export default App
