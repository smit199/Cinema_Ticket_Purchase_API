const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const YAML = require('yamljs');
// const swaggerUI = require('swagger-ui-express');
const fs = require('fs');
const userRouter = require('./routes/userRoutes');
const cinemaRouter = require('./routes/cinemaRoutes');
const AppError = require('./utils/appError');
const { globalErrorHandler } = require('./controllers/errorController');

const app = express();

// swagger documentation
// const swaggerJsDocs = YAML.load('api-docs.yaml');
// app.use('/cinema/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

// setting security headers
app.use(helmet());

// limiting number of requests from same IP for security
const limiter = rateLimit({
    max: 1000,
    windowMs: 60*60*1000,
    message: 'Too many requests from this IP, please try again in a hour!',
    handler: (req, res, next, options) => {
        throw new AppError(options.message, options.statusCode);
    }
});
app.use('/', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// to parse body and limit body size
app.use(express.json({ limit: '5mb' }));

// to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// routers
app.use(cinemaRouter);
app.use(userRouter);

// Global error handling
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find the requested url in the server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;