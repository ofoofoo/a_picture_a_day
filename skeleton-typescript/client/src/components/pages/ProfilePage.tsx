import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import { Link } from "react-router-dom";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";
import { FaFire } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";

interface ProfilePageProps {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
  userPhoto?: string;
  userName?: string;
  changeUploaded: (boolean) => void;
}

const GOOGLE_CLIENT_ID =
  "1058809634774-q5fa4vukq4cll8kc5pu6lv9emvui3bg2.apps.googleusercontent.com";

const ProfilePage: React.FC<ProfilePageProps> = ({
  userId,
  handleLogin,
  handleLogout,
  userPhoto,
  userName,
  changeUploaded,
}) => {
  return (
    <div className="profile-container">
      <div className="name-section">
        <div className="username">{userName}</div>
      </div>

      <img src={userPhoto} alt="Profile" className="profile-pic" />

      <Link to="/calendar">
        <button className="view-button">View all photos</button>
      </Link>

      <div>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {userId ? (
            <button
              className="logout-button"
              onClick={() => {
                googleLogout();
                changeUploaded(false);
                handleLogout();
              }}
            >
              <CiLogout />
            </button>
          ) : (
            <GoogleLogin onSuccess={handleLogin} />
          )}
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default ProfilePage;
