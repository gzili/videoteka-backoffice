import { BACKEND_URL } from "../config.js";
import { useAccessToken } from "../hooks";
import { Box } from "@mui/material";

export function ProtectedImage(props) {
  const { fileId, sx } = props;

  const accessToken = useAccessToken();

  if (!accessToken) {
    return null;
  }

  return (
      <Box
          component="img"
          src={`${BACKEND_URL}/files/${fileId}?access_token=${accessToken}`}
          sx={{
            display: 'block',
            borderRadius: '4px',
            ...sx,
          }}
      />
  );
}
