# smtsolver

## Development

To run the development environment, you need to start both the backend server and the frontend dev server in separate terminals:

**Terminal 1 - Backend Server:**

```bash
yarn server
```

This starts the Express API server on `http://localhost:3001`

**Terminal 2 - Frontend Dev Server:**

```bash
yarn dev
```

This starts the Vite development server (typically on `http://localhost:5173`)

The frontend dev server is configured to proxy API requests to the backend server.

## Build

To build the frontend for production:

```bash
yarn build
```

This creates an optimized production build in the `dist/` directory.

# Sources

https://www.youtube.com/watch?v=KZfB80LDXSo

Z3 Playground
https://microsoft.github.io/z3guide/playground/test/
https://github.com/microsoft/z3guide
https://z3prover.github.io/api/html/js/
