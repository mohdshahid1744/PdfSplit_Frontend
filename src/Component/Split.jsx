import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Button, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import axiosInstance from '../Utils/Axios';
import { getDocument } from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry'; 
import { useParams, useNavigate } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

function Split() {
  const [thumbnails, setThumbnails] = useState([]);
  const [rangeMode, setRangeMode] = useState('custom');
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); 
  const [splitPdfData, setSplitPdfData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPdfAndGenerateThumbnails = async () => {
      try {
        const response = await axiosInstance.get(`/getPdf/${id}`, { responseType: 'arraybuffer' });
        const pdfData = response.data;
        const pdfDoc = await getDocument({ data: pdfData }).promise;
        const numPages = pdfDoc.numPages; 
        const thumbnails = [];
        for (let i = 0; i < numPages; i++) {
          const page = await pdfDoc.getPage(i + 1);
          const viewport = page.getViewport({ scale: 0.25 }); 
  
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
  
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
  
          await page.render(renderContext).promise;
          const thumbnail = canvas.toDataURL('image/png');
          thumbnails.push(thumbnail);
        }
        setThumbnails(thumbnails);
        setTotalPages(numPages);
        setToPage(numPages); 
      } catch (error) {
        console.error('Error generating thumbnails:', error);
      }
    };

    fetchPdfAndGenerateThumbnails();
  }, [id]);

  const handleRangeModeChange = (event, newRangeMode) => {
    setRangeMode(newRangeMode);
  };

  const handleFromPageChange = (event) => {
    setFromPage(Number(event.target.value));
  };

  const handleToPageChange = (event) => {
    setToPage(Number(event.target.value));
  };

  const handleSplitPdf = async () => {
    try {
      
      const response = await axiosInstance.get(`/getPdf/${id}`, { responseType: 'arraybuffer' });
      const pdfData = response.data;
      const pdfDoc = await PDFDocument.load(pdfData);
      const newPdfDoc = await PDFDocument.create();
      const totalPages = pdfDoc.getPageCount();
      for (let i = fromPage - 1; i < toPage && i < totalPages; i++) {
        const [page] = await newPdfDoc.copyPages(pdfDoc, [i]);
        newPdfDoc.addPage(page);
      }
      const pdfBytes = await newPdfDoc.save();
      setSplitPdfData(pdfBytes);
      console.log("PDF Bytes in Split Component:", pdfBytes);

      navigate('/download',{ state: { pdfBytes } });
    } catch (error) {
      console.error('Error splitting PDF:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Split PDF
      </Typography>
      <Paper elevation={3} sx={{ padding: '2rem', display: 'flex', gap: '2rem' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              width: '100%',
              height: '400px',
              border: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              overflowX: 'auto',
              overflowY: 'hidden',
              padding: '10px',
              position: 'relative',
            }}
          >
            {thumbnails.length > 0 ? (
              thumbnails.map((thumbnail, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    marginRight: '10px',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={thumbnail}
                    alt={`Page ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Box
                    sx={{
                      marginTop: '5px',
                      fontSize: '12px',
                      color: '#666',
                      fontWeight: 'bold',
                    }}
                  >
                    Page {index + 1}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>Loading PDF thumbnails…</Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ minWidth: '300px' }}>
          <Typography variant="subtitle1" gutterBottom>
            Total Pages: {totalPages}
          </Typography>
          <ToggleButtonGroup
            value={rangeMode}
            exclusive
            onChange={handleRangeModeChange}
            aria-label="Range mode"
            fullWidth
            sx={{ marginBottom: '1rem' }}
          >
            <ToggleButton value="custom" aria-label="custom ranges">
              Custom Ranges
            </ToggleButton>
          </ToggleButtonGroup>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              label="From Page"
              type="number"
              fullWidth
              value={fromPage}
              onChange={handleFromPageChange}
              sx={{ marginBottom: '1rem' }}
              inputProps={{ min: 1, max: totalPages }}
            />
            <TextField
              label="To Page"
              type="number"
              fullWidth
              value={toPage}
              onChange={handleToPageChange}
              inputProps={{ min: 1, max: totalPages }}
            />
          </Box>
          <Button variant="contained" color="error" fullWidth onClick={handleSplitPdf}>
            Split PDF
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Split;
