FROM node:lts-alpine AS build
WORKDIR /src
COPY . .
RUN yarn install
RUN yarn build

FROM node:lts-alpine
COPY --from=build /src/dist ./app
RUN npm install -g serve
CMD serve -s app
