const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler')
const auth = require("./middlewares/auth");

require('dotenv').config();
require('./config/db')();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use(`/auth`, authRoutes);
app.use(`/user`, auth, userRoutes);
app.use(`/profile`, profileRoutes);


app.use(errorHandler);
app.use((req, res, next) => {
    return res
        .status(200)
        .send({ status: false, code: 404, message: "Route not found." });
});

const port = process.env.PORT || 5000;
const env = process.NODE_ENV || 'development';
app.listen(port, () =>
    console.log(`Listening on port: ${port}, and the environment is: ${env}`)
);