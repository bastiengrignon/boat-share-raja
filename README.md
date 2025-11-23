# Turborepo Starter kit
A ready-to-use template for a Turborepo monorepo.

# Apps
- `web`: a React app
- `api`: a Fastify app

## Front-end
- [Mantine](https://mantine.dev) for the UI
- [Vite](https://vitejs.dev) for the bundler
- [React Router](https://reactrouter.com) for routing
- [Better Auth](https://www.better-auth.com) for authentication
- [React icons](https://react-icons.github.io/react-icons) as icons library
- [React i18n](https://react.i18next.com) for internationalization

It comes with a basic Mantine layout, with authentication pages, and a basic settings page to handle user updates.  


## Back-end
- [Fastify](https://www.fastify.io) for the server
- [Better Auth](https://www.better-auth.com) for authentication
- [Prisma](https://www.prisma.io) for the Database

A basic Fastify server with authentication routes handled by BetterAuth and Prisma DB. 

# Packages
- `typescript-config`: `tsconfig.json`s used throughout the monorepo


### Turborepo
- ```dev``` to run the apps
- ```build``` to build the apps
- ```check-types``` to check the types
- ```lint:fix``` to lint the code of all _apps_ using [BiomeJS](https://biomejs.dev/fr)


## Configuration
1. Start by copying the `.env.example` file to `.env` and adjust the values.
2. Run `yarn` to install the dependencies.
3. If you don't already have a Postgres database, create one using **docker-compose.yml** file (`docker-compose up -d`).
4. Run `npx prisma db push` to create the database and tables.
5. Run `yarn dev` to start the apps.
