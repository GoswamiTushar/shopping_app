"use client"
import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

type CustomButtonVariant = 'filled' | 'outlined' | 'contained';

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: CustomButtonVariant;
  fullWidth?: boolean;
  fontSize?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'filled',
  fullWidth = false,
  fontSize,
  ...rest
}) => {
  const theme = useTheme();

  // Default responsive widths
  const defaultResponsiveWidths = {
    xs: '100%',
    sm: '100%',
    md: '80%',
    lg: '60%',
    xl: '50%',
  };

  const buttonStyles = {
    ...(fullWidth && { width: '100%' }),
    [theme.breakpoints.up('sm')]: {
      width: defaultResponsiveWidths.sm,
    },
    [theme.breakpoints.up('md')]: {
      width: defaultResponsiveWidths.md,
    },
    [theme.breakpoints.up('lg')]: {
      width: defaultResponsiveWidths.lg,
    },
    [theme.breakpoints.up('xl')]: {
      width: defaultResponsiveWidths.xl,
    },
  };

  return (
    <Button
      variant={variant as 'text' | 'contained' | 'outlined'}
      style={{ ...buttonStyles, fontSize }}
      {...rest}
    />
  );
};

export default CustomButton;
