# Frontend

## Development
1. Create .env file
2. It must contain the following, adjust the ports as necessary
```
VITE_API_URL=http://localhost:3030
VITE_WS_URL=ws://localhost:3434
```
3. Run `yarn install`
4. Run `yarn dev`

## Production
1. Run `yarn build` to build the application
2. Then you can either serve the files with your own server, or use the built-in one. Run `yarn launch` and it will serve the frontend on port 5173.