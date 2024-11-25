const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const userRoute = require('./routes/User');
const examQuestionsRoute = require('./routes/ExamQuestions');
const userExamsRoute = require('./routes/UserExams');
const examRoute = require('./routes/Exam');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // React frontend running on port 3000
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Include PATCH for CORS
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Add necessary headers
}));

app.use(bodyParser.json()); // Parse JSON bodies

// MongoDB connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_ACCESS, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

// Routes
app.use('/users', userRoute);
app.use('/examquestions', examQuestionsRoute);
app.use('/exam', examRoute);
app.use('/userexams', userExamsRoute);

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../Quiz-app-remastered-main/build')));

// Catch-all route to serve index.html for React routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Quiz-app-remastered-main/build', 'index.html'));
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Examly API!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});







