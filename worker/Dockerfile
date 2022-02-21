FROM node:12-buster
WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm install -g nodemon
CMD [ "npm","run", "start" ]