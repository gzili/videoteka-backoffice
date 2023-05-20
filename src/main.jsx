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
            element: <div>Movies</div>,
          },
          {
            path: 'series',
            element: <div>Series</div>,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline />
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
  </React.StrictMode>,
);
