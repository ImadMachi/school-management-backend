FROM node:20-alpine3.18

WORKDIR /app

COPY package.json ./

RUN yarn global add @nestjs/cli

RUN npm install

COPY . .

EXPOSE 8000

CMD npm run start:dev