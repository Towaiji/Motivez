require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
app.use('/api/activities', activityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
