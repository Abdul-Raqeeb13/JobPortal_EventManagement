import SignInLogo from '../Assets/Images/SignInLogo.png';
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './CSS/SignUp.css';
import firebase from '../Config/Firebase';
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false); // State to disable the button
  const navigation = useNavigate()

  const Login = async () => {
   
    setBtnDisabled(true); // Disable the button when login starts
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async (snap) => {
          let userId = snap.user.uid;
          login();
          await firebase.database().ref("users").child(userId).get()
            .then((snapshot) => {
              if (snapshot.exists() && snapshot.val()["userType"] === "user") {
                console.log("user login");
                localStorage.setItem("UserID", userId);
                localStorage.setItem("UserName", snapshot.val()["userName"]);
                navigation('/')
              } else if (snapshot.exists() && snapshot.val()["userType"] === "admin") {
                console.log("admin login");
                navigation('/admin')
              }
            });

          toast.success("Account Login successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
          setBtnDisabled(false)
        })
        .catch((e) => {
          toast.error("Invalid credentials!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
          setBtnDisabled(false); // Re-enable the button if login fails
        });
    } catch (error) {
      toast.error("Error occurred!", {
        position: "top-center",
        autoClose: 3300,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setBtnDisabled(false); // Re-enable the button if there's an error
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="container mainContainer">
        <div className="container imageContainer">
          <img style={{ transform: 'scaleX(1)' }} src={SignInLogo} alt="" />
        </div>

        <div className="container form_container">
          <h1 style={{ marginBottom: '20px' }}>Welcome, Back</h1>
          <span>Don't have an account? <Link to='/signup'>Signup</Link></span>

          <div className="fieldContainer">
            <TextField
              className='inputField'
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="fieldContainer">
            <TextField
              className='inputField'
              id="outlined-basic"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="submitBtn">
            <Button
              variant="contained"
              onClick={Login}
              disabled={btnDisabled} // Disable button based on state
            >
              {btnDisabled ? "Logging in..." : "Login Account"} {/* Change button text */}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
