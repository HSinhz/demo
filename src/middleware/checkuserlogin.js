const { createAccessToken, createRefreshToken, verifyToken } = require('./jwtacction');
const { checkUserName , sendMail } = require('../services/userService')


const checkUserJWT = (req, res, next )=> {
    
    let decodeAccessToken = verifyToken(req.headers.accesstoken);
    let decodeRefreshToken = verifyToken(req.headers.refreshtoken);
    
    let expiresIn = decodeAccessToken.expiresIn;
    let check = checkExpiredJWT(expiresIn)
    if(decodeAccessToken){  // Kiểm tra AccessToken có tồn tại
        if( check ){ // Kiểm tra thời gian của AccessToken
            req.user = decodeAccessToken;
            // console.log("Token còn thời hạn")
            next();
        } else {
            if( decodeRefreshToken ){ // Kiểm tra RefreshToken có tồn tại
                let expiresInRefresh = decodeRefreshToken.expiresIn;
                if( checkExpiredJWT(expiresInRefresh)) {
                    let payloadAccess = {
                        email: decodeAccessToken.email,
                        roleId: decodeAccessToken.roleId,
                        expiresIn: Math.floor(Date.now() / 1000) + 30*60
                    }
                    let payloadRefresh = {
                        email: decodeAccessToken.email,
                        roleId: decodeAccessToken.roleId,
                        expiresIn: Math.floor(Date.now() / 1000) + 60*60
                        // expiresIn: process.env.JWT_EXPIRES_IN
                    }

                    // Tạo mới AccessToken và RefreshToken
                    let newAccessToken = createAccessToken(payloadAccess);
                    let newRefreshToken = createRefreshToken( payloadRefresh);
                    req.user = newAccessToken;

                    // Cập nhật vào DBS
                    Account.updateOne( {email:payload.email},{
                        $set: {
                            access_token: newAccessToken,
                            refresh_token: newRefreshToken
                        }
                    }). then().catch(() => console.log( "Thêm thất bại"))
                    console.log("Đây là token mới: ",newAccessToken);
                    next(); // ==> chuyển người dùng tới trang /homme nếu tất cả đã hoàn thành 
                } else {
                    return res.status(500).json({
                        Success: false,
                        MessErr: "Refresh Token is not exist"
                    })
                    
                }
            } else {
                return res.status(500).json({
                    Success: false,
                    MessErr: "Refresh Token is not exist"
                })
            }
        }
    } else {
        return res.status(401).json({
            Success: false,
            MessErr: "Access Token is not exist" 
        })
    }
   
}

const checkExpiredJWT = (expiresIn) => {
    let currentTimes = Math.floor(Date.now() / 1000);
    console.log("Time now: " ,currentTimes - expiresIn);
    
    if( currentTimes > expiresIn ){
       return false;
    } else {
        return true;
    }
}

module.exports = {
    checkUserJWT,
}