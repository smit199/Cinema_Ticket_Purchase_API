const AppError = require("./../utils/appError");

const handleDBValidationError = (err, res) => {
    const errorMessage = Object.values(err.errors).map(item => item.message).join('. ');
    return new AppError(errorMessage, 400);
}

const handleDBCastError = err => {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

const handleDuplicateFieldsError = err => {
    const duplicates = err.keyValue;
    let message;
    for(let field in duplicates) {
        if(field === 'email')   message = `User with email ${duplicates[field]} already exist. Try with diffrent email address`;
        else message = `Duplicate ${field} value ${duplicates[field]}. Use another value`;
    }
    return new AppError(message, 400);
}

const sendError = (err, res) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        console.log(err);
        res.status(500).json({
            status:'error',
            message: 'Programming error at server side!',
        });
    }
}

exports.globalErrorHandler = (err, req, res, next) => {
    let error = err
    if (error.name === 'CastError') error = handleDBCastError(error);
    if (error.name === 'ValidationError') error = handleDBValidationError(error, res);
    if (error.code === 11000) error = handleDuplicateFieldsError(error);
    sendError(error, res);
}

exports.catchAsyncErrors = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}