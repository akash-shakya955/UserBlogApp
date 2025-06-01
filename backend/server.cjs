// server.cjs
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/UserBlogApp')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Models
const User = require('./models/User');
const Blog = require('./models/Blog');
const Tag = require('./models/Tag');
const Category = require('./models/Category');

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/blogs', upload.single('image'), async (req, res) => {
  try {
    // req.body se data lo (form-data ya JSON dono ke liye)
    const { title, content, author, tags, categories } = req.body;

    // Required fields validate karo
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (!author) {
      return res.status(400).json({ error: 'Author is required' });
    }

    // Tags ko process karo
    let tagList;
    if (Array.isArray(tags)) {
      tagList = tags;
    } else if (typeof tags === 'string') {
      tagList = tags.split(',').map(tag => tag.trim());
    } else {
      tagList = [];
    }

    // Categories ko process karo
    let categoryList;
    if (Array.isArray(categories)) {
      categoryList = categories;
    } else if (typeof categories === 'string') {
      categoryList = categories.split(',').map(category => category.trim());
    } else {
      categoryList = [];
    }

    const blog = new Blog({
      title,
      content,
      author,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      tags: tagList,
      categories: categoryList,
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created', blog });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author')
      .populate('tags')
      .populate('categories');
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tags', async (req, res) => {
  try {
    const { name } = req.body;
    const tag = new Tag({ name });
    await tag.save();
    res.status(201).json({ message: 'Tag created', tag });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});