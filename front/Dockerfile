FROM node:23-slim AS base
WORKDIR /code
COPY package*.json .
RUN npm install

FROM base AS dev
CMD ["npm", "run", "dev"]
EXPOSE 3000