import React, { useEffect, useState } from "react";
import "./Upload.css";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "./Countdown";


const Upload = ({ changeUploaded, userId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPrompt = async () => {
    try {
      const response = await fetch("/api/prompt");
      const result = await response.json();
      setPrompt(result.prompt);
    } catch (error) {
      console.error("Failed to fetch prompt:", error);
    }
  }

  useEffect(() => {
    fetchPrompt();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);

    if (file) {
      console.log("Uploaded file:", file);

      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();
        console.log(result);
        changeUploaded(true);
        navigate("/vote");
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  return (
    <div className="upload">
        <CountdownTimer/>
      <div className="prompt-box">
        <h1>PROMPT: {prompt || "Loading ..."}</h1>
      </div>
      <>
        {userId === undefined ? (
          <>
            <p>Log in to upload!</p>
          </>
        ) : (
          <div className="upload-box">
            <label htmlFor="file-upload" className="custom-file-upload">
              Choose File
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} />
          </div>

          //   {selectedFile && <p>File selected: {selectedFile.name}</p>}
        )}
      </>
    </div>
  );
};

export default Upload;
