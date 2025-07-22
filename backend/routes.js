const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stream = require('stream');
const { User, Book, Review } = require('./models');
const auth = require('./authMiddleware');
const admin = require('./adminMiddleware');
const upload = require('./upload');
const cloudinary = require('./cloudinaryConfig');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    const userResponse = { _id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin };
    res.status(201).json(userResponse);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    const userResponse = { _id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin };
    res.json({ token, user: userResponse });
  } catch (err) {
    next(err);
  }
});

router.post('/books', auth, admin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Book image is required' });
    }

    const readableStream = stream.Readable.from(req.file.buffer);

    const cloudinaryStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
      if (error) {
        return next(error);
      }

      const book = await Book.create({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        image: result.secure_url,
      });
      res.status(201).json(book);
    });

    readableStream.pipe(cloudinaryStream);
  } catch (err) {
    next(err);
  }
});

router.get('/books', async (req, res, next) => {
  try {
    const books = await Book.find().lean();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

router.get('/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const reviews = await Review.find({ book: req.params.id }).populate('user', 'username').lean();
    res.json({ book, reviews });
  } catch (err) {
    next(err);
  }
});

router.post('/books/:id/review', auth, async (req, res, next) => {
  try {
    const { rating, reviewText } = req.body;
    const bookId = req.params.id;

    const existing = await Review.findOne({ user: req.user._id, book: bookId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    await Review.create({ user: req.user._id, book: bookId, rating, reviewText });

    const reviews = await Review.find({ book: bookId });
    const avg = reviews.length > 0 ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;
    await Book.findByIdAndUpdate(bookId, { averageRating: avg });

    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    next(err);
  }
});

router.get('/admin/stats', auth, admin, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalReviews = await Review.countDocuments();
    const topBooks = await Book.find().sort({ averageRating: -1 }).limit(5).lean();

    res.json({ totalUsers, totalBooks, totalReviews, topBooks });
  } catch (err) {
    next(err);
  }
});

module.exports = router;