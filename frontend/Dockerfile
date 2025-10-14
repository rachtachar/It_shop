# ----- Stage 1: Build aplication -----
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# สร้าง Production Build
RUN npm run build

# ----- Stage 2: Serve application with Nginx -----
FROM nginx:stable-alpine

# Copy build files จาก Stage 1 มายัง Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy Nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# บอกให้ Container ทำงานที่ Port 80
EXPOSE 80

# คำสั่งสำหรับรัน Nginx
CMD ["nginx", "-g", "daemon off;"]