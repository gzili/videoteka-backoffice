import { AppBar, Box, Button, Tab, Typography, Toolbar, Tabs } from '@mui/material';
import { Link, Outlet, useMatch } from 'react-router-dom';

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
  let matchMovies = useMatch({ path: 'movies' });
  let matchSeries = useMatch({ path: 'series' });

  return (
    <Box>
      <AppBar>
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Videoteka Backoffice
          </Typography>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
      <Toolbar variant="dense" />
      <Box p={2}>
        <Tabs value={matchMovies ? 0 : matchSeries ? 1 : false}>
          <LinkTab label="Movies" to="/movies" />
          <LinkTab label="Series" to="/series" />
        </Tabs>
        <Outlet />
      </Box>
    </Box>
  );
}

export function Layout() {
  return <MainLayout />
}