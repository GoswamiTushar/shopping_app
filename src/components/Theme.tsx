"use client"
import { ThemeProvider, createTheme } from "@mui/material";
import { ReactNode } from "react";

interface ChildrenType {
    children: ReactNode
}

export const theme = createTheme({
    palette: {
        primary: {
            main: "#4B88A2",
            light: '#FFF9FB',
            dark: '#252627',
            contrastText: '#BB0A21'
        },
    }
})

export default function CustomTheme({children}: ChildrenType){
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}