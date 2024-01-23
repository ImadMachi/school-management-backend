## Running the app

```bash
# RUN WITH DOCKER
$ docker compose up
# REBUILD THEN RUN WITH DOCKER
$ docker compose up --build
# NPM
$ npm run start:dev
```

## Rebuild A Docker Compose Image

```bash
# REBUILD A SPECIFIC SERVICE IN YAML COMPOSE
$ docker compose build --no-cache <service-name>
```

## Seed the database

```bash
# DOCKER
$ docker compose exec backend npm run seed
# NPM
$ npm run seed
```

## Get the hostname of running container (for TablePlus)

```bash
$ docker compose exec <service-name> hostname -i
```

## Create a resource with Nest CLI

```bash
$ nest g resource <resource-name>
# Example
$ nest g resource users
```

## Purge Docker images, containers and volumes

```bash
$ docker system prune --all --volumes --force
```
