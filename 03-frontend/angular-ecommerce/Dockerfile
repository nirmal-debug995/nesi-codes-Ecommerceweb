# ---------- BUILD STAGE ----------
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production


# ---------- RUN STAGE (NGINX) ----------
FROM nginx:alpine

# copy Angular build
COPY --from=build /app/dist/angular-ecommerce /usr/share/nginx/html

# 🔥 copy custom nginx config (IMPORTANT FIX)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
