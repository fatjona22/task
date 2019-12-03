const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Joi= require('joi')
const _ = require('lodash');

//register users for the first time, with a unique username and same a hashed password not the real password 
exports.register_user = async function(req,res){

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 
     
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered');

    let users = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        picture: req.files.map(file => file.path),
        tel: req.body.tel
    });
    const salt = await bcrypt.genSalt(10);
    users.password = await bcrypt.hash(users.password, salt)
    await users.save();
    res.send(_.pick(users, ['username','picture','email','tel']));
}; 

//login user and generate a jwt and return it to header which is going to be used for other requests
exports.login_user = async function(req,res){
    console.log(req.body)
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({username: req.body.username});
    if(!user) return res.status(400).send('Invalid user or password');

    const validPassword = await  bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');
    
const token = user.generateAuthToken();
res.header('x-auth-token', token).send(_.pick(user, ['_id','username','email']));
};

function validateUser(req){
    const schema = { 
        username: Joi.string().required(),
        password: Joi.string().required()
    };
    return Joi.validate(req, schema);
}