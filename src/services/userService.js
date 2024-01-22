require("dotenv").config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const Account = require('../app/models/Account');
const JWTService = require('./JWTService');
const { createAccessToken, createRefreshToken} = require('../middleware/jwtacction');

async function handlerLogin(email, password) {
    return new Promise( async ( resolve, reject) => {
        try{
            let userData = {};
            let user = await  Account.findOne( { email: email })
                if( user ){
                    // Compare password
                    let checkpass =  checkPassWord( password, user.password);
                    if( checkpass){
                        let payloadAccess = {
                            email: user.email,
                            roleId: user.roleId,
                            expiresIn: Math.floor(Date.now() / 1000) + 30*60,
                        }
                        let payloadRefresh = {
                            email: user.email,
                            roleId: user.roleId,
                            expiresIn: Math.floor(Date.now() / 1000) + 60*60,
                        }
                        // tạo Access_Token và Refresh_Token
                        let accessToken = createAccessToken(payloadAccess);
                        let refreshToken = createRefreshToken(payloadRefresh);
                    
                        userData = {
                            Success :true,
                            Mess : 'Đăng nhập thành công',
                            access_token:  accessToken,
                            refresh_token: refreshToken,
                        }     
                        // Kiểm tra errCode có đủ điều kiện
                        if( userData.Success ){
                            Account.updateOne( {email:email},{
                                $set: {
                                    access_token: userData.access_token,
                                    refresh_token: userData.refresh_token
                                }
                            }) .catch( err => { console.error(err); })
                        }     
                    } else {
                        userData = {
                            Success :false,
                            Mess : 'Email hoặc mật khẩu sai',
                            
                        }    
                    }
                } else {    
                    userData = {
                        Success :false,
                        Mess : 'Email hoặc mật khẩu sai',
                    }    
                }
                console.log(userData);
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

async function checkUserName ( email ){
    let user = await  Account.findOne( { email: email })
    if( user ){
        return true;
    } else {
        return false;
    }
}

const checkPassWord = (inputPass, hashPass) => {
    return bcryptjs.compareSync( inputPass, hashPass);
}


module.exports = {
    handlerLogin: handlerLogin,
      
}