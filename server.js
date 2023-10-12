const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({path: './config.env'});
mongoose.connect(process.env.DATABASE).then(() => console.log('connected with database'));

const server = app.listen(process.env.PORT, () => {
    console.log(`Application is running on port ${process.env.PORT}`);
});

// To globally handle any unhandled or rejected promises error
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => process.exit(1));
});