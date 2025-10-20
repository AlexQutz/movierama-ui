# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Install deps (use npm ci if you keep a clean lockfile, else fall back)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Build
COPY . .
# Bake your backend base URL so the browser calls localhost:8080
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine
# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html
# SPA fallback
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1
