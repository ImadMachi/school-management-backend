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
$ docker compose build <service-name>
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
$ sudo docker compose exec <service-name> hostname -i
```
