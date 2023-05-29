import { useControllableState } from "../hooks";
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, debounce, TextField } from "@mui/material";

function valueToOptions(value, multiple) {
  if (multiple) {
    return value;
  }

  return value ? [value] : [];
}

export const AsyncAutocomplete = forwardRef((props, ref) => {
  const {
    loadOptions,
    value: valueProp,
    onChange: onChangeProp,
    label,
    multiple,
    onBlur,
    name,
    errorMessage,
  } = props;

  const [value, onChange] = useControllableState({
    value: valueProp,
    onChange: onChangeProp,
    defaultValue: multiple ? [] : null,
  });
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const debounceLoadOptions = useMemo(
      () => debounce((req, cb) => {
        loadOptions(req).then(options => cb(options));
      }, 400),
      [loadOptions]
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(valueToOptions(value, multiple));
      return;
    }

    setLoading(true);
    debounceLoadOptions(inputValue, results => {
      if (active) {
        let newOptions = valueToOptions(value, multiple);
        setOptions([...newOptions, ...results]);
        setLoading(false);
      }

      return () => {
        active = false;
      }
    })
  }, [inputValue, value, debounceLoadOptions, multiple]);

  return (
      <Autocomplete
          ref={ref}
          options={options}
          multiple={multiple}
          filterOptions={x => x}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          filterSelectedOptions
          value={value}
          onChange={(e, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options);
            onChange(newValue);
          }}
          onInputChange={(e, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
              <TextField
                  {...params}
                  label={label}
                  name={name}
                  onBlur={onBlur}
                  error={!!errorMessage}
                  helperText={errorMessage}
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                          {isLoading ? <CircularProgress color="inherit" size={20} /> : null }
                          {params.InputProps.endAdornment}
                        </>
                    )
                  }}
              />
          )}
          noOptionsText={inputValue === '' ? 'Start typing to see options' : 'No options'}
      />
  );
});