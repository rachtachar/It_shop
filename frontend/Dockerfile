# frontend/Dockerfile

# --- Stage 1: Build a React App ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

# ✨ เพิ่มบรรทัดนี้เข้าไป เพื่อ copy ไฟล์ config ของเรา
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]