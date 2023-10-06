import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import './FileUpload.css';
import './DragAndDrop.css';
import { toast } from 'react-toastify';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { logout, token } = useAuth();

  const notifyUser = (trainingData) => {
    toast.info(`Data is prepared to be uploaded. Names: ${trainingData.names}. Do you want to proceed?`, {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      toastId: "confirmToast",
      onClose: () => {
        // Logic for "No" option
        toast.dismiss("confirmToast");
      },
      onClick: async () => {
        // Logic for "Yes" option, i.e., add data to Excel
        try {
          await axios.post('http://localhost:5000/addNewTraining', trainingData, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
          toast.success('Data added to Excel successfully.');
        } catch (err) {
          toast.error(`An error occurred while adding data to Excel: ${err.message}`);
        }
        toast.dismiss("confirmToast");
      },
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length === 1) {
      const file = files[0];
      setFile(file);
    }
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
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
            'Authorization': `Bearer ${token}`
          },
        });

        if (res.data.message === 'File uploaded successfully') {
          const trainingData = {
            title: 'Some Title',
            date: 'Some Date',
            names: []  // Populate this array as needed
          };
          notifyUser(trainingData);
          setError(null);
        } else {
          setError('File upload failed');
        }
      } catch (err) {
        setError(`An error occurred: ${err.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="file-upload-container">
      <h2>File Upload</h2>
      <input className="file-input" type="file" onChange={onFileChange} />
      <div
        className="drag-drop-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {file ? file.name : 'Or drag and drop a file here'}
      </div>
      <button className="upload-button" onClick={handleSubmit} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <div className="error-message">{error}</div>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default FileUpload;
