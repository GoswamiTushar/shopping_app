import { Box, Theme, useTheme } from '@mui/material'
import React from 'react'

interface StylesProps {
    theme: Theme
}

const styles = ({theme}: StylesProps) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        background: '#4B88A2',
        height: '1px',
    }
  });

const Underline = ({
    style={}
}) => {
  const theme = useTheme();
  return (
    <Box sx={{...styles({theme}).root, ...style}}/>
  )
}

export default Underline