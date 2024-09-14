import React, { useEffect } from "react";
// import { Link } from "@reach/router";
import { FaCalendarAlt } from "react-icons/fa"; // Importing the calendar icon
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import "./NavBar.css";

const GOOGLE_CLIENT_ID =
  "1058809634774-q5fa4vukq4cll8kc5pu6lv9emvui3bg2.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
const NavBar = ({ userId, handleLogin, handleLogout, userPhoto, loggedIn }) => {
  useEffect(() => {
    // Add any logic here that needs to run when the component mounts or the route changes
    console.log("Profile page loaded or navigated back to.");
    // You can also load fresh data here if necessary
  }, []); // The empty array ensures this effect only runs on mount/unmount or when you navigate back

  return (
    <nav className="NavBar-container">
      <div className="NavBar-title u-inlineBlock">
        <Link to="/" className="NavBar-title">
          <span className="gradient1-text">A Pic A Day</span>
        </Link>
      </div>
      <div className="NavBar-linkContainer u-inlineBlock">
        {loggedIn && (
          <Link to="/calendar" className="NavBar-link, NavBar-calendar">
            <FaCalendarAlt size={24} /> {/* Calendar icon */}
          </Link>
        )}
        <span className="NavBar-link NavBar-loginbutton">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {userId ? (
              // <button
              //   className="button-54"
              //   onClick={() => {
              //     googleLogout();
              //     handleLogout();
              //   }}
              // >
              //   Logout
              // </button>
              <Link to="/profile" className="NavBar-link">
                <img src={userPhoto} />
                Profile
              </Link>
            ) : (
              <GoogleLogin onSuccess={handleLogin} />
            )}
          </GoogleOAuthProvider>
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
