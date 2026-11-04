# Bước 1: Build ứng dụng React
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Cấu hình biến môi trường mặc định lúc build (có thể ghi đè)
ARG REACT_APP_API_URL=http://localhost:5000/api/devices
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Bước 2: Chạy ứng dụng bằng Nginx
FROM nginx:alpine
# Copy code đã build từ bước 1 sang thư mục chạy của Nginx
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80 cho web
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]