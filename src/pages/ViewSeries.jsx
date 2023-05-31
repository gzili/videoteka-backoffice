import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import {
  Accordion, AccordionDetails, AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ControlledField, ProtectedImage } from "../components";
import { api } from "../api.js";
import { useMutation } from "@tanstack/react-query";
import { LoadingButton } from "@mui/lab";
import { Delete, Edit, ExpandMore, Videocam } from '@mui/icons-material';
import { DataGrid } from "@mui/x-data-grid";
import { FRONTEND_URL } from "../config.js";

const episodeColumns = [
  {
    field: 'title',
    headerName: 'Episode',
    flex: 1,
    renderCell: ({ row }) => (
        <Box display="flex" py={1}>
          <Box
              sx={{
                width: 120,
                height: 68
              }}
          >
            <ProtectedImage
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                fileId={row.video.thumbnailId}
            />
          </Box>
          <Box ml={1} display="flex" alignItems="center">
            {row.title}
          </Box>
        </Box>
    ),
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
          <IconButton component="a" href={`${FRONTEND_URL}/episode/${id}`} target="_blank" aria-label="watch">
            <Videocam />
          </IconButton>
          <IconButton component={Link} to={`/episodes/${id}/edit`} aria-label="edit">
            <Edit />
          </IconButton>
          <IconButton aria-label="delete">
            <Delete />
          </IconButton>
        </Stack>
    ),
  }
];

function EpisodesList(props) {
  const { episodes } = props;

  const getRowHeight = useCallback(() => 'auto', []);

  return (
      <DataGrid
          columns={episodeColumns}
          rows={episodes}
          disableColumnMenu
          disableRowSelectionOnClick
          getRowHeight={getRowHeight}
          pageSizeOptions={[100]}
      />
  );
}

function SeasonItem(props) {
  const { season } = props;

  return (
      <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMore />}
        >
          {season.title}
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography fontSize="1.25rem" fontWeight="bold" mb={1}>Description</Typography>
            <Typography>
              {season.description}
            </Typography>
          </Box>
          <Box mt={4}>
            <Typography fontSize="1.25rem" fontWeight="bold" mb={1}>Episodes ({season.episodes.length})</Typography>
            <EpisodesList episodes={season.episodes} />
          </Box>
        </AccordionDetails>
      </Accordion>
  );
}

function SeasonsList(props) {
  const { seasons } = props;

  return (
      <Box>
        {seasons.map(s => <SeasonItem key={s.id} season={s} />)}
      </Box>
  );
}

function toCreateSeasonDto(formValues) {
  return ({
    title: formValues.title,
    description: formValues.description,
  });
}

function createSeason({ seriesId, formValues }) {
  const dto = toCreateSeasonDto(formValues);
  return api.post(`series/${seriesId}/seasons`, { json: dto }).json();
}

function SeasonCreateButton() {
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const revalidator = useRevalidator();

  const { mutate, isLoading } = useMutation({
    mutationFn: createSeason,
    onSuccess: () => {
      revalidator.revalidate();
      handleClose();
    },
  });

  const series = useLoaderData();

  const handleValidSubmit = formValues => {
    mutate({ seriesId: series.id, formValues });
  };

  return (
      <>
        <Button variant="contained" onClick={handleOpen}>New Season</Button>
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 0 }}>New Season</DialogTitle>
          <DialogContent>
            <Stack sx={{ pt: '16px' }} spacing={2}>
              <ControlledField
                  control={control}
                  name="title"
                  render={({ errorMessage, ...rest }) => (
                      <TextField
                          {...rest}
                          label="Title"
                          error={!!errorMessage}
                          helperText={errorMessage}
                      />
                  )}
              />
              <ControlledField
                  control={control}
                  name="description"
                  render={({ errorMessage, ...rest }) => (
                      <TextField
                          {...rest}
                          label="Description"
                          error={!!errorMessage}
                          helperText={errorMessage}
                          multiline
                          minRows={3}
                      />
                  )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isLoading}>Cancel</Button>
            <LoadingButton onClick={handleSubmit(handleValidSubmit)} loading={isLoading} variant="contained">Create</LoadingButton>
          </DialogActions>
        </Dialog>
      </>
  );
}

export function ViewSeries() {
  const series = useLoaderData();

  return (
      <Box maxWidth="1200px" m="0 auto">
        <Box display="grid" gridTemplateColumns="min-content 1fr">
          <ProtectedImage sx={{ height: 400 }} fileId={series.thumbnailId} />
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
          <SeasonCreateButton />
        </Box>
        <SeasonsList seasons={series.seasons} />
      </Box>
  );
}