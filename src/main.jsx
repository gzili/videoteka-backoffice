import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BrowseLayout, Layout } from './Layout.jsx';
import './main.css';
import { ApiInit } from "./ApiInit.jsx";
import { Create } from "./pages/Create.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { loadSeriesById, movieLoader, moviesLoader, seriesLoader } from "./loaders";
import { BrowseMovies } from "./pages/BrowseMovies.jsx";
import { EditMovie } from "./pages/EditMovie.jsx";
import { NewSeries } from "./pages/NewSeries.jsx";
import { BrowseSeries } from "./pages/BrowseSeries.jsx";
import { ViewSeries } from "./pages/ViewSeries.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'create',
        element: <Create />,
      },
      {
        path: 'browse',
        element: <BrowseLayout />,
        children: [
          {
            path: 'movies',
            loader: moviesLoader,
            element: <BrowseMovies />,
          },
          {
            path: 'series',
            loader: seriesLoader,
            element: <BrowseSeries />,
          },
        ],
      },
      {
        path: 'movies/:id',
        loader: movieLoader,
        element: <EditMovie />,
      },
      {
        path: 'series/new',
        element: <NewSeries />,
      },
      {
        path: 'series/:id',
        loader: loadSeriesById,
        element: <ViewSeries />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Auth0Provider
          domain="dev-r9sh2y9g.us.auth0.com"
          clientId="JyuPU3Bo489j177lD0IbysztF27KYnuE"
          authorizationParams={{
            audience: 'https://videoteka.komandospavadinimas.lt',
            scope: 'profile email admin',
            redirect_uri: window.location.origin
          }}
      >
        <ApiInit>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ApiInit>
      </Auth0Provider>
    </LocalizationProvider>
  </React.StrictMode>,
);
