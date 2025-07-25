// index.js

const tutorRoutes = require('./routes/tutorRoutes');

const categoryRoutes = require('./routes/categoryRoutes');

const certificateRoutes = require('./routes/certificateRoutes');

const tutorRoutes = require('./routes/tutorRoutes');




const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (we'll define these later)
app.use('/api/auth', require('./routes/authRoutes'));


app.use('/api/tutors', tutorRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/certificates', certificateRoutes);

app.use('/api/tutor', tutorRoutes);



// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
