import React from 'react';
import './AdminSideBar.css';
import { Link } from 'react-router-dom';
import { AiOutlineDashboard } from "react-icons/ai";
import { MdOutlinePayments } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { BsPencilSquare } from "react-icons/bs";
import { RiShutDownLine } from "react-icons/ri";
import { useAuth } from '../../Components/AuthContext';
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from "react-toastify";

export default function AdminSideBar() {
    const {  logout } = useAuth();
    const nav = useNavigate()


    const logoutUser = async () => {
        await logout()
       
        toast.success("Logout Successful", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

        nav("/signin")

    }

    return (
        <>
             <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />


            <div className="sidebarContainer">
                <div className="profileContainer">
                    <div className="profile">
                            <img src="https://pics.craiyon.com/2023-07-15/dc2ec5a571974417a5551420a4fb0587.webp" alt="" />
                    </div>
                    <div className="profileInfo">
                        <h4> Abdul Raqeeb</h4>
                    </div>
                </div>
                <div className="linksContainer">
                    <span>
                        <AiOutlineDashboard size='25px' color='white' />
                        <Link className='links' to={'/admin'}>Dashboard</Link>
                    </span>
                    <span>
                        <BsPencilSquare size='25px' color='white' />
                        <Link className='links' to={'/admin/addjobs'}>Add Job</Link>
                    </span>
                    <span>
                        <MdOutlinePayments size='25px' color='white' />
                        <Link className='links' to={'/admin/viewjobs'}>View Jobs</Link>
                    </span>
                    <span>
                        <IoSettingsOutline  size='25px' color='white' />
                        <Link className='links' to={'/admin/appliedjob'}>Applied Jobs</Link>
                    </span>
                    <span>
                        <IoSettingsOutline  size='25px' color='white' />
                        <Link className='links' to={'/admin/addevents'}>Add Events</Link>
                    </span>
                    <span>
                        <IoSettingsOutline  size='25px' color='white' />
                        <Link className='links' to={'/admin/ViewEvent'}>View Event</Link>
                    </span>
                    <span>
                        <RiShutDownLine   size='25px' color='white' />
                        <Link className='links' onClick={()=>logoutUser()}>Logout</Link>
                    </span>
                </div>
            </div>
        </>
    );
}
