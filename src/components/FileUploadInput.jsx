import { useUploadFile } from "../hooks";
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress } from "@mui/material";
import { Upload } from "@mui/icons-material";

export const FileUploadInput = forwardRef((props, ref) => {
  const { value, onChange, ...inputProps } = props;
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState();
  const inputRef = useRef(null);

  const handleProgress = useCallback(percent => {
    setProgress(percent);
  }, []);

  const handleSuccess = useCallback(fileId => {
    onChange(fileId);
  }, [onChange]);

  const { uploadFile, isLoading, isError, data } = useUploadFile({
    onProgressChange: handleProgress,
    onSuccess: handleSuccess,
  });

  function handleInputChange(e) {
    setFile(e.target.files[0]);
  }

  const handleRetry = () => {
    uploadFile(file);
  }

  useEffect(() => {
    if (file) {
      uploadFile(file);
    }
  }, [file, uploadFile]);

  if (data) {
    return <div>Uploaded file UUID: {data}</div>;
  }

  if (isLoading) {
    return (
        <Box>
          <CircularProgress variant="determinate" value={progress} />
        </Box>
    );
  }

  return (
      <div>
        <input {...inputProps} ref={inputRef} type="file" onChange={handleInputChange} style={{ display: 'none' }} />
        <Button ref={ref} variant="contained" startIcon={<Upload />} onClick={() => inputRef.current.click()}>Upload file</Button>
        {isError && <button type="button" onClick={handleRetry}>Retry</button> }
      </div>
  );
});