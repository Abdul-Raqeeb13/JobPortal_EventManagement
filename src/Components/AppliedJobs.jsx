import React, { useEffect, useState } from 'react';
import firebase from '../Config/Firebase'; // Adjust the import according to your setup
import './CSS/AppliedJobs.css'; // Import CSS file for styling

export default function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const id = localStorage.getItem("UserID"); // Get the user ID from local storage
        setUserId(id);

        // Fetch applied job data for the user (including status)
        const snapshot = await firebase.database().ref(`AppliedJobs/${id}`).get();
        const appliedJobsData = snapshot.val();

        if (appliedJobsData) {
          // Convert applied jobs object to an array of promises
          const jobPromises = Object.entries(appliedJobsData).map(async ([jobId, appliedJobDetails]) => {
            const jobSnapshot = await firebase.database().ref(`Jobs/${jobId}`).get();
            const jobData = jobSnapshot.val();
            return {
              id: jobId,
              ...jobData,
              status: appliedJobDetails.status // Include status from AppliedJobs
            };
          });

          // Wait for all job data to be fetched
          const jobs = await Promise.all(jobPromises);
          console.log('Fetched Jobs with Status:', jobs); // Debugging: log fetched jobs
          setAppliedJobs(jobs);
        } else {
          setAppliedJobs([]); // No jobs applied
        }
      } catch (error) {
        console.log('Error fetching applied jobs:', error);
      }
    };

    fetchAppliedJobs(); // Call the async function inside useEffect
  }, []); // Empty dependency array to run useEffect only once

  return (
    <div className="applied-jobs">
      <h1 className="title">Your Applied Jobs</h1>
      {appliedJobs.length > 0 ? (
        <div className="job-grid">
          {appliedJobs.map((job) => {
            const { id, jobTitle, jobDescription, experience, salary, location, status } = job;
            return (
              <div key={id} className="job-card">
                <div className="card-content">
                  <h3 className="job-title">{jobTitle}</h3>
                  <p className="job-info"><strong>Description:</strong> {jobDescription}</p>
                  <p className="job-info"><strong>Experience:</strong> {experience} years</p>
                  <p className="job-info"><strong>Salary:</strong> ${salary}</p>
                  <p className="job-info"><strong>Location:</strong> {location}</p>
                  <p className="job-info"><strong>Status:</strong> {status || 'N/A'}</p> {/* Display job status */}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-jobs">You have not applied for any jobs yet.</p>
      )}
    </div>
  );
}
