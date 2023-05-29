import { BACKEND_URL } from "../config.js";
import { useAccessToken } from "../hooks";
import { Box } from "@mui/material";

export function ProtectedVideo(props) {
  const { fileId } = props;

  const token = useAccessToken();

  if (!token) {
    return null;
  }

  return (
      <Box
          sx={{
            width: '100%',
            borderRadius: '4px',
          }}
          mb="-6.5px"
          component="video"
          controls
          muted="muted"
      >
        <source src={`${BACKEND_URL}/files/${fileId}?access_token=${token}`} />
      </Box>
  );
}