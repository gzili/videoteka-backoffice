import { BACKEND_URL } from "../config.js";
import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function useUploadFile(props) {
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
    xhr.open('POST', `${BACKEND_URL}/files`);
    const token = await getAccessTokenSilently();
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    const fd = new FormData();
    fd.set('file', file);
    xhr.send(fd);
  }, [getAccessTokenSilently, xhr]);

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