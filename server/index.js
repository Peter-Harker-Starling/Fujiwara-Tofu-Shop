const express = require('express');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orders')
const adminRoutes = require('./routes/admins')

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes)
app.use('/api/admins', adminRoutes)

// MongoDB 連線
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
  });

// 前端靜態檔
app.use(express.static(path.join(__dirname, '../client/dist')))

// 多頁支援
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/admin.html'))
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});