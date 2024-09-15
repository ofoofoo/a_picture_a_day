import React, { useState, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { CredentialResponse } from "@react-oauth/google";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import User from "../../../shared/User";
import "../utilities.css";
import Upload from "./pages/Upload";
import NavBar from "./pages/NavBar.tsx";
import ProfilePage from "./pages/ProfilePage";
import Vote from "./pages/Vote.tsx";
import CalendarPage from "./pages/Calendar";
import BIRDS from "vanta/dist/vanta.birds.min";
// import VantaComponent from "./pages/VantaComponent";
import * as THREE from "three";
import VANTA from "vanta/dist/vanta.net.min";
import NET from "vanta/dist/vanta.net.min"; // Import the specific Vanta effect
import About from "./pages/About";

const App = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);
  const [loggedIn, changeLog] = useState(true);
  const [uploaded, changeUploaded] = useState(true);
  const isMounted = useRef(false);
  useEffect(() => {
    get("/api/whoami").then((user: User) => {
      if (user._id) {
        // TRhey are registed in the database and currently logged in.
        setUserId(user._id);
        setUserPhoto(user.photoUrl);
        setUserName(user.name);
        changeLog(true);

        get("/api/userinfo").then((res) => {
          if (res.uploaded) {
            changeUploaded(true);
          } else {
            changeUploaded(false);
          }
        });
      } else {
        changeLog(false);
        changeUploaded(false);
      }
    });
  }, [loggedIn]);

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken as string) as {
      name: string;
      email: string;
    };
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      setUserPhoto(user.photoUrl);
      setUserName(user.name);
      changeLog(true);
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    setUserPhoto(undefined);
    setUserName(undefined);
    post("/api/logout");
    changeLog(false);
    changeUploaded(false);
  };
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: myRef.current,
          THREE: THREE,
          color: 0xff3f81,
          lineColor: 0xbe9292,
          backgroundColor: "black",
          spacing: 18,
        })
      );
    }
    return () => {};
  }, [vantaEffect]);
  return (
    <>
      <div ref={myRef} className="whole-page"></div>
      <BrowserRouter>
        <NavBar
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          userPhoto={userPhoto}
          loggedIn={loggedIn}
        />

        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route
            path="/"
            element={uploaded ? <Navigate to="/vote" /> : <Navigate to="/upload" />}
          />
          <Route path="/calendar" element={loggedIn ? <CalendarPage /> : <Navigate to="/" />} />

          <Route
            path="/profile"
            element={
              loggedIn ? (
                <ProfilePage
                  userId={userId}
                  handleLogin={handleLogin}
                  handleLogout={handleLogout}
                  userPhoto={userPhoto}
                  userName={userName}
                  changeUploaded={changeUploaded}
                />
              ) : (
                <Navigate to="/upload" />
              )
            }
          />
          <Route
            path="/upload"
            element={
              uploaded ? (
                <Navigate to="/vote" />
              ) : (
                <Upload changeUploaded={changeUploaded} userId={userId} />
              )
            }
          />
          <Route path="/vote" element={uploaded ? <Vote /> : <Navigate to="/upload" />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
