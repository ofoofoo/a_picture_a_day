import React, { useState } from "react";
import "./Upload.css";

const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);

    if (file) {
      // Call your API here with the selected file
      console.log("Uploaded file:", file);

      // You can make an API call like:
      // const formData = new FormData();
      // formData.append('image', file);
      // fetch('YOUR_API_ENDPOINT', { method: 'POST', body: formData });
    }
  };

  return (
    <div className="upload">
      <div className="prompt-box">
        <h1>Right Place Wrong Time</h1>
      </div>
      <div className="upload-box">
        <label htmlFor="file-upload" className="custom-file-upload">
          Choose File
        </label>
        <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} />
      </div>
      {selectedFile && <p>File selected: {selectedFile.name}</p>}
    </div>
  );
};

export default Upload;
