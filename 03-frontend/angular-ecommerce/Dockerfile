FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production --base-href=/

FROM nginx:alpine

# 🔥 FIX: correct Angular output path (IMPORTANT)
COPY --from=build /app/dist/angular-ecommerce/ /usr/share/nginx/html/

# SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
