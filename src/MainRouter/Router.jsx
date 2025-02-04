import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Components/Home';
import Admission from '../Components/Admission';
import Success from '../Components/Success';
const AppRouter = () => {  
  return (
    <div>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/admission' element={<Admission />} />
          <Route path='/success' element={<Success />} />
        </Routes>
      </Router>
    </div>
  )
}

export default AppRouter