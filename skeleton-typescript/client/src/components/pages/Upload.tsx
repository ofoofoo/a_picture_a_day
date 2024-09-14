import React, { useState } from "react";
import "./Upload.css";
import { useNavigate } from "react-router-dom";

const Upload = ({ changedUploaded, userId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

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
        changedUploaded(true);
        navigate("/vote");
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  return (
    <div className="upload">
      <div className="prompt-box">
        <h1>Right Place Wrong Time</h1>
      </div>
      <>
        {userId === undefined ? (
          <></>
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
