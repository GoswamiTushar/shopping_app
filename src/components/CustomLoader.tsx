"use client"
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface PropTypes {
  isActive?: boolean
}

export default function CustomLoader({isActive=false}: PropTypes) {
  React.useEffect(() => {
    // Disable scrolling and pointer events when loader is active
    if (isActive) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.overflow = 'visible';
      document.body.style.pointerEvents = 'auto';
    }

    // Cleanup styles when component unmounts
    return () => {
      document.body.style.overflow = 'visible';
      document.body.style.pointerEvents = 'auto';
    };
  }, [isActive]);
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        display: 'flex',
        width: '100%',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        // Make sure the loader is not visible when not active
        visibility: isActive ? 'visible' : 'hidden',
      }}
    >
      <CircularProgress sx={{
        scale: '1.2',
        color: 'primary.contrastText'
      }} />
    </Box>
  );
}