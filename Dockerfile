# Gunakan image Node.js 22 slim untuk ukuran lebih kecil dan efisiensi
FROM node:22-slim

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependensi dengan --legacy-peer-deps untuk menangani konflik React RC
RUN npm install --legacy-peer-deps

# Salin seluruh kode aplikasi
COPY . .

# Build aplikasi Next.js untuk produksi
RUN npm run build

# Expose port default Next.js
EXPOSE 3000

# Jalankan aplikasi dalam mode produksi
CMD ["npm", "start"]
