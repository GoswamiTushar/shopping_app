"use client";
import React, { useState } from "react";
import TextField, { TextFieldVariants } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface InputFieldParams {
  label?: string;
  name?: string;
  value?: string | number | boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: any;
  type?: string;
  fullWidth?: boolean,
  variant?: TextFieldVariants | undefined,
  margin?: "normal" | "none" | "dense" | undefined,
}

const CustomInputField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  fullWidth=false,
  variant="standard",
  margin="normal"
}: InputFieldParams) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <TextField
      label={label}
      name={name}
      type={showPassword ? "text" : type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      margin={margin}
      variant={variant}
    //   helperText={error ? helperText : ' '}
      fullWidth={fullWidth}
      InputProps={
        type === "password"
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
    />
  );
};

export default CustomInputField;
