import { api } from "../api.js";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth0 } from "@auth0/auth0-react";

function getAdminMessage() {
  return api.get('messages/admin').json();
}

function useUploadFile(props) {
  const { onProgressChange, onSuccess } = props;

  const [xhr] = useState(() => new XMLHttpRequest());

  const [isLoading, setLoading] = useState(false);

  const [isError, setError] = useState(false);

  const [data, setData] = useState(undefined);

  const { getAccessTokenSilently } = useAuth0();

  const handleUploadProgress = useCallback(e => {
    const percentComplete = Math.round((e.loaded / e.total) * 100);
    onProgressChange(percentComplete);
  }, [onProgressChange]);

  const handleLoad = useCallback(() => {
    if (xhr.status === 200) {
      const data = xhr.responseText;
      setData(data);
      onSuccess(data);
    } else {
      setError(true);
    }
    setLoading(false);
  }, [onSuccess, xhr.responseText, xhr.status]);

  const handleError = useCallback(() => {
    setError(true);
    setLoading(false);
  }, []);

  const uploadFile = useCallback(async file => {
    setLoading(true);
    xhr.open('POST', '/api/files');
    const token = await getAccessTokenSilently();
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    const fd = new FormData();
    fd.set('file', file);
    xhr.send(fd);
  });

  useEffect(() => {
    xhr.upload.addEventListener('progress', handleUploadProgress);
    xhr.onload = handleLoad;
    xhr.onerror = handleError;

    return () => {
      xhr.upload.removeEventListener('progress', handleUploadProgress);
      xhr.onload = undefined;
      xhr.onerror = undefined;
    };
  }, [handleError, handleLoad, handleUploadProgress, xhr]);

  return {
    uploadFile,
    isLoading,
    isError,
    data
  }
}

function FileUploadInput(props) {
  const { value, onChange } = props;
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState();

  const uploadFile = useCallback(file => {
    const fd = new FormData();
    fd.set('file', file);
    return api.post('files', {
      body: fd,
      onDownloadProgress: p => {
        setProgress(p.percent);
      },
    }).text();
  }, []);

  const { isLoading, isError, mutate, data } = useMutation({
    mutationFn: uploadFile,
    onSuccess: fileId => onChange(fileId),
  });

  function handleInputChange(e) {
    setFile(e.target.files[0]);
  }

  const handleRetry = () => {
    mutate(file);
  }

  useEffect(() => {
    if (file) {
      mutate(file);
    }
  }, [file, mutate]);

  if (data) {
    return <div>Uploaded file UUID: {data}</div>;
  }

  if (isLoading) {
    return <div>Uploading "{file.name}" ({progress * 100}% complete)</div>;
  }

  return (
      <div>
        <input type="file" onChange={handleInputChange} />
        {isError && <button type="button" onClick={handleRetry}>Retry</button> }
      </div>
  );
}

export function Create() {
  const [fileId, setFileId] = useState('');

  useEffect(() => {
    if (fileId) {
      console.log(fileId);
    }
  });

  return (
      <Box>
        <FileUploadInput value={fileId} onChange={setFileId} />
      </Box>
  );
}