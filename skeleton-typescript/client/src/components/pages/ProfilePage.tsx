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
  changedUploaded: (boolean) => void;
}

const GOOGLE_CLIENT_ID =
  "1058809634774-q5fa4vukq4cll8kc5pu6lv9emvui3bg2.apps.googleusercontent.com";

const ProfilePage: React.FC<ProfilePageProps> = ({
  userId,
  handleLogin,
  handleLogout,
  userPhoto,
  userName,
  changedUploaded,
}) => {
  return (
    <div className="profile-container">
      <div className="name-section">
        <div className="username">{userName}</div>
        {/* <div className="handle">@jbursz</div> */}
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
                changedUploaded(false);
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

      {/* <div className="upload">
        <div className="upload-box">
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose File
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} />
        </div>
      </div> */}
    </div>
  );
};

export default ProfilePage;
