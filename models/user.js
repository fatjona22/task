const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true
    }, 
    email: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    tel: {
        type: Number
    },
    picture:[{type : String , required:true}]
    
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);
function validateUser(user){
    const schema = {
        username: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        tel: Joi.number()

    };
    return Joi.validate(user, schema);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;