import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Components/Home';
import Admission from '../Components/Admission';
const AppRouter = () => {  
  return (
    <div>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/admission' element={<Admission />} />
        </Routes>
      </Router>
    </div>
  )
}

export default AppRouter