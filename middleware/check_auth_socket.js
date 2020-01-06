const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, next) => { 
  try {
    const token = req.handshake.query.token;
    console.log('Token found: ', token)
    const secretCode = config.get('jwtPrivateKey');
    const decoded = jwt.verify(token, secretCode);
    req.userData = decoded;
  } catch (error) {  console.log('Token not valid')
        return next(new Error('authentication error'));
  }
  next();
};
