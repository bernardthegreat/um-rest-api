let error = null
// 10.107.5.253 ssh credentials
// username: root
// password: ML150g6@uermweb

// Gmail Account
// Email: dev.it@uerm.edu.ph
// Password: OTIM3NAN@uerm

// Github Account
// Email: dev.it@uerm.edu.ph
// Username: dev-it-uerm
// Password : OTIM3NAN@uerm

const jwt = require('jsonwebtoken');
require('dotenv/config')

function checkAuth(auth) {
  const validAuthKeys = [
    "54inqmZQ2GUsjioM2tQmTMF1hXBv1zzw",
  ];

  if (!auth) {
    this.error = 'Cannot validate auth key.'
    return false
  } else if (!validAuthKeys.find((authVal) => authVal == auth)) {
    if (validateToken(auth)) {
      return true
    }
    this.error = 'Invalid auth key.'
    return false
  } else {
    return true
  }
}

function generateToken(user, expiresIn='12h') {
  var token = jwt.sign({ username: user }, process.env.TOKEN, { expiresIn });
  return token;
}

function validateToken(token) {
  try {
    var decoded = jwt.verify(token, process.env.TOKEN);
    return decoded != undefined;
  } catch (error) {
    this.error = 'Invalid token. Please login again.'
    return false
  }
}

module.exports = {
  checkAuth,
  generateToken,
  validateToken,
  error,
}