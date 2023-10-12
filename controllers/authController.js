const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('./../utils/appError');
const userModel = require('./../models/userModel');
const { catchAsyncErrors } = require('./errorController');
const { token } = require('morgan');

const generateToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME} )
}

exports.signupUser = catchAsyncErrors(async (req, res, next) => {
    if(!req.body.confirmPassword)   throw new AppError('Please confirm password', 400);

    if(req.body.password !== req.body.confirmPassword)  throw new AppError('Password and confirm password do not match', 400);

    const newUser = await userModel.create(req.body);
    const token = await generateToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        }
    });
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    let {email, password} = req.body;
    if(!email || !password) throw new AppError('Please provide email and password', 400);

    const user = await userModel.findOne({ email }).select('+password');
    if(!user || !(await user.matchPassword(password, user.password))) {
        throw new AppError('Incorrect email or password', 401);
    }
        
    const token = await generateToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
        message: 'successfully logged in'
    });
});

exports.authenticate = catchAsyncErrors(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token)  throw new AppError('You are not logged in! Please login to get access', 401);

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await userModel.findById(decoded.id);
    if(!currentUser)   throw new AppError('User of this token no longer exist!', 401);

    req.user = currentUser;
    next();
});