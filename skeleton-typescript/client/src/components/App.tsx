import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { CredentialResponse } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
// import Skeleton from "./pages/Skeleton";
import User from "../../../shared/User";
import "../utilities.css";
import Upload from "./pages/Upload";
import NavBar from "./pages/NavBar.tsx";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    get("/api/whoami").then((user: User) => {
      if (user._id) {
        // TRhey are registed in the database and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken as string) as { name: string; email: string };
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  // NOTE:
  // All the pages need to have the props extended via RouteComponentProps for @reach/router to work properly. Please use the Skeleton as an example.

  return (
    <>
      <BrowserRouter>
        <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />

        <Routes>
          {/* <Route
            element={
              <Skeleton handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
            }
            path="/"
          /> */}
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Upload />} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
