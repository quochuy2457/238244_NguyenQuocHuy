const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Thiếu biến môi trường MONGODB_URI");
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || "238244_NguyenQuocHuy",
    serverSelectionTimeoutMS: 10000
  });

  console.log(
    `MongoDB connected: ${mongoose.connection.name}`
  );
}

module.exports = connectDB;