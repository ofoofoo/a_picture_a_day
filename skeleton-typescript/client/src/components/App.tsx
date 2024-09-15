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

const App = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);
  const [loggedIn, changeLog] = useState(true);
  const isMounted = useRef(false);
  useEffect(() => {
    get("/api/whoami").then((user: User) => {
      if (user._id) {
        // TRhey are registed in the database and currently logged in.
        setUserId(user._id);
        setUserPhoto(user.photoUrl);
        setUserName(user.name);
        changeLog(true);
      } else {
        changeLog(false);
      }
    });
  }, []);

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
  };
  const [uploaded, changedUploaded] = useState(false);
  //set uploaded
  useEffect(() => {
    console.log(loggedIn);
    // if (!isMounted.current) {
    //   isMounted.current = true;
    //   return;
    // }
    if (userId === undefined) {
      return;
    }
    get("/api/userinfo").then((res) => {
      console.log("hawk dhjshjs");
      console.log(res.uploaded);
      if (res.uploaded) {
        changedUploaded(true);
      }
    });
  }, [loggedIn]);
  // NOTE:
  // All the pages need to have the props extended via RouteComponentProps for @reach/router to work properly. Please use the Skeleton as an example.

  return (
    <>
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
                  changedUploaded={changedUploaded}
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
                <Upload changedUploaded={changedUploaded} userId={userId} />
              )
            }
          />
          <Route path="/vote" element={uploaded ? <Vote /> : <Navigate to="/upload" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
