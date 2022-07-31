# Build image
FROM node:16.16.0

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm config set unsafe-perm true

RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install

COPY --chown=node:node . .
RUN npm run build

# Deploy image
FROM node:16.16.0
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install --production
COPY --from=builder /home/node/app/build ./build
COPY --chown=node:node config/*.env config/.
EXPOSE 3080
CMD [ "node", "build/index.js" ]