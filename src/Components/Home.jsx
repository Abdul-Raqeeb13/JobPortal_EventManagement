import React from 'react';
import '../Components/CSS/Home.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
export default function Home() {

  const nav = useNavigate()
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to JobPortal</h1>
          <p className="hero-subtitle">Your gateway to the best job opportunities</p>
          {/* <Link  to="/jobs">Find Jobs</Link> */}
          <Button variant='contained' onClick={()=>nav('/jobs')}>Find Jobs</Button>
        </div>
      </header>
      <section className="features-section">
        <div className="feature">
          <h2 className="feature-title">Browse Jobs</h2>
          <p className="feature-description">Explore a wide range of job listings tailored to your preferences.</p>
        </div>
        <div className="feature">
          <h2 className="feature-title">Post a Job</h2>
          <p className="feature-description">Reach out to potential candidates by posting job openings quickly and easily.</p>
        </div>
        <div className="feature">
          <h2 className="feature-title">Manage Applications</h2>
          <p className="feature-description">Track and manage job applications in a user-friendly dashboard.</p>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2024 JobPortal. All rights reserved.</p>
      </footer>
    </div>
  );
}
