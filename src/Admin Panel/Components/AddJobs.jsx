import React from 'react';
import { useForm } from 'react-hook-form';
// import '../Components/CSS/AddJobs.css'; // Import the CSS file for styling
import '../AdminCSS/AddJob.css'
import firebase from '../../Config/Firebase'

const AdminAddJobForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  let jobs = firebase.database().ref("Jobs")
  const onSubmit = async (data) => {
    let jobsKey = jobs.push().getKey()

     let jobsDetails = {
      ...data,
      jobID : jobsKey
    }

    await jobs.child(jobsKey).set(jobsDetails)


    // Handle form submission (e.g., send data to the backend)
    reset(); // Reset the form after submission
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Job</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="job-form">
        
        {/* Job Title (Dropdown) */}
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <select id="jobTitle" {...register('jobTitle', { required: true })}>
            <option value="">Select Job Title</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="React Native Developer">React Native Developer</option>
            <option value="Laravel Developer">Laravel Developer</option>
            <option value="NodeJS Developer">NodeJS Developer</option>
          </select>
          {errors.jobTitle && <span className="error">Job Title is required</span>}
        </div>
        
        {/* Job Description */}
        <div className="form-group">
          <label htmlFor="jobDescription">Job Description</label>
          <textarea 
            id="jobDescription" 
            placeholder="Enter Job Description" 
            {...register('jobDescription', { required: true })}
          ></textarea>
          {errors.jobDescription && <span className="error">Job Description is required</span>}
        </div>

        {/* Experience */}
        <div className="form-group">
          <label htmlFor="experience">Experience (years)</label>
          <input 
            type="number" 
            id="experience" 
            placeholder="Enter Required Experience" 
            {...register('experience', { required: true })}
          />
          {errors.experience && <span className="error">Experience is required</span>}
        </div>

        {/* Salary */}
        <div className="form-group">
          <label htmlFor="salary">Salary ($)</label>
          <input 
            type="number" 
            id="salary" 
            placeholder="Enter Salary" 
            {...register('salary', { required: true })}
          />
          {errors.salary && <span className="error">Salary is required</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input 
            type="text" 
            id="location" 
            placeholder="Enter Location" 
            {...register('location', { required: true })}
          />
          {errors.location && <span className="error">Location is required</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">Add Job</button>
      </form>
    </div>
  );
};

export default AdminAddJobForm;
