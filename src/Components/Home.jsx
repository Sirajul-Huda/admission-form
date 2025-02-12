import React from 'react'
import intro from '../Assets/studyy.jpeg'
import { Link } from 'react-router'
import logo from '../Assets/logo.svg'

const Home = () => {
	return (
		<div className='home-bg'>
			<div className="container-intro">
				<div className="intro">
					<img src={logo} className='logo-img' alt="" />
					<img src={intro} className='intro-img' alt="" />
					<div className="button-box">
						<div className="dv-width">
							<Link to='/admission' className='admission-btn btn'>Admisssion</Link>
						</div>
						<div className="dv-width">
							<Link to='/otr' className='otr-btn btn'>One Time Registration</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home