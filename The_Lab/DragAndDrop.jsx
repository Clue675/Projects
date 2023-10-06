import React, { useState } from 'react';
import axios from 'axios';
import './DragAndDrop.css'; // Make sure to create this CSS file

const DragAndDrop = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length === 1) {
      const file = files[0];
      // Add a file type check here if needed
      setFile(file);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.data.message === 'File uploaded successfully') {
          setError(null);
          // Optionally, you can perform further actions after successful upload
          console.log('File uploaded successfully');
        } else {
          setError('File upload failed');
          console.log('File upload failed');
        }
      } catch (err) {
        console.error('There was an error uploading the file', err);
        setError('An error occurred while uploading the file');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <h2>Drag and Drop File Upload</h2>
      <div
        className="drag-drop-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {file ? file.name : 'Drag and drop a file here'}
      </div>
      <button className="upload-button" onClick={handleSubmit} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DragAndDrop;
