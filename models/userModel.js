const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide your name"],
    },
    email: {
        type: String,
        required: [true, "Provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "invalid email address"],
    },
    password: {
        type: String,
        required: [true, "Provide password"],
        minlength: [8, "password must be minimum 8 characters long"],
        select: false
    },
}, {
    timestamp: true,
    versionKey: false
});

userSchema.pre('save', async function(next) {
    // only encrypt the password if password is modified
    if(!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.matchPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('users', userSchema);
module.exports = User;