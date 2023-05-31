import { api } from "../api.js";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useCallback } from 'react';
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AsyncAutocomplete, ControlledField, ImageUploadField } from "../components";

function genresToOptions(genres) {
  return genres.map(g => ({ label: g.name, value: g.id }));
}

async function loadGenres(nameQuery) {
  const response = await api.get(`genres?name=${nameQuery}`).json();
  return genresToOptions(response.content);
}

function toCreateSeriesDto(formValues) {
  return ({
    title: formValues.title,
    genreIds: formValues.genreOptions.map(o => o.value),
    description: formValues.description,
    thumbnailId: formValues.thumbnailFileId,
  });
}

function createSeries(formValues) {
  const dto = toCreateSeriesDto(formValues);
  return api.post('series', { json: dto }).json();
}

export function NewSeries() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      thumbnailFileId: '',
      title: '',
      genreOptions: [],
      description: '',
    },
  });

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: createSeries,
    onSuccess: series => {
      navigate(`/series/${series.id}`);
    },
  });

  const handleValidSubmit = useCallback(formValues => {
    mutate(formValues);
  }, [mutate]);

  return (
      <Box
          sx={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
      >
        <Typography fontSize="2.5em" fontWeight="bold" mb={2}>
          New Series
        </Typography>
        <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: 2,
            }}
        >
          <Stack spacing={6}>
            <Stack spacing={2}>
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
                  name="genreOptions"
                  render={props => (
                      <AsyncAutocomplete {...props} label="Genres" loadOptions={loadGenres} multiple />
                  )}
              />
              <ControlledField
                  control={control}
                  name="description"
                  render={({ errorMessage, ...rest }) => (
                      <TextField
                          {...rest}
                          label="Description"
                          multiline
                          minRows={3}
                          error={!!errorMessage}
                          helperText={errorMessage}
                      />
                  )}
              />
            </Stack>
          </Stack>
          <Stack spacing={2}>
            <Box>
              <ControlledField
                  control={control}
                  name="thumbnailFileId"
                  render={({ errorMessage, ...rest }) => (
                      <ImageUploadField {...rest} />
                  )}
              />
            </Box>
          </Stack>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <LoadingButton variant="contained" loading={isLoading} onClick={handleSubmit(handleValidSubmit)}>
            Create
          </LoadingButton>
        </Box>
      </Box>
  );
}