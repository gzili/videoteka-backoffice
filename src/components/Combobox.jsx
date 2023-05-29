import { forwardRef } from 'react';
import { Autocomplete, TextField } from "@mui/material";

export const Combobox = forwardRef((props, ref) => {
  const { label, errorMessage, ...autocompleteProps } = props;

  return (
      <Autocomplete
          {...autocompleteProps}
          ref={ref}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(e, value) => {
            autocompleteProps.onChange(value);
          }}
          renderInput={(params) => (
              <TextField
                  {...params}
                  label={label}
                  error={!!errorMessage}
                  helperText={errorMessage}
              />
          )}
      />
  );
})