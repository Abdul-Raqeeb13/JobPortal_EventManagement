import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideBar from '../Widgets/AdminSideBar';
// import './CSS/AdminAppLayout.css';
import '../AdminCSS/AdminAppLayout.css'

export default function AppLayout() {
  return (
    <div className="AppLayoutContainer">
      <AdminSideBar />
      <div className="mainContent">
        <Outlet />
      </div>
    </div>
  );
}
