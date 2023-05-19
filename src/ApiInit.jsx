import { useAuth0 } from "@auth0/auth0-react";
import { setAccessTokenGetter } from "./api.js";

export function ApiInit(props) {
  const { children } = props;

  const { getAccessTokenSilently } = useAuth0();

  setAccessTokenGetter(getAccessTokenSilently);

  return children;
}