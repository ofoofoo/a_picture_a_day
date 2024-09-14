import React, { useState } from 'react';
import './ProfilePage.css';
import { Link } from "react-router-dom";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from '@react-oauth/google';

interface ProfilePageProps {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
}

const GOOGLE_CLIENT_ID =
  "1058809634774-q5fa4vukq4cll8kc5pu6lv9emvui3bg2.apps.googleusercontent.com";

  const ProfilePage: React.FC<ProfilePageProps> = ({ userId, handleLogin, handleLogout }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      setSelectedFile(file);
  
      if (file) {
        console.log('Uploaded file:', file);
        // API call logic here
      }
    };
  
    return (
      <div className="profile-container">
        <img src="profile-pic.jpg" alt="Profile" className="profile-pic" />
        <div className="username">big shaq</div>
        <div className="handle">@jbursz</div>
  
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {userId ? (
            <button
              className="logout-button"
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <GoogleLogin onSuccess={handleLogin} />
          )}
        </GoogleOAuthProvider>
  
        <Link to="/calendar">
          <button className="view-button">View all photos</button>
        </Link>
  
        <div className="upload">
          <div className="upload-box">
            <label htmlFor="file-upload" className="custom-file-upload">
              Choose File
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} />
          </div>
        </div>
      </div>
    );
  };
  
  export default ProfilePage;