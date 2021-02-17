FROM node:15

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3080
CMD [ "node", "index.js" ]