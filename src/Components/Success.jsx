import React from 'react'
import { Link } from 'react-router'
import success from '../Assets/success (1).png'


const Success = () => {
  return (
		<div className='home-bg'>
        <div className="container-intro">
				<div className="intro">
					<img src={success} className='success-img' alt="" />
					<h3 className='tx'>Application Submitted Successfully</h3>
					<Link to='/' className='admission-btn btn'>Get Back to Home Page</Link>
				</div>
			</div>
    </div>
  )
}

export default Success