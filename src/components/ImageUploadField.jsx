import { forwardRef } from 'react';
import { ObjectField } from "./ObjectField.jsx";
import { ProtectedImage } from "./ProtectedImage.jsx";
import { Box } from "@mui/material";
import { FileUploadInput } from "./FileUploadInput.jsx";

export const ImageUploadField = forwardRef((props, ref) => {
  const { value, ...inputProps } = props;

  return (
      <ObjectField label="Thumbnail">
        {value ? (
            <ProtectedImage sx={{ width: '100%' }} fileId={value} />
        ) : (
            <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '16 / 9',
                }}
            >
              <FileUploadInput ref={ref} value={value} {...inputProps} />
            </Box>
        )}
      </ObjectField>
  );
});