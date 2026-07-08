# ── Estágio 1: Build Angular ────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json
COPY package.json ./

# CORREÇÃO: usa "npm install" em vez de "npm ci"
# "npm ci" exige package-lock.json que só existe depois do primeiro install
# "npm install" funciona sempre, mesmo sem o lock file
RUN npm install --legacy-peer-deps

# Copia o resto do código e compila em modo produção
COPY . .
RUN npm run build

# ── Estágio 2: Servir com Nginx ─────────────────────────────
FROM nginx:alpine

# Copia o resultado do build para o Nginx servir
COPY --from=build /app/dist/crm-platform-frontend/browser /usr/share/nginx/html

# Copia configuração do Nginx (SPA routing + proxy para API)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
