FROM node:20.9-alpine AS builder
WORKDIR /app

ARG VITE_API_URL
ARG VITE_MODE

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_MODE=${VITE_MODE}

COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]