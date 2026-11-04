const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Trả về mã 500 nếu là lỗi từ database (như sai định dạng ID) hoặc lỗi kết nối
  res.status(500).json({
    success: false,
    message: err.message || 'Lỗi kết nối hoặc lỗi máy chủ nội bộ'
  });
};

module.exports = errorHandler;