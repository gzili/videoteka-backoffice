import { Link } from 'react-router-dom';
import { Box, Chip, IconButton, Stack } from "@mui/material";
import { Delete, Edit, Videocam } from '@mui/icons-material';
import { BrowseDataGrid, ProtectedImage } from "../components";

const columns = [
  {
    field: 'title',
    headerName: 'Series',
    flex: 1,
    renderCell: ({ row }) => (
        <Box display="flex" py={1}>
          <ProtectedImage sx={{ height: 68 }} fileId={row.thumbnailId} />
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
    field: 'seasons',
    valueGetter: ({ value: seasons }) => seasons.length,
    headerName: 'Seasons',
    sortable: false,
    headerAlign: 'center',
    align: 'center',
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
          <IconButton component={Link} to={`/series/${id}`} aria-label="edit">
            <Edit />
          </IconButton>
          <IconButton aria-label="delete">
            <Delete />
          </IconButton>
        </Stack>
    ),
  }
];

export function BrowseSeries() {
  return <BrowseDataGrid columns={columns} />;
}