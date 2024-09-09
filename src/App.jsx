// App.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './Components/AppLayout';
import Home from './Components/Home';
import Jobs from './Components/Jobs';
import About from './Components/About';
import SignUp from './Components/SignUp';
import SignIn from './Components/SignIn';
import AdminAppLayout from './Admin Panel/Components/AdminAppLayout';
import { AuthProvider } from './Components/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Contact from './Components/Jobs';
import AdminDashboard from './Admin Panel/Components/AdminDashboard';
import Addjobs from './Admin Panel/Components/AddJobs';
import UpdateProfile from './Components/UpdateProfile';
import ViewJobs from './Admin Panel/Components/ViewJobs';
import AppliedJobs from './Components/AppliedJobs';
import UserAppliedJobs from './Admin Panel/Components/UserAppliedJobs';
// import UserJoinEvent from './Components/UserJoinEvent';
import AddEvent from './Admin Panel/Components/AddEvent'
import Event from './Components/Event'
import ViewEvent from './Admin Panel/Components/ViewEvent'
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,  
    children: [
      {
        path: "/signup",
        element: <SignUp />
      },
      {
        path: "/signin",
        element: <SignIn />
      },
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/jobs",
        element: <ProtectedRoute element={<Jobs />} />
      },
      {
        path: "/appliedjobs",
        element: <ProtectedRoute element={<AppliedJobs />} />
      },
      {
        path: '/events',
        element: <Event />,
      },
      // {
      //   path: '/userjoinevent',
      //   element: <UserJoinEvent />,
      // },
      // {
      //   path: '/updateProfile',
      //   element: <UpdateProfile />,
      // },
    ]
  },
  {
    path: "/",
    element: <AdminAppLayout />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />
      },
      {
        path: "/admin/addjobs",
        element: <Addjobs />
      },
      {
        path: "/admin/viewjobs",
        element: <ViewJobs />
      },
      {
        path: "/admin/appliedjob",
        element: <UserAppliedJobs />
      },
      {
        path: "/admin/addevents",
        element: <AddEvent />
      },
      {
        path: "/admin/ViewEvent",
        element: <ViewEvent/>
      },
    
    ]
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
