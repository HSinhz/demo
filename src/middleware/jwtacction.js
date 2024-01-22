require("dotenv").config();
const jwt = require('jsonwebtoken');
const Account = require('../app/models/Account');

const createAccessToken = ( payload ) => {
    let keyAccess = process.env.JWT_SECRET;
    let accessToken = null;
    try{
        accessToken = jwt.sign(payload, keyAccess);
    } catch ( err ){
        console.log(err);
    }
    return accessToken;
}

const createRefreshToken = ( payload ) => {
    let keyRefresh = process.env.JWT_SECRET;
    let refreshToken = null;
    try{
        refreshToken = jwt.sign(payload, keyRefresh);
    } catch ( err ){   
        console.log(err);
    }
    return refreshToken;
}

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    let decoded = null;
    try{
        decoded = jwt.verify(token, key);
    } catch (err) {
        console.log(err);
    }
    return decoded;
}


module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyToken,
    
}