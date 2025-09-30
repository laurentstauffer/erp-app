# Étape 1 : build
FROM node:20 AS build
WORKDIR /app

# Copier package.json et package-lock.json et installer
COPY package*.json ./
RUN npm install

# Copier tout le reste du projet Angular (src, angular.json, tsconfig.json, assets...)
COPY . .


RUN npm run build --prod

# Étape 2 : runtime léger
FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
# Copier une config Nginx adaptée pour Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
