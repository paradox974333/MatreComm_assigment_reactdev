const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { User, Book, Review };