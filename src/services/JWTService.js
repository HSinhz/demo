const Account = require('../app/models/Account');


async function getRoleUser( user) {
        try{
            if( user ){
                let groupId = user.groupId;
                // let  = {};
                let roles = await Group.findOne({  idrole: groupId })                        
                return roles;
            } else {
                console.log(" User is not valid");
            }
        } catch (err) {
            return err;
        }
}
module.exports = {
    getRoleUser: getRoleUser
}


