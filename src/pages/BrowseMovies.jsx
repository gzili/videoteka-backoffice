import { Link, useLoaderData, useNavigation, useSearchParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Stack } from "@mui/material";
import { Delete, Edit, Videocam } from '@mui/icons-material';
import { useCallback } from 'react';
import { ProtectedImage } from "../components/index.js";

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
            <ProtectedImage sx={{ height: 68 }} fileId={row.video.thumbnailId} />
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
          <IconButton component={Link} to={`/movies/${id}`} aria-label="edit">
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

  const navigation = useNavigation();

  const getRowHeight = useCallback(() => 'auto', []);

  const paginationModel = {
    page: pageableMovies.pageable.pageNumber,
    pageSize: pageableMovies.pageable.pageSize,
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const handlePaginationModelChange = useCallback(paginationModel => {
    const pageNumber = paginationModel.page;
    searchParams.set('page', `${pageNumber}`);
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  return (
      <DataGrid
          columns={columns}
          rows={pageableMovies.content}
          rowCount={pageableMovies.totalElements}
          disableColumnMenu
          disableRowSelectionOnClick
          getRowHeight={getRowHeight}
          pageSizeOptions={[pageableMovies.pageable.pageSize]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={handlePaginationModelChange}
          loading={navigation.state === 'loading'}
      />
  );
}