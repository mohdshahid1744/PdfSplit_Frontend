import React from 'react';
import { Container, Typography, Button, Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import DownloadIcon from '@mui/icons-material/Download';
import FilePresentIcon from '@mui/icons-material/FilePresent';

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[6],
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  overflow: 'visible',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 4),
  fontWeight: 'bold',
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: '3rem',
  color: theme.palette.primary.main,
}));

function Download() {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfBytes = location.state?.pdfBytes;

  const handleDownload = () => {
    if (pdfBytes) {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `split_pdf.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledCard>
        <CardContent>
          <IconContainer>
            <FilePresentIcon />
          </IconContainer>
          <Typography variant="h4" component="h1" gutterBottom mt={2}>
            PDF Ready for Download
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Your PDF has been split successfully and is now ready for download. Click the button below to save the split PDF file to your device.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <StyledButton variant="contained" color="primary" onClick={handleDownload}>
              <DownloadIcon sx={{ mr: 1 }} />
              Download PDF
            </StyledButton>
            <StyledButton variant="outlined" color="secondary" onClick={handleBack}>
              Go Back
            </StyledButton>
          </Box>
        </CardContent>
      </StyledCard>
    </StyledContainer>
  );
}

export default Download;
