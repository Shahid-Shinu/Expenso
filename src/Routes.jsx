import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './Home';

const AppRoutes = () => {
    return (
        <Routes>
        <Route path="/" component={Home} />
        <Route path="*" component={<>404 Not Found</>} /> 
        </Routes>
    )
}
  
export default AppRoutes;