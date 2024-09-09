import React, { useEffect, useState } from 'react';
// import '../Components/CSS/ViewJobs.css'; // Import the CSS file for styling
import '../AdminCSS/ViewJob.css'
import firebase from '../../Config/Firebase';
// import

export default function ViewJobs() { 
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await firebase.database().ref('Jobs').get();
        const data = snapshot.val();
        const jobList = data ? Object.keys(data).map((jobId) => ({ jobId, ...data[jobId] })) : []; // Convert object to array with jobId
        setJobs(jobList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobs(); // Call the async function inside useEffect
  }, []); // Empty dependency array to run useEffect only once

  // Function to handle job deletion
  const handleDelete = async (jobId) => {
    try {
      // Remove the job from Firebase
      await firebase.database().ref(`Jobs/${jobId}`).remove();

      // Update the local state to remove the deleted job
      setJobs((prevJobs) => prevJobs.filter((job) => job.jobId !== jobId));
    } catch (error) {
      console.log('Error deleting job:', error);
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center", fontFamily: "cursive" }}>Active Jobs</h1>
    <div className="job1-list">
      {jobs.length > 0 ? (
        jobs.map((job) => {
          const { jobId, jobTitle, jobDescription, experience, salary, location } = job;
          return (
            <div key={jobId} className="job1-card">
              <div className="card1-content">
                <h3 className="job1-title">{jobTitle}</h3>
                <p className="job1-description"><strong>Job Description:</strong> {jobDescription}</p>
                <p className="job1-info"><strong>Experience:</strong> {experience} years</p>
                <p className="job1-info"><strong>Salary:</strong> ${salary}</p>
                <p className="job1-info"><strong>Location:</strong> {location}</p>
              </div>
              <button className="delete1-btn" onClick={() => handleDelete(jobId)}>Delete</button>
            </div>
          );
        })
      ) : (
        <p>No jobs available</p>
      )}
    </div>
    </>
  );
}
