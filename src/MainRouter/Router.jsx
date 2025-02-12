import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Components/Home';
import Admission from '../Components/Admission';
import Success from '../Components/Success';
import OneTimeRegistration from '../Components/OneTimeRegistration';
const AppRouter = () => {  
  return (
    <div>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/admission' element={<Admission />} />
          <Route path='/success' element={<Success />} />
          <Route path='/otr' element={<OneTimeRegistration />} />
        </Routes>
      </Router>
    </div>
  )
}

export default AppRouter