import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import axiosInstance from '../Utils/Axios';
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate=useNavigate()
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Upload response:", response.data);
      let userId=response.data.data.userId
      if (userId) {
        console.log(`User ID: ${userId}`);
        navigate(`/split/${userId}`);
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload PDF.");
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#e3f2fd',
        padding: 3,
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Split Your PDF
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ color: '#424242', textAlign: 'center', maxWidth: 500 }}>
        Easily split your PDF files into individual pages or groups of pages for convenient conversion and management.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          borderRadius: 4,
          backgroundColor: '#ffffff',
          boxShadow: 8,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          id="file-upload"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            sx={{
              backgroundColor: '#2196f3',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '12px 24px',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
          >
            Select PDF File
          </Button>
        </label>
        {selectedFile && (
          <Typography sx={{ marginTop: 2, fontWeight: 'medium', color: '#424242' }}>
            Selected File: {selectedFile.name}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            marginTop: 2,
            backgroundColor: '#4caf50',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#388e3c',
            },
          }}
        >
          Upload PDF
        </Button>
      </Box>
    </Box>
  );
}
 
export default Home;
