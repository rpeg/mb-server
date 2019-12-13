require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const { CLIENT_ORIGIN } = require('./config');
const router = require('./routes/api');

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
);

app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.use('/', router);

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`);
});

module.exports = app;
