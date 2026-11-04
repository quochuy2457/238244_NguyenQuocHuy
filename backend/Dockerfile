# Sử dụng image Node.js phiên bản gọn nhẹ
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy các file cấu hình package vào trước để tận dụng cache
COPY package*.json ./

# Cài đặt các thư viện
RUN npm install

# Copy toàn bộ mã nguồn còn lại (trừ những file trong .dockerignore)
COPY . .

# Khai báo cổng chạy ứng dụng
EXPOSE 5000

# Lệnh khởi chạy ứng dụng
CMD ["node", "server.js"]