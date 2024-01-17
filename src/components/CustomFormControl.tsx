"use client"
import React, { ReactNode } from 'react';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';

interface FormControlProps {
    children: ReactNode,
    error: boolean,
    helperText: string,
}

const CustomFormControl = ({ children, error, helperText }: FormControlProps) => {
  return (
    <FormControl fullWidth margin="normal" error={error}>
      <FormGroup>
        {children}
        {error && <FormHelperText sx={{
            position:'absolute',
            top: '100%',
            right: '0%',
            whiteSpace: 'nowrap',
        }}>{helperText}</FormHelperText>}
      </FormGroup>
    </FormControl>
  );
};

export default CustomFormControl;
