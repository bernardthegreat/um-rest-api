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
    "54inqmZQ2GUsjioM2tQmTMF1hXBv1zzw", // MOBILE
    "cfd7CqlQF4kAr42Z4FAitavfQSx0Tbd5", // e-patients portal
    "SjqvHXymNskzsLsclRBNZHugHzUH6qeq", // e-patients appointments
    "qG7JotCSrFJO2eSW4RdaIPYx33ECiBs6", // webapps
    "8SgTLojxwPX884TgT3lIgeZsufaae90O", // Hl7 Middleware
    "7190WHUt7gzKgrRURMnoS4D7tX6Xp112", // Covid-19 Health Declaration
    "So1DSBKffnbTKwdgIIcetg2z3GyNKeQi", // Covid Monitoring
    "eSWHugHzUmZQ2GUsBKffyNKeNZHuSWtX", // Hospital Website
    "FJO2qvHeSW4RIPYx33EF1hXBvdZQ2aI3", // UE Student Portal
    "nw9cMQufX1oSBz4KfsdKMaS8ucDBVFy3", // Purchase Request
    "54inqmcfd7Cq84TgT3lIgcDBVFy3uSWt", // Personnel Information
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