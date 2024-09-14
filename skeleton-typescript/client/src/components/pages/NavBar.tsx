import React from "react";
import { Link } from "@reach/router";
import { FaCalendarAlt } from "react-icons/fa"; // Importing the calendar icon

import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import "./NavBar.css";

const GOOGLE_CLIENT_ID = "204415935913-be7cesbef5i942rtjct5j2fs71rvd7d0.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
const NavBar = ({ userId, handleLogin, handleLogout }) => {
  return (
    <nav className="NavBar-container">
      <div className="NavBar-title u-inlineBlock">
        <Link to="/banana" className="NavBar-title">
          <span className="gradient1-text">A Pic A Day</span>
        </Link>
      </div>
      <div className="NavBar-linkContainer u-inlineBlock">
        <Link to="/calendar" className="NavBar-link, NavBar-calendar">
            <FaCalendarAlt size={24} /> {/* Calendar icon */}
        </Link>
        <span className="NavBar-link NavBar-loginbutton">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {userId ? (
              <button
                className="button-54"
                onClick={() => {
                  googleLogout();
                  handleLogout();
                }}
              >
                Logout
              </button>
            ) : (
              <GoogleLogin onSuccess={handleLogin}/>
            )}
          </GoogleOAuthProvider>
        </span>
      </div>
    </nav>
  );
};

export default NavBar;