import React, { useEffect, useState } from 'react';
import firebase from '../Config/Firebase';
import { useNavigate, useNavigation } from 'react-router-dom';

export default function UpdateProfile() {
    const naviagte = useNavigate()
    const [updateUserId, setUpdateUserId] = useState("");
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        // ProfileImage: "" // you can add this if you plan to include a profile image later
    });

    // Fetch the current user profile and set it in the form fields
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("UserID");
                setUpdateUserId(userId);
                
                if (userId) {
                    const snap = await firebase.database().ref("users").child(userId).get();
                    if (snap.exists()) {
                        const userData = snap.val();
                        // Set the form fields with existing user data
                        setFormData({
                            userName: userData.userName || "",
                            email: userData.email || "",
                            password: userData.password || "" // Consider hashing passwords in real applications
                        });
                    } else {
                        console.log("No user data found");
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, []);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission to update profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update the user profile in Firebase without changing the userId
            await firebase.database().ref("users").child(updateUserId).update({
                userName: formData.userName,
                email: formData.email,
                password: formData.password // Consider securely updating passwords in real applications
            });

            // Update local storage with new data
            localStorage.setItem("UserName", formData.userName);
            console.log("User profile and local storage updated successfully");
            naviagte('/')
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Update Your Profile</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        required
                    />
                </div>

                <button type="submit" style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Submit
                </button>
            </form>
        </div>
    );
}
