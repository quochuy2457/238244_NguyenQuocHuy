const mongoose = require("mongoose");

const STATUSES = [
  "Đang sử dụng",
  "Hư hỏng",
  "Đang sửa chữa",
  "Ngừng sử dụng"
];

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: 30
  },

  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },

  deviceType: {
    type: String,
    required: true,
    trim: true
  },

  room: {
    type: String,
    required: true,
    trim: true
  },

  brand: {
    type: String,
    trim: true,
    default: ""
  },

  model: {
    type: String,
    trim: true,
    default: ""
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: Number.isInteger
  },

  status: {
    type: String,
    enum: STATUSES,
    default: "Đang sử dụng"
  },

  purchaseDate: {
    type: Date,
    default: null
  },

  description: {
    type: String,
    default: ""
  }

}, {
  timestamps: true,
  collection: "devices"
});

deviceSchema.index({ deviceId: 1 }, { unique: true });

module.exports = mongoose.model("Device", deviceSchema);