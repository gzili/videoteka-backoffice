import { useLoaderData } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Stack } from "@mui/material";
import { Delete, Edit, Videocam } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function useAccessToken() {
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
            width: '100%',
            height: '100%',
            borderRadius: '4px',
            objectFit: 'cover',
          }}
      />
  );
}

const columns = [
  {
    field: 'title',
    headerName: 'Movie',
    flex: 1,
    renderCell: ({ row }) => (
        <Box display="flex" py={1}>
          <Box
              sx={{
                width: 120,
                height: 68,
              }}
          >
            <ProtectedImage fileId={row.video.thumbnailId} />
          </Box>
          <Box ml={1} display="flex" alignItems="center">
            {row.title}
          </Box>
        </Box>
    ),
  },
  {
    field: 'genres',
    headerName: 'Genres',
    sortable: false,
    renderCell: ({ value: genres }) => (
        <Stack direction="row" spacing={1}>
          {genres.map(g => (
              <Chip key={g.id} label={g.name} />
          ))}
        </Stack>
    ),
    flex: 1,
  },
  {
    field: 'releaseDate',
    headerName: 'Release Date',
    flex: 1,
  },
  {
    field: 'id',
    headerName: '',
    sortable: false,
    width: 156,
    align: 'right',
    renderCell: ({ value: id }) => (
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="watch">
            <Videocam />
          </IconButton>
          <IconButton aria-label="edit">
            <Edit />
          </IconButton>
          <IconButton aria-label="delete">
            <Delete />
          </IconButton>
        </Stack>
    ),
  }
];

export function BrowseMovies() {
  const pageableMovies = useLoaderData();

  const getRowHeight = useCallback(() => 'auto', []);

  return (
      <DataGrid
          columns={columns}
          rows={pageableMovies.content}
          disableColumnMenu
          disableRowSelectionOnClick
          getRowHeight={getRowHeight}
          pageSizeOptions={[10]}
      />
  );
}