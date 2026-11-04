import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // File CSS tuỳ chọn để làm đẹp

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/devices';

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  
  // Trạng thái (Loading, Error, Success)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Trạng thái form
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: '', name: '', deviceType: '', room: '', 
    brand: '', model: '', quantity: 1, status: 'Đang sử dụng', description: ''
  });

  // Gọi API lấy danh sách
  const fetchDevices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}?search=${search}`);
      setDevices(res.data);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu thiết bị.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Thêm debounce đơn giản cho tìm kiếm (tùy chọn)
    const delayDebounceFn = setTimeout(() => {
      fetchDevices();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Xử lý Xóa
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage('Xóa thiết bị thành công!');
        fetchDevices();
      } catch (err) {
        setError('Lỗi khi xóa thiết bị.');
      }
    }
  };

  // Xử lý mở form
  const handleOpenForm = (device = null) => {
    setShowForm(true);
    setError('');
    setMessage('');
    if (device) {
      setIsEdit(true);
      setFormData(device);
    } else {
      setIsEdit(false);
      setFormData({
        deviceId: '', name: '', deviceType: '', room: '', 
        brand: '', model: '', quantity: 1, status: 'Đang sử dụng', description: ''
      });
    }
  };

  // Xử lý Submit (Thêm / Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/${formData._id}`, formData);
        setMessage('Cập nhật thông tin thành công!');
      } else {
        await axios.post(API_URL, formData);
        setMessage('Thêm thiết bị mới thành công!');
      }
      setShowForm(false);
      fetchDevices();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm render màu cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang sử dụng': return 'green';
      case 'Hư hỏng': return 'red';
      case 'Đang sửa chữa': return 'orange';
      case 'Ngừng sử dụng': return 'gray';
      default: return 'black';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2>Hệ thống Quản lý Thiết bị Phòng học</h2>
      
      {/* Khung thông báo */}
      {loading && <p style={{ color: 'blue' }}>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px' }}>{error}</p>}
      {message && <p style={{ color: 'green', background: '#e6ffe6', padding: '10px' }}>{message}</p>}

      {/* Thanh công cụ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm mã, tên, loại, phòng..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ width: '300px', padding: '8px' }}
        />
        <button onClick={() => handleOpenForm()} style={{ padding: '8px 16px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
          + Thêm Thiết bị
        </button>
      </div>

      {/* Bảng danh sách thiết bị */}
      {!showForm ? (
        <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f2f2f2' }}>
            <tr>
              <th>Mã TB</th><th>Tên TB</th><th>Loại</th><th>Phòng</th><th>Số lượng</th><th>Tình trạng</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
            ) : (
              devices.map((d) => (
                <tr key={d._id}>
                  <td>{d.deviceId}</td>
                  <td>{d.name}</td>
                  <td>{d.deviceType}</td>
                  <td>{d.room}</td>
                  <td>{d.quantity}</td>
                  <td style={{ color: getStatusColor(d.status), fontWeight: 'bold' }}>{d.status}</td>
                  <td>
                    <button onClick={() => handleOpenForm(d)} style={{ marginRight: '5px' }}>Chi tiết / Sửa</button>
                    <button onClick={() => handleDelete(d._id)} style={{ color: 'red' }}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        /* Form Thêm / Cập nhật */
        <div style={{ border: '1px solid #ccc', padding: '20px', background: '#f9f9f9' }}>
          <h3>{isEdit ? 'Cập nhật thiết bị' : 'Thêm thiết bị mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>Mã TB: </label>
              <input type="text" required disabled={isEdit} value={formData.deviceId} onChange={(e) => setFormData({...formData, deviceId: e.target.value})} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Tên TB: </label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Loại TB: </label>
              <input type="text" required value={formData.deviceType} onChange={(e) => setFormData({...formData, deviceType: e.target.value})} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Phòng học: </label>
              <input type="text" required value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Số lượng: </label>
              <input type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Tình trạng: </label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Đang sử dụng">Đang sử dụng</option>
                <option value="Hư hỏng">Hư hỏng</option>
                <option value="Đang sửa chữa">Đang sửa chữa</option>
                <option value="Ngừng sử dụng">Ngừng sử dụng</option>
              </select>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button type="submit" style={{ marginRight: '10px', background: 'green', color: 'white', padding: '8px 16px', border: 'none' }}>Lưu</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px' }}>Hủy</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;