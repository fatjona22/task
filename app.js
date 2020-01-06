const express = require('express');
const app = express();
const mongoose = require('mongoose')
const body_parser = require('body-parser')
const users = require('./routes/users');
const products = require('./routes/products')
const orders = require('./routes/orders')
const raports = require('./routes/raports')
//connect to the database
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//mongoose.connect('mongodb+srv://admin:1R73Ws4nCLbO1GkC@cluster0-qvdhy.mongodb.net/final?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
//mongoose.connect('mongodb+srv://admin:1R73Ws4nCLbO1GkC@cluster0-o0x0x.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect('mongodb://localhost/tasku', {useNewUrlParser: true, useUnifiedTopology: true})
 .then(()=> console.log('Connected to MongoDB...'))
 .catch(err=> console.error('Could not connect to MongoDB...', err));

 app.get('/', function(req,res){
    res.sendFile(__dirname + '/login.html')
});
app.get('/script', function(req,res){
    res.sendFile(__dirname + '/login.js')
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    next();
});

app.use(body_parser.json({ type: 'application/json' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/raports', raports);
//connect to the port 
// const port = process.env.PORT || 3000;
// app.listen(port, ()=> console.log(`Listening on port ${port}...`));


module.exports = app