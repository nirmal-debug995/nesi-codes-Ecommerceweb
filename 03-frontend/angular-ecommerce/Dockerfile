FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production


FROM nginx:alpine

# Copy Angular build output
COPY --from=build /app/dist/angular-ecommerce /usr/share/nginx/html

# 🔥 IMPORTANT: overwrite default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
