import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './CSS/SignUp.css';
import SignUpLogo from '../Assets/Images/SignUpLogo.png';
import firebase from '../Config/Firebase';
import { ToastContainer, toast } from "react-toastify";

export default function SignUp() {
  const navigation = useNavigate();
  const [btnState, setBtnState] = useState(false);
  const [UserData, SetUserData] = useState({
    Name: "",
    Email: "",
    Password: "",
    ProfileImage : ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'ProfileImage') {
      imageUpload(e); // Corrected to triple equals
    } else {
      SetUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const imageUpload = (e) => {
    setBtnState(true);
    let uploadTask = firebase.storage().ref(`Profiles/${e.target.files[0].name}`).put(e.target.files[0]);

    uploadTask.on('state_changed',
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.log(error);
        setBtnState(false); // Re-enable the button if there is an error
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          SetUserData((prev) => ({
            ...prev,
            ProfileImage: url, // Corrected to store URL in state
          }));
          setBtnState(false); // Enable the button after image upload completes
        });
      }
    );
  };

  const createAccount = async () => {
    setBtnState(true); // Disable the button
    try {
      await firebase.auth().createUserWithEmailAndPassword(UserData.Email, UserData.Password)
        .then(async (snap) => {
          let userId = snap.user.uid;

          var object = {
            email: UserData.Email,
            password: UserData.Password,
            userName: UserData.Name,
            userType: "user",
            userId,
            profileImage: UserData.ProfileImage // Add profile image URL to the object
          };

          await firebase.database().ref("users").child(userId).set(object);

          toast.success("Account created successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });

          setTimeout(() => {
            navigation('/signin');
            setBtnState(false); // Enable the button after navigation
          }, 3000);
        });
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setBtnState(false); // Re-enable the button if there is an error
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="container mainContainer">
        <div className="container form_container">
          <h1>SignUp</h1>
          <span>
            Already have an account? <Link to="/signin">Login</Link>
          </span>

          <div className="fieldContainer">
            <TextField
              className="inputField"
              id="outlined-basic"
              label="Name"
              variant="outlined"
              name="Name"
              value={UserData.Name}
              onChange={handleInputChange}
            />
          </div>

          <div className="fieldContainer">
            <TextField
              className="inputField"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="Email"
              value={UserData.Email}
              onChange={handleInputChange}
            />
          </div>

          <div className="fieldContainer">
            <TextField
              className="inputField"
              id="outlined-basic"
              label="Password"
              variant="outlined"
              name="Password"
              value={UserData.Password}
              onChange={handleInputChange}
            />
          </div>

          <div className="fieldContainer">
            <input className="form-control" type="file" id="formFile"
            label="Profile"
            variant="outlined"
            name="ProfileImage"
            onChange={handleInputChange} // Do not use `value`
            />
          </div>

          <div className="submitBtn">
            <Button
              variant="contained"
              onClick={createAccount}
              disabled={btnState} // Disable the button based on btnState
            >
              {btnState ? "Creating Account" : "Create Account"}
            </Button>
          </div>
        </div>

        <div className="container imageContainer">
          <img src={SignUpLogo} alt="" />
        </div>
      </div>
    </>
  );
}
