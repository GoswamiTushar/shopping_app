"use client";
import { Box, Paper, useTheme, Theme, Typography, Grid } from "@mui/material";
import React, { useState } from "react";
import Underline from "@/components/Underline";
import CustomInputField from "@/components/CustomInputField";
import CustomFormControl from "@/components/CustomFormControl";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "next/navigation";

interface StylesProps {
  theme: Theme;
}

const styles = ({ theme }: StylesProps) => ({
  root: {
    padding: "20px 30px",
    width: "90%",
    // minWidth: '350px',
    // height: "30%",
    // minHeight: "500px",
    [theme.breakpoints.up("sm")]: {
      padding: "18px",
      minWidth: "600px",
      width: "60%",
      maxWidth: "800px",
    },
    [theme.breakpoints.up("md")]: {
      padding: "20px",
    },
    [theme.breakpoints.up("lg")]: {
      padding: "22px",
    },
    [theme.breakpoints.up("xl")]: {
      padding: "24px",
    },
  },
  greetingText: {
    color: "primary.dark",
    fontWeight: "600",
    fontSize: "18px",
    textAlign: "center",
    marginBottom: "10px",
  },
});

const LoginForm = () => {
  const theme = useTheme();
  const router = useRouter()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = e.target.name;
    const value: string = e.target.value;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name: string = e.target.name;
    const value: string = e.target.value;
    let error: string = "";

    if (name === "email") {
      if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email address";
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(formErrors).some((error) => error !== "")) {
      return;
    }
    console.log({loginData})

    try{
      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "auth/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      })
      if(res.ok){
        const data = await res.json()

        console.log({data})
        const token = data?.token

        sessionStorage.setItem('token', token)
        console.log("Login Successful")
        router.push("/post-products")
      } else {
        console.log("Login Failed: ", res.statusText)
      }
    }catch(err){
      console.log({err})
    }
  };

  return (
    <Box component={Paper} sx={styles({ theme }).root}>
      <Typography variant="h4" sx={styles({ theme }).greetingText}>
        Welcome to Login Page
      </Typography>
      <Underline />
      <Grid container>
        <form onSubmit={handleSubmit} style={{width: '100%'}}>
          <Grid item xs={12}>
            <CustomFormControl
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
            >
              <CustomInputField
                label="Email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                type="email"
              />
            </CustomFormControl>
          </Grid>
          <Grid item xs={12}>
            <CustomFormControl
              error={Boolean(formErrors.password)}
              helperText={formErrors.password}
            >
              <CustomInputField
                label="Password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
              />
            </CustomFormControl>
          </Grid>
          <Grid item xs={12}>
            <CustomButton
              variant='contained'
              fullWidth
              sx={{
                marginTop: '20px',
                color: 'primary.light',
                marginBottom: '20px'
              }}
              // onClick={handleSubmit}
              type="submit"
            >
              Login
            </CustomButton>
          </Grid>
        </form>
      </Grid>
    </Box>
  );
};

export default LoginForm;
