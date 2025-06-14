// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  tags: [
    {
      type: String,
    },
  ],
  categories: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('Blog', blogSchema);