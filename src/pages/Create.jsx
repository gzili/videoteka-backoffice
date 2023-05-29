import { api } from "../api.js";
import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from "react-hook-form";
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from "@mui/lab";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as dayjs from 'dayjs';
import { AsyncAutocomplete, Combobox, ControlledField, ImageUploadField, VideoUploadField } from "../components";

function genresToOptions(genres) {
  return genres.map(g => ({ label: g.name, value: g.id }));
}

async function loadGenres(nameQuery) {
  const response = await api.get(`genres?name=${nameQuery}`).json();
  return genresToOptions(response.content);
}

async function loadSeries(query) {
  const response = await api.get(`series?title=${encodeURIComponent(query)}`).json();
  return response.content.map(s => ({ label: s.title, value: s.id, original: s }));
}

function mapSeasonsToOptions(seasons) {
  return seasons.map(s => ({ label: s.title, value: s.id }));
}

function toCreateMovieDto(formValues) {
  return ({
    title: formValues.title,
    description: formValues.description,
    genreIds: formValues.genreOptions.map(o => o.value),
    releaseDate: formValues.releaseDate.format('YYYY-MM-DD'),
    video: {
      contentId: formValues.video.fileId,
      thumbnailId: formValues.video.thumbnailFileId,
    },
  });
}

function toCreateEpisodeDto(formValues) {
  return ({
    title: formValues.title,
    description: formValues.description,
    releaseDate: formValues.releaseDate.format('YYYY-MM-DD'),
    video: {
      contentId: formValues.video.fileId,
      thumbnailId: formValues.video.thumbnailFileId,
    },
  });
}

function createMovieOrEpisode({ resourceId, formValues }) {
  const method = resourceId ? 'patch' : 'post';
  let dto;
  let url;

  if (formValues.contentType === 'movie') {
    url = resourceId ? `movies/${resourceId}` : 'movies';
    dto = toCreateMovieDto(formValues);
  }

  if (formValues.contentType === 'episode') {
    const seasonId = formValues.seasonOption.value;
    url = resourceId ? `episodes/${resourceId}` : `seasons/${seasonId}/episodes`;
    dto = toCreateEpisodeDto(formValues);
  }

  return api[method](url, { json: dto }).json();
}

export function Create(props) {
  const { movie, episode } = props;

  let defaultValues = {
    video: {
      fileId: '',
      thumbnailFileId: '',
    },
    title: '',
    genreOptions: [],
    description: '',
    releaseDate: null,
    contentType: 'movie',
    episode: {
      seriesOption: null,
      seasonOption: null,
    },
  }

  if (movie) {
    defaultValues = {
      video: {
        fileId: movie.video.contentId,
        thumbnailFileId: movie.video.thumbnailId,
      },
      title: movie.title,
      genreOptions: genresToOptions(movie.genres),
      description: movie.description,
      releaseDate: dayjs(movie.releaseDate),
      contentType: 'movie',
      episode: {
        seriesOption: null,
        seasonOption: null,
      },
    }
  }

  const { watch, setValue, control, handleSubmit } = useForm({
    defaultValues,
  });

  const contentType = watch('contentType');

  const seriesOption = watch('episode.seriesOption');

  const seasonOptions = useMemo(() => {
    if (seriesOption) {
      return mapSeasonsToOptions(seriesOption.original.seasons);
    } else {
      return [];
    }
  }, [seriesOption]);

  useEffect(() => {
    setValue('episode.seasonOption', null);
  }, [seriesOption, setValue]);

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: createMovieOrEpisode,
    onSuccess: () => {
      switch (contentType) {
        case 'movie':
          navigate('/browse/movies');
          break;
        case 'episode':
          navigate('/browse/episodes');
          break;
      }
    },
  })

  const handleValidSubmit = useCallback(formValues => {
    const resourceId = movie?.id ?? episode?.id;
    mutate({ resourceId, formValues });
  }, [mutate, movie, episode]);

  return (
      <Box
          sx={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
      >
        <Typography fontSize="2.5em" fontWeight="bold" mb={2}>
          {movie ? 'Edit Movie' : episode ? 'Edit Episode' : 'Upload Video'}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: 2,
          }}
        >
          <Stack spacing={6}>
            {!(movie || episode) && (
                <Stack spacing={2}>
                  <ControlledField
                      control={control}
                      name="contentType"
                      render={({ errorMessage, ...rest }) => (
                          <TextField
                              {...rest}
                              label="Video type"
                              error={!!errorMessage}
                              helperText={errorMessage}
                              select
                          >
                            <MenuItem value="movie">Movie</MenuItem>
                            <MenuItem value="episode">Episode</MenuItem>
                          </TextField>
                      )}
                  />
                  {contentType === 'episode' && (
                      <ControlledField
                          control={control}
                          name="episode.seriesOption"
                          render={props => (
                              <AsyncAutocomplete {...props} label="Series" loadOptions={loadSeries} />
                          )}
                      />
                  )}
                  {seriesOption && (
                      <ControlledField
                          control={control}
                          name="episode.seasonOption"
                          render={props => (
                              <Combobox {...props} label="Season" options={seasonOptions} />
                          )}
                      />
                  )}
                </Stack>
            )}
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
              {contentType === 'movie' && (
                  <ControlledField
                      control={control}
                      name="genreOptions"
                      render={props => (
                          <AsyncAutocomplete {...props} label="Genres" loadOptions={loadGenres} multiple />
                      )}
                  />
              )}
              <ControlledField
                  control={control}
                  name="releaseDate"
                  render={({ onChange, onBlur, value, name, ref, errorMessage }) => (
                      <DatePicker
                          label="Release date"
                          format="YYYY-MM-DD"
                          value={value}
                          onChange={onChange}
                          inputRef={ref}
                          slotProps={{
                            TextField: {
                              onBlur,
                              name,
                            }
                          }}
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
                  name="video.fileId"
                  render={({ errorMessage, ...rest }) => (
                      <VideoUploadField {...rest} />
                  )}
              />
            </Box>
            <Box>
              <ControlledField
                  control={control}
                  name="video.thumbnailFileId"
                  render={({ errorMessage, ...rest }) => (
                      <ImageUploadField {...rest} />
                  )}
              />
            </Box>
          </Stack>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <LoadingButton variant="contained" loading={isLoading} onClick={handleSubmit(handleValidSubmit)}>
            {(movie || episode) ? 'Update' : 'Create'}
          </LoadingButton>
        </Box>
      </Box>
  );
}