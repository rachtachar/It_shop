# backend/Dockerfile

# 1. ใช้ Base Image ที่มี Node.js ติดตั้งอยู่
FROM node:18-alpine

# 2. ตั้งค่า Working Directory ภายใน Container
WORKDIR /app

# 3. Copy ไฟล์ package.json และ package-lock.json เข้าไปก่อน
# เพื่อใช้ประโยชน์จาก Docker's layer caching
COPY package*.json ./

# 4. ติดตั้ง Dependencies
RUN npm install

# 5. Copy โค้ดที่เหลือทั้งหมดเข้าไปใน Container
COPY . .

# 6. บอกให้ Docker รู้ว่าแอปของเราจะทำงานที่ Port 5000
EXPOSE 5000

# 7. คำสั่งที่จะรันเมื่อ Container เริ่มทำงาน
CMD ["npm", "start"]