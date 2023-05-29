import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export function useAccessToken() {
  const [accessToken, setAccessToken] = useState('');

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!accessToken) {
      getAccessTokenSilently()
          .then(token => {
            setAccessToken(token);
          });
    }
  }, [accessToken, getAccessTokenSilently]);

  return accessToken;
}