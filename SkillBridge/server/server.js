const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/bids', require('./routes/bids'));
app.use('/api/reviews', require('./routes/reviews'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillBridge API is running' });
});

// Serve React build
app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// 🔥 LISTEN MUST BE LAST
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
