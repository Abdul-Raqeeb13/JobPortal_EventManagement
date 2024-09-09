import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router';
import NavbarLogo from '../Assets/Images/NavbarBrandBgRemover.png';
import { useAuth } from '../Components/AuthContext';
import { ToastContainer, toast } from "react-toastify";
import Dropdown from 'react-bootstrap/Dropdown';
import firebase from '../Config/Firebase';
import './NavbarMain.css';

export default function Header() {
    const { isAuthenticated, logout } = useAuth();
    const [userProfile, setUserProfile] = useState("");
    const [loginUserId, setLoginUserId] = useState("");
    const nav = useNavigate();

    // this is used to get the userID than get profile image
    useEffect(() => {
        if (isAuthenticated) {
            // Delay the fetch by 5 seconds as per your original code
           
            setTimeout(() => {
                const fetchData = async () => {
                    try {
                        let userId = localStorage.getItem('UserID');
                        console.log(userId);
                        
                        if (userId) {
                            const snap = await firebase.database().ref("users").child(userId).get();
                            if (snap.val()) {
                                let UserData = snap.val();
                                setUserProfile(UserData.profileImage);
                                setLoginUserId(userId); // store the userId if needed
                            } else {
                                console.log("Empty data");
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                };
        
                fetchData();
            }, 2000);
        }
    }, [isAuthenticated]); // Now the effect runs only if isAuthenticated is true

    // logout the user
    const logoutUser = async () => {
        toast.success("Logout Successful", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        logout();
        nav("/signin");
    };

    // open login form
    const loginForm = () => {
        nav('/signup');
    };

    // delete the account and alson delete the auth
    const deleteAccount = async () => {
        logout()
        setUserProfile("")
        setLoginUserId("")
        try {
            const user = firebase.auth().currentUser; // Get the current authenticated user
            
            // Remove user data from Firebase Realtime Database
            await firebase.database().ref('users').child(loginUserId).remove();
            console.log('User data deleted from database');
    
            // Delete user's authentication profile
            if (user) {
                await user.delete();
                console.log('User authentication profile deleted');
            }
    
            // Show success message
            toast.success("Account deleted successfully", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
    
            // Navigate to signup after deletion
            nav('/signup');
        } 
        catch (error) {
            console.error("Error deleting account: ", error);
            toast.error("Failed to delete account. Please log in again and try.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
    
            // If an error occurs (e.g., if the user is not logged in), force the user to log in again
            if (error.code === 'auth/requires-recent-login') {
                // Force a logout and redirect to login
                logout();
                nav('/signin');
            }
        }
    };


    const updateProfile = () => {
        nav('/updateProfile')
    }
    
 
    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <Navbar bg="primary" expand="lg" variant="dark">
                <Container>
                    <img src={NavbarLogo} alt="Logo" style={{ width: '50px', height: 'auto', backgroundColor: "transparent" }} />
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto me-auto">
                            <Nav.Link as={Link} to="/" className="text-white">
                                Home
                            </Nav.Link>
                            <Nav.Link as={Link} to="/jobs" className="text-white">
                                Jobs
                            </Nav.Link>
                            <Nav.Link as={Link} to="/appliedjobs" className="text-white">
                                Applied Jobs
                            </Nav.Link>
                            <Nav.Link as={Link} to="/events" className="text-white">
                                Events
                            </Nav.Link>
                            <Nav.Link as={Link} to="/userjoinevent" className="text-white">
                                Join Events
                            </Nav.Link>
                         
                        </Nav>
                        <Nav>
                            {isAuthenticated ? (
                                <Dropdown>
                                    <Dropdown.Toggle as="div" className="profileImg" style={{ border: 'none', background: 'none' }}>
                                        <img
                                            src={userProfile}
                                            alt="profile"
                                            style={{
                                                cursor: 'pointer',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px'
                                            }}
                                        />
                                    </Dropdown.Toggle>
                                    
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={logoutUser}>Logout</Dropdown.Item>
                                        <Dropdown.Item onClick={deleteAccount}>Delete Account</Dropdown.Item>
                                        <Dropdown.Item onClick={updateProfile}>Update Profile</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <button className="btn btn-success" onClick={loginForm}>Login</button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}
