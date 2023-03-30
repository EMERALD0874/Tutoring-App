FROM node:19

ENV PROJECT_PORT=3000

EXPOSE 3000

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install

CMD ["npm", "start"]
