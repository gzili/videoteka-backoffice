import { BACKEND_URL } from "../config.js";
import { useAccessToken } from "../hooks";
import { Box } from "@mui/material";

export function ProtectedImage(props) {
  const { fileId } = props;

  const accessToken = useAccessToken();

  if (!accessToken) {
    return null;
  }

  return <Box sx={{ borderRadius: '5px' }} display="block" component="img" width="100%" src={`${BACKEND_URL}/files/${fileId}?access_token=${accessToken}`}/>;
}