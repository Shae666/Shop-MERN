const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes'); // ✅ CommonJS style

const app = express();

// ✅ Middleware
app.use(cors({
    origin: "http://localhost:5173",  // fixed typo (was orgin)
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json()); // parse JSON

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.get('/', (req, res) => {
    res.send("Connected to database from frontend");
});

app.use('/api/auth', authRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
