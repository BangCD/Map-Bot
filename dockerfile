FROM node:12-slim
LABEL maintainer="BangCD"

# Install app dependencies.
COPY data/package.json /src/package.json
WORKDIR /src
RUN npm install

# Bundle app source.
COPY data /src

CMD ["node", "index.js"]