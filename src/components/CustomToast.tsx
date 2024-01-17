"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type CustomToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Props {
    toastData: {
        open: boolean,
        message: string,
        severity: CustomToastVariant,
    }
    setToastData: any
}

export default function CustomizedSnackbars({
    toastData,
    setToastData
}: Props) {

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setToastData({
        ...toastData,
        open: false
    });
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={toastData.open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={toastData.severity} sx={{ width: '100%' }}>
          {toastData.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}