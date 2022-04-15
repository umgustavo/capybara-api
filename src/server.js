require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const log = require('gulog');
const chalk = require('chalk');
const { sendError } = require('./util/error');

log.setup({
    prefix: '(capybara)',
});

const app = express();
const routes = require('./routes');
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/v1', routes);

app.use(function (err, req, res, next) {
    if (err.isCustomError === true) return sendError(res, err.message);
    log.error(`An error ocurred at route ${chalk.red(req.originalUrl)}:`);
    console.log(err);
    return sendError(res, 'internal_error');
});

app.listen(PORT, () => {
    log.info(`🚀 Server listening on port ${chalk.cyan(PORT)}.`);
});
