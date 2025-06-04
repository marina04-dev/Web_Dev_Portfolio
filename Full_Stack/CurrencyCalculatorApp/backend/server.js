const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const currencyRoutes = require('./routes/currencyRoutes');
const userRoutes = require('./routes/userRoutes');
const { authenticate } = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/currencies', currencyRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Currency Calculator API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});