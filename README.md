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

## Purge Docker images, containers and volumes

```bash
$ docker system prune --all --volumes --force
```

## Create a resource with Nest CLI

```bash
$ nest g resource <resource-name>
# Example
$ nest g resource users
```

## Working with git

```bash
$ git fetch
$ git branch -a
$ git branch feature_management origin/feature_management # reflecting the remote branch for the first time
$ git fetch origin feature_management:feature_management # updating the remote brach
```
