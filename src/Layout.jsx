import { AppBar, Box, Button, Tab, Typography, Toolbar, Tabs, Stack, TextField, InputAdornment } from '@mui/material';
import { Search, VideoCall } from "@mui/icons-material";
import { Link, Navigate, Outlet, useMatch, useSearchParams, useResolvedPath } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { LoadingButton } from "@mui/lab";
import { useCallback } from "react";

function LoginLayout() {
  const { isLoading, loginWithRedirect } = useAuth0();

  return (
      <Box sx={{
        position: 'fixed',
        display: 'flex',
        inset: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}>
        <Box display="flex" flexDirection="column" alignItems="center" width="200px">
          <Box textAlign="center">
            <Typography fontSize="1.5em" fontWeight="bold">Videoteka</Typography>
            <Typography>backoffice</Typography>
          </Box>
          <LoadingButton loading={isLoading} onClick={() => loginWithRedirect()} variant="contained"
                         sx={{ mt: 1, width: '100%' }}>Sign in</LoadingButton>
        </Box>
      </Box>
  );
}

function LogoutButton() {
  const { logout } = useAuth0();

  return (
      <Button
          color="inherit"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      >
        Logout
      </Button>
  );
}

function LinkTab(props) {
  const { label, to } = props;

  return (
      <Tab
          label={label}
          component={Link}
          to={to}
          sx={{
            py: 1,
          }}
      />
  );
}

function MainLayout() {
  const match = useMatch({ path: '/', end: true });

  if (match) {
    return <Navigate to="/browse" />;
  }

  return (
      <Box>
        <AppBar>
          <Toolbar variant="dense">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Videoteka Backoffice
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button component={Link} to="/create" startIcon={<VideoCall />} color="inherit">Upload</Button>
              <LogoutButton />
            </Stack>
          </Toolbar>
        </AppBar>
        <Toolbar variant="dense" />
        <Box p={2}>
          <Outlet />
        </Box>
      </Box>
  );
}

function useIsResolvedMatch(to) {
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname });
  return match !== null;
}

export function BrowseLayout() {
  const isMovies = useIsResolvedMatch('movies');
  const isSeries = useIsResolvedMatch('series');

  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get('q') ?? '';

  const handleChange = useCallback(e => {
    const q = e.target.value;
    setSearchParams(params => {
      params.delete('page');
      if (q) {
        params.set('q', q);
      } else {
        params.delete('q');
      }
      return params;
    });
  }, [setSearchParams]);

  return (
      <Box>
        <Typography fontSize="2em" fontWeight="bold" mb={1}>
          Available Content
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Tabs value={isMovies ? 0 : isSeries ? 1 : false}>
            <LinkTab label="Movies" to="/browse/movies" />
            <LinkTab label="Series" to="/browse/series" />
          </Tabs>
          <Box
              sx={{
                display: 'flex',
              }}
          >
            {isMovies ? (
                <Button component={Link} to="/create" variant="contained">New Movie</Button>
            ) : isSeries ? (
                <Button component={Link} to="/series/new" variant="contained">New Series</Button>
            ): null}
            <Box ml={2}>
              <TextField
                  placeholder="Search"
                  variant="standard"
                  value={value}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                    )
                  }}
              />
            </Box>
          </Box>
        </Box>
        <Box py={4}>
          <Outlet />
        </Box>
      </Box>
  );
}

export function Layout() {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <LoginLayout />
  }

  return <MainLayout />;
}