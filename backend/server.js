const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const routes = require('./routes');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use('/api', routes);

app.get('/ping', (req, res) => {
  res.send('Pong 🏓');
});

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});