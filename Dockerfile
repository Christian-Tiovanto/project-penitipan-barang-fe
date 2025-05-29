FROM node:20.9-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm install && npm cache clean -f
COPY . .
ENTRYPOINT ["npm", "run", "build"]

