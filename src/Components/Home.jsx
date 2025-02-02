import React from 'react'
import intro from '../Assets/study.svg'
import { Link } from 'react-router'
import logo from '../Assets/logo.svg'
const Home = () => {
	return (
		<div className='home-bg'>
			<div className="container-intro">
				<div className="intro">
					<img src={logo} className='logo-img' alt="" />
					<img src={intro} className='intro-img' alt="" />
					<Link to='/admission' className='admission-btn btn'>Admisssion</Link>
				</div>
			</div>
		</div>
	)
}

export default Home