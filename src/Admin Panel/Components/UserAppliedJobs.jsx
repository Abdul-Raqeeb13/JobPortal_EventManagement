import React, { useEffect, useState } from 'react';
import firebase from '../../Config/Firebase';
import '../AdminCSS/UserAppliedJobs.css'; // Import the CSS file for styling

export default function UserAppliedJobs() {
  const [usersAppliedJobs, setUsersAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const appliedJobsSnapshot = await firebase.database().ref('AppliedJobs').get();
        const appliedJobsData = appliedJobsSnapshot.val();

        if (!appliedJobsData) return;

        const userIds = Object.keys(appliedJobsData);

        const usersDataPromises = userIds.map(async (userId) => {
          const userSnapshot = await firebase.database().ref(`users/${userId}`).get();
          const userData = userSnapshot.val();

          if (!userData) return null;

          const jobIds = Object.keys(appliedJobsData[userId]);

          const jobsPromises = jobIds.map(async (jobId) => {
            const jobSnapshot = await firebase.database().ref(`Jobs/${jobId}`).get();
            const jobData = jobSnapshot.val();
            const status = appliedJobsData[userId][jobId].status || 'Pending';
            return { jobId, ...jobData, status };
          });

          const jobsData = await Promise.all(jobsPromises);

          return {
            userId,
            ...userData,
            appliedJobs: jobsData,
          };
        });

        const allUsersData = await Promise.all(usersDataPromises);
        setUsersAppliedJobs(allUsersData.filter(data => data));
      } catch (error) {
        console.log('Error fetching jobs or user data:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleAction = async (userId, jobId, action) => {
    try {
      const appliedJobsRef = firebase.database().ref('AppliedJobs').child(userId).child(jobId);
      const updatedStatus = action === 'accept' ? 'Accepted' : 'Rejected';

      await appliedJobsRef.update({ status: updatedStatus });

      setUsersAppliedJobs((prevData) =>
        prevData.map((user) =>
          user.userId === userId
            ? {
                ...user,
                appliedJobs: user.appliedJobs.map((job) =>
                  job.jobId === jobId ? { ...job, status: updatedStatus } : job
                ),
              }
            : user
        )
      );
    } catch (error) {
      console.log('Error handling action:', error);
    }
  };

  return (
    <div>
      <h1 style={{marginTop:'10px'}}>User Applied Jobs</h1>
      {usersAppliedJobs.length > 0 ? (
        <div className="user-applied-jobs-container">
          {usersAppliedJobs.map((user) => (
            <div key={user.userId} className="user-card">
              <div className="user-info">
                <h2>{user.name}</h2>
                <h4>Email: {user.email}</h4>
              </div>
              {user.appliedJobs.length > 0 ? (
                <div className="jobs-list">
                  {user.appliedJobs.map((job) => (
                    <div key={job.jobId} className="job-card">
                      <h3 className="job-title">{job.jobTitle}</h3>
                      <p className="job-info"><strong>Description:</strong> {job.jobDescription}</p>
                      <p className="job-info"><strong>Experience:</strong> {job.experience} years</p>
                      <p className="job-info"><strong>Salary:</strong> ${job.salary}</p>
                      <p className="job-info"><strong>Location:</strong> {job.location}</p>
                      <p className="job-info"><strong>Status:</strong> {job.status}</p>
                      <div className="action-buttons">
                        <button className="accept-btn" onClick={() => handleAction(user.userId, job.jobId, 'accept')}>Accept</button>
                        <button className="reject-btn" onClick={() => handleAction(user.userId, job.jobId, 'reject')}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No jobs applied.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No users have applied for jobs.</p>
      )}
    </div>
  );
}
