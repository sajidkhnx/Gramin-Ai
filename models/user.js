const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type: String},
    age :{type: Number},
    mobile : {type: String},
    address:{type: String,},
    username: { type: String, unique: true },
    password: String,
});

module.exports = mongoose.model('gramin user', userSchema);