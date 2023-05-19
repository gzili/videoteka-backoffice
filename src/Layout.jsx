import { AppBar, Box, Button, Tab, Typography, Toolbar, Tabs, Stack } from '@mui/material';
import { VideoCall } from "@mui/icons-material";
import { Link, Navigate, Outlet, useMatch, useResolvedPath } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { LoadingButton } from "@mui/lab";

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
      <Button color="inherit" onClick={() => logout()}>Logout</Button>
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
              <Button component={Link} to="/create" startIcon={<VideoCall />} color="inherit">Create</Button>
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

export function BrowseLayout() {
  const resolvedMovies = useResolvedPath('movies');
  const matchMovies = useMatch({ path: resolvedMovies.pathname });
  const resolvedSeries = useResolvedPath('series');
  const matchSeries = useMatch({ path: resolvedSeries.pathname });

  return (
      <Tabs value={matchMovies ? 0 : matchSeries ? 1 : false}>
        <LinkTab label="Movies" to="/movies" />
        <LinkTab label="Series" to="/series" />
      </Tabs>
  );
}

export function Layout() {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <LoginLayout />
  }

  return <MainLayout />;
}