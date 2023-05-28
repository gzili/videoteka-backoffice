# Videoteka Backoffice

The backoffice (admin portal) frontend developed for [videoteka](https://github.com/edvinasstaupas/videoteka) project using React 18 and MUI. Developed as part of a team project during the Software Development course in Vilnius University.

## Development Setup

### Running locally

#### Prerequisites

- Node.js (18.16+)
- Yarn

To install the dependencies, run:

```
yarn
```

To start the development server, run:

```
yarn dev
```

The backoffice frontend should now be served at `http://localhost:5173` (if using the default settings).

**Note:** by default, backoffice expects backend to be accessible at `http://localhost:8080/api`. You can use `VITE_BACKEND_HOST`, `VITE_BACKEND_PORT` and `VITE_BACKEND_PATH` environment variables to change this. Either change the values in `.env` or create `.env.local` file (ignored by Git) and put your overrides there.

### Running as a Docker container

Docker image is coming soon...

### Test account

Use these credentials to login using the test user:

- Username: `admin`
- Password: `admin123`
