FROM node:20.11.0-alpine

WORKDIR /app

RUN corepack enable && corepack prepare yarn@3.5.1 --activate

RUN npm install -g @nestjs/cli prisma

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3400 5555

CMD yarn prisma:migrate && yarn prisma:generate && yarn start:dev
