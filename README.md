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

The backoffice frontend should now be served at `http://localhost:5173`.

**Note:** by default, backoffice expects backend to be accessible at `http://localhost:8080/api`. The port can be changed using the `VITE_BACKEND_PORT` environment variable. Either edit the existing `.env` file or create `.env.local` file (ignored by Git) and put your overrides there to avoid merge conflicts in the future.

### Running as a Docker container

Docker image is coming soon...

### Test account

Use these credentials to login using the test user:

- Username: `admin`
- Password: `admin123`
