import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface CustomSelectProps {
  label?: string;
  fullWidth?: boolean;
  name?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  margin?: 'normal' | 'none' | 'dense';
  value?: string;
  options: { label: string; value: string | number }[];
  onChange: (event: SelectChangeEvent) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label = 'Label',
  fullWidth = false,
  name = '',
  variant = 'outlined',
  margin,
  value = '',
  options,
  onChange,
}) => {
  // Convert "normal" to undefined for margin
  const normalizedMargin = margin === 'normal' ? undefined : margin;

  return (
    <Box sx={{ minWidth: 120 }}>
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Select
        name={name}
        labelId={`${name}-select-label`}
        id={`${name}-select`}
        value={value}
        label={label}
        onChange={onChange}
        fullWidth={fullWidth}
        variant={variant}
        margin={normalizedMargin}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default CustomSelect;
