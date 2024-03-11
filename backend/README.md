# Backend

## Development
1. Create .env file
2. It must contain the following:
```
PORT=3030
DB_CONNECTION=mongodb://localhost:27017
SECRET_KEY=yoursecretkey
JWT_TTL=1d
WS_PORT=3434
DB_NAME=brainstorm
```
Adjust the values as necessary
3. Run `yarn install`
4. Install docker and docker-compose, if not already installed
5. Run `yarn start-db`, that will launch a local instance of mongodb in the docker container
6. Run `yarn dev` to launch the backend server
7. In a separate terminal window run `yarn dev-ws` to launch the websocket server.

## Production
1. Run `yarn build`, this will build both of the servers
2. Then run in separate processes `yarn start` for the main server, and `yarn start-ws` for websocket server.