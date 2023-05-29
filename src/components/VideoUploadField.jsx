import { forwardRef } from 'react';
import { ObjectField } from "./ObjectField.jsx";
import { ProtectedVideo } from "./ProtectedVideo.jsx";
import { Box } from "@mui/material";
import { FileUploadInput } from "./FileUploadInput.jsx";

export const VideoUploadField = forwardRef((props, ref) => {
  const { value, ...inputProps } = props;

  return (
      <ObjectField label="Video">
        {value ? (
            <ProtectedVideo fileId={value} />
        ) : (
            <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '16 / 9',
                }}
            >
              <FileUploadInput value={value} {...inputProps} />
            </Box>
        )}
      </ObjectField>
  );
});