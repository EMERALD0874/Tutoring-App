FROM node:19

WORKDIR /usr/src/app/frontend

EXPOSE 8000

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY src ./src
COPY public ./public

RUN npm install

CMD ["npm", "run", "build"]