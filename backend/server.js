require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Đã kết nối thành công tới MongoDB Atlas!'))
    .catch((err) => console.error('Lỗi kết nối MongoDB Atlas:', err));
}

// Model Device (cho Câu 2 & Câu 3)
const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  room: { type: String, required: true },
  status: { type: String, default: 'active' }
}, { timestamps: true });

const Device = mongoose.models.Device || mongoose.model('Device', deviceSchema);

// Endpoint kiểm tra sức khỏe hệ thống
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running healthy',
    timestamp: new Date()
  });
});

// APIs quản lý thiết bị (Câu 3)
app.get('/api/devices', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/devices', async (req, res) => {
  try {
    const newDevice = new Device(req.body);
    const savedDevice = await newDevice.save();
    res.status(201).json(savedDevice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});