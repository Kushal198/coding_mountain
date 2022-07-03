# Crypto Scrapper Project with (NodeJS(TypeScript) + ReactJS(Typescript) + Web Sockets + Prisma + Docker Compose)

A project that runs a Node server and a react app via two separate containers, using Docker Compose which scrapes data from crypto ranking website and 
offer clients a feature to add their favorite coins to their wishlists and notify them if any price change based on what they have set.

## Development
```sh
   docker-compose up
   ```
   
The client server is spun up at ```localhost:3000``` and it proxies internally to the server using the linked name as ```server:5050```.

The local directories are mounted into the containers, so changes will reflect immediately. However, changes to package.json will likely need to a rebuild: docker-compose down && docker-compose build && docker-compose up.

## Notes For Schema Model Migration to Postgres database on docker container

### To migrate model onto database

Navigate to your Docker and check your running api_backend container:

This will launch an interactive CLI to run your API commands. In this case, you want to run the prisma migrate command. This will allow your database to sync with the schema you have created.

Go ahead and run ```npx prisma migrate dev``` inside the interactive Docker CLI it would ask you a migration name you can give any
