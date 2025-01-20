import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes'

function App() {

  return (
    <Router>
      <div className='font-extrabold'>Home</div>
      <AppRoutes />
    </Router>
  )
}

export default App
