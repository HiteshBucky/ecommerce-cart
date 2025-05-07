FROM node:14.10.1 AS build
WORKDIR /srv
ADD package.json .
RUN npm install

FROM node:14.10.1-slim
WORKDIR /app
COPY --from=build /srv .
COPY . .
RUN --mount=type=secret,id=env_file \
    cat /run/secrets/env_file > .env
EXPOSE 3010
CMD [ "node" , "index.js" ]