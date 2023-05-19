import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './Layout.jsx';
import './main.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
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
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-r9sh2y9g.us.auth0.com"
      clientId="JyuPU3Bo489j177lD0IbysztF27KYnuE"
      authorizationParams={{
        audience: 'https://videoteka.komandospavadinimas.lt',
        scope: 'profile email admin',
        redirect_uri: window.location.origin
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>,
);
