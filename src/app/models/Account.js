const  mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const mongooseSequence = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Account = new Schema({
        userId: { type: String, default: uuidv4 , unique: true},
        email: { type: String, maxLength: 600, require: true},
        password: { type: String, maxLength: 600, require: true },
        fullname: { type: String, require: true},
        phonenumber: { type: String, require: true},
        birthday: {type: Date },
        access_token: {type: String},
        refresh_token: {type: String},
        roleId: {type: Number , default: 1 }
    },
    {
        timestamps: true,
    },
);


// Tự động tăng userId
// Account.plugin(mongooseSequence, {inc_field: 'userId'});

Account.pre('save', async function(next){
    try{
        const salt = await bcryptjs.genSalt(10);
        const passwordHashed = await bcryptjs.hash(this.password, salt);
        this.password = passwordHashed;
        return false;
    } catch ( error){
        next(error);
    }
})

// add plugin

module.exports = mongoose.model('Account', Account); 