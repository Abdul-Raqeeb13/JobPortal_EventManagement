import React, { useEffect, useState } from 'react';
import firebase from '../Config/Firebase'; // Adjust the import according to your setup
import './CSS/Jobs.css'; // Import CSS file for styling

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [userId, setUserId] = useState('');
  const [appliedJobs, setAppliedJobs] = useState({}); // Store applied jobs data here

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const id = localStorage.getItem("UserID"); // Get the user ID from local storage
        setUserId(id);

        // Fetch applied job IDs and statuses for the user
        const appliedSnapshot = await firebase.database().ref(`AppliedJobs/${id}`).get();
        const appliedJobIds = appliedSnapshot.val() || {};

        setAppliedJobs(appliedJobIds);

        // Fetch all jobs
        const snapshot = await firebase.database().ref('Jobs').get();
        const data = snapshot.val();
        const jobList = data ? Object.entries(data) : []; // Convert object to array of [id, job]

        // Filter out jobs that the user has already applied for
        const filteredJobs = jobList.filter(([jobId]) => !appliedJobIds[jobId]);

        setJobs(filteredJobs);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobs(); // Call the async function inside useEffect
  }, []); // Empty dependency array to run useEffect only once

  const applyForJob = async (jobId) => {
    try {
      const id = userId;
      const jobSnapshot = await firebase.database().ref(`Jobs/${jobId}`).get();
      const jobData = jobSnapshot.val();

      const appliedJobsData = {
        ...jobData,
        appliedBy: id, // Optional: Add user ID to the applied job data
        status: 'pending', // Add status field with default value 'pending'
      };

      // Store applied job data in Firebase under the user's AppliedJobs
      await firebase.database().ref(`AppliedJobs/${id}/${jobId}`).set(appliedJobsData);

      // Remove the applied job from the local state
      setJobs((prevJobs) => prevJobs.filter(([id]) => id !== jobId));

      // Update the applied jobs state
      setAppliedJobs((prevState) => ({
        ...prevState,
        [jobId]: appliedJobsData,
      }));
    } catch (error) {
      console.log('Error applying for job:', error);
    }
  };

  return (
    <>
      <div className="job-list">
      <h1 className="title">Active Jobs</h1>
        {jobs.length > 0 ? (
          <div className="job-grid">
            {jobs.map(([jobId, job]) => {
              const { jobTitle, jobDescription, experience, salary, location } = job;
              return (
                <div key={jobId} className="job-card">
                  <div className="card-content">
                    <h3 className="job-title">{jobTitle}</h3>
                    <p className="job-info"><strong>Description:</strong> {jobDescription}</p>
                    <p className="job-info"><strong>Experience:</strong> {experience} years</p>
                    <p className="job-info"><strong>Salary:</strong> ${salary}</p>
                    <p className="job-info"><strong>Location:</strong> {location}</p>
                    <button className="submit-btn" onClick={() => applyForJob(jobId)}>Apply</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-jobs">No jobs available.</p>
        )}
      </div>
    </>
  );
}
