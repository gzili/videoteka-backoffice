import { forwardRef } from 'react';
import { ObjectField } from "./ObjectField.jsx";
import { ProtectedImage } from "./ProtectedImage.jsx";
import { Box } from "@mui/material";
import { Delete } from '@mui/icons-material';
import { FileUploadInput } from "./FileUploadInput.jsx";

export const ImageUploadField = forwardRef((props, ref) => {
  const { value, onChange, ...inputProps } = props;

  console.log(value);

  return (
      <ObjectField label="Thumbnail">
        {value ? (
            <Box
                sx={{
                  position: 'relative',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '& > .delete-overlay': {
                    visibility: 'hidden',
                  },
                  '&:hover > .delete-overlay': {
                    visibility: 'visible',
                  },
                }}
                onClick={() => onChange('')}
            >
              <Box
                  className="delete-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
              >
                <Box>
                  <Delete sx={{ color: 'white', fontSize: 40 }} />
                </Box>
              </Box>
              <ProtectedImage sx={{ width: '100%' }} fileId={value} />
            </Box>
        ) : (
            <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '16 / 9',
                }}
            >
              <FileUploadInput ref={ref} value={value} onChange={onChange} {...inputProps} />
            </Box>
        )}
      </ObjectField>
  );
});