import { api } from "../api.js";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  debounce,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Upload } from '@mui/icons-material';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useController, useForm } from "react-hook-form";
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from "@mui/lab";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function useUploadFile(props) {
  const { onProgressChange, onSuccess } = props;

  const [xhr] = useState(() => new XMLHttpRequest());

  const [isLoading, setLoading] = useState(false);

  const [isError, setError] = useState(false);

  const [data, setData] = useState(undefined);

  const { getAccessTokenSilently } = useAuth0();

  const handleUploadProgress = useCallback(e => {
    const percentComplete = Math.round((e.loaded / e.total) * 100);
    onProgressChange(percentComplete);
  }, [onProgressChange]);

  const handleLoad = useCallback(() => {
    if (xhr.status === 200) {
      const data = xhr.responseText;
      setData(data);
      onSuccess(data);
    } else {
      setError(true);
    }
    setLoading(false);
  }, [onSuccess, xhr.responseText, xhr.status]);

  const handleError = useCallback(() => {
    setError(true);
    setLoading(false);
  }, []);

  const uploadFile = useCallback(async file => {
    setLoading(true);
    xhr.open('POST', 'http://localhost:8080/api/files');
    const token = await getAccessTokenSilently();
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    const fd = new FormData();
    fd.set('file', file);
    xhr.send(fd);
  }, [getAccessTokenSilently, xhr]);

  useEffect(() => {
    xhr.upload.addEventListener('progress', handleUploadProgress);
    xhr.onload = handleLoad;
    xhr.onerror = handleError;

    return () => {
      xhr.upload.removeEventListener('progress', handleUploadProgress);
      xhr.onload = undefined;
      xhr.onerror = undefined;
    };
  }, [handleError, handleLoad, handleUploadProgress, xhr]);

  return {
    uploadFile,
    isLoading,
    isError,
    data
  }
}

const FileUploadInput = forwardRef((props, ref) => {
  const { value, onChange, ...inputProps } = props;
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState();
  const inputRef = useRef(null);

  const handleProgress = useCallback(percent => {
    setProgress(percent);
  }, []);

  const handleSuccess = useCallback(fileId => {
    onChange(fileId);
  }, [onChange]);

  const { uploadFile, isLoading, isError, data } = useUploadFile({
    onProgressChange: handleProgress,
    onSuccess: handleSuccess,
  });

  function handleInputChange(e) {
    setFile(e.target.files[0]);
  }

  const handleRetry = () => {
    uploadFile(file);
  }

  useEffect(() => {
    if (file) {
      uploadFile(file);
    }
  }, [file, uploadFile]);

  if (data) {
    return <div>Uploaded file UUID: {data}</div>;
  }

  if (isLoading) {
    return (
        <Box>
          <CircularProgress variant="determinate" value={progress} />
        </Box>
    );
  }

  return (
      <div>
        <input {...inputProps} ref={inputRef} type="file" onChange={handleInputChange} style={{ display: 'none' }} />
        <Button ref={ref} variant="contained" startIcon={<Upload />} onClick={() => inputRef.current.click()}>Upload file</Button>
        {isError && <button type="button" onClick={handleRetry}>Retry</button> }
      </div>
  );
});

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

  return <Box sx={{ borderRadius: '5px' }} display="block" component="img" width="100%" src={`http://localhost:8080/api/files/${fileId}?access_token=${accessToken}`}/>;
}

function ProtectedVideo(props) {
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
        <source src={`http://localhost:8080/api/files/${fileId}?access_token=${token}`} />
      </Box>
  );
}

const ObjectField = forwardRef((props, ref) => {
  const { label, children } = props;

  return (
      <Box
          sx={{
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "rgba(0, 0, 0, 0.23)",
            borderRadius: "4px",
            position: "relative",
            minHeight: "48px",
            py: "16px",
            px: "14px",
            '&:hover': {
              borderColor: "black",
            }
          }}
      >
        <Box
            sx={{
              position: "absolute",
              top: "-8px",
              left: "8px",
              fontSize: "0.75em",
              backgroundColor: "white",
              px: "5px",
              lineHeight: "1.2",
            }}
        >
          {label}
        </Box>
        <Box>
          {children}
        </Box>
      </Box>
  );
});

function useControllableState(props) {
  const {
    value,
    onChange,
    defaultValue,
  } = props;

  const [stateValue, setStateValue] = useState(defaultValue);

  const resolvedValue = value !== undefined ? value : stateValue;
  const setResolvedValue = typeof onChange === 'function' ? onChange : setStateValue;

  return [resolvedValue, setResolvedValue];
}

function valueToOptions(value, multiple) {
  if (multiple) {
    return value;
  }

  return value ? [value] : [];
}

const AsyncAutocomplete = forwardRef((props, ref) => {
  const {
    loadOptions,
    value: valueProp,
    onChange: onChangeProp,
    label,
    multiple,
    onBlur,
    name,
    errorMessage,
  } = props;

  const [value, onChange] = useControllableState({
    value: valueProp,
    onChange: onChangeProp,
    defaultValue: multiple ? [] : null,
  });
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const debounceLoadOptions = useMemo(
      () => debounce((req, cb) => {
        loadOptions(req).then(options => cb(options));
      }, 400),
      [loadOptions]
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(valueToOptions(value, multiple));
      return;
    }

    setLoading(true);
    debounceLoadOptions(inputValue, results => {
      if (active) {
        let newOptions = valueToOptions(value, multiple);
        setOptions([...newOptions, ...results]);
        setLoading(false);
      }

      return () => {
        active = false;
      }
    })
  }, [inputValue, value, debounceLoadOptions, multiple]);

  return (
      <Autocomplete
          ref={ref}
          options={options}
          multiple={multiple}
          filterOptions={x => x}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          filterSelectedOptions
          value={value}
          onChange={(e, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options);
            onChange(newValue);
          }}
          onInputChange={(e, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
              <TextField
                  {...params}
                  label={label}
                  name={name}
                  onBlur={onBlur}
                  error={!!errorMessage}
                  helperText={errorMessage}
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                          {isLoading ? <CircularProgress color="inherit" size={20} /> : null }
                          {params.InputProps.endAdornment}
                        </>
                    )
                  }}
              />
          )}
          noOptionsText={inputValue === '' ? 'Start typing to see options' : 'No options'}
      />
  );
});

const Combobox = forwardRef((props, ref) => {
  const { label, errorMessage, ...autocompleteProps } = props;

  return (
      <Autocomplete
          {...autocompleteProps}
          ref={ref}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(e, value) => {
            autocompleteProps.onChange(value);
          }}
          renderInput={(params) => (
              <TextField
                  {...params}
                  label={label}
                  error={!!errorMessage}
                  helperText={errorMessage}
              />
          )}
      />
  );
})

const VideoUploadField = forwardRef((props, ref) => {
  const { value, ...inputProps } = props;

  return (
      <ObjectField label="Video">
        {value ? (
            <ProtectedVideo fileId={value} />
        ) : (
            <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '16 / 9',
                }}
            >
              <FileUploadInput value={value} {...inputProps} />
            </Box>
        )}
      </ObjectField>
  );
});

const ImageUploadField = forwardRef((props, ref) => {
  const { value, ...inputProps } = props;

  return (
      <ObjectField label="Thumbnail">
        {value ? (
            <ProtectedImage fileId={value} />
        ) : (
            <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '16 / 9',
                }}
            >
              <FileUploadInput ref={ref} value={value} {...inputProps} />
            </Box>
        )}
      </ObjectField>
  );
});

function ControlledField(props) {
  const { control, name, render } = props;

  const { field, fieldState: { error } } = useController({
    name,
    control,
  });

  return render({ ...field, errorMessage: error?.message });
}

async function loadGenres(nameQuery) {
  const response = await api.get(`genres?name=${nameQuery}`).json();
  return response.content.map(g => ({ label: g.name, value: g.id }));
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

function createMovieOrEpisode(formValues) {
  if (formValues.contentType === 'movie') {
    const dto = toCreateMovieDto(formValues);
    return api.post('movies', { json: dto }).json();
  }

  if (formValues.contentType === 'episode') {
    const dto = toCreateEpisodeDto(formValues);
    const seasonId = formValues.seasonOption.value;
    return api.post(`seasons/${seasonId}/episodes`, { json: dto }).json();
  }

  throw new Error('unsupported content type');
}

export function Create() {
  const { watch, setValue, control, handleSubmit } = useForm({
    defaultValues: {
      fileId: '',
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
    },
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

  const { mutate } = useMutation({
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
          Upload Video
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
          <LoadingButton variant="contained" onClick={handleSubmit(handleValidSubmit)}>Create</LoadingButton>
        </Box>
      </Box>
  );
}