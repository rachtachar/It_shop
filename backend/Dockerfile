# Stage 1: ใช้ Node.js image
FROM node:18-alpine

# กำหนด Working Directory ภายใน Container
WORKDIR /app

# Copy package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง Dependencies
RUN npm install

# Copy โค้ดทั้งหมดเข้ามาใน Container
COPY . .

# บอกให้ Docker รู้ว่า Container นี้จะทำงานที่ Port 5000
EXPOSE 5000

# คำสั่งสำหรับรันแอปพลิเคชัน
CMD ["node", "server.js"]