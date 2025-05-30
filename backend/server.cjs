const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');



const app = express();
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


mongoose.connect('mongodb://127.0.0.1:27017/userblogdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


  app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});