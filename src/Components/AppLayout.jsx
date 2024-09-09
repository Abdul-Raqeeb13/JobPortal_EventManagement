import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Widgets/NavbarMain"; // Assuming you have a Navbar component
import '../Widgets/NavbarMain.css'

const AppLayout = () => {
  const location = useLocation();
  
  // Conditionally render Navbar based on the current path
  const shouldShowNavbar = location.pathname !== "/signup" && location.pathname !== "/signin";

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

export default AppLayout;
