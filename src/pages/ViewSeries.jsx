import { useLoaderData } from "react-router-dom";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useAccessToken } from "../hooks";

function ProtectedImage(props) {
  const { fileId } = props;

  const accessToken = useAccessToken();

  if (!accessToken) {
    return null;
  }

  return (
      <Box
          component="img"
          src={`http://localhost:8080/api/files/${fileId}?access_token=${accessToken}`}
          sx={{
            display: 'block',
            height: 400,
            borderRadius: '4px',
          }}
      />
  );
}

export function ViewSeries() {
  const series = useLoaderData();

  return (
      <Box maxWidth="1200px" m="0 auto">
        <Box display="grid" gridTemplateColumns="min-content 1fr">
          <ProtectedImage fileId={series.thumbnailId} />
          <Stack
              sx={{
                px: 4,
                py: 2,
              }}
              spacing={2}
          >
            <Typography fontSize="2rem" fontWeight="bold" lineHeight="1.2">{series.title}</Typography>
            <Stack direction="row" spacing={1}>
              {series.genres.map(g => <Chip key={g.id} label={g.name} />)}
            </Stack>
            <Typography>
              {series.description}
            </Typography>
          </Stack>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
          <Typography fontSize="1.5rem" fontWeight="bold">Seasons ({series.seasons.length})</Typography>
          <Button variant="contained">New Season</Button>
        </Box>
        <Box>
          Seasons list is coming soon...
        </Box>
      </Box>
  );
}