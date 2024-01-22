module.exports = {

    mutipleMongooseToObject: function( mongooseArrays){
        // Xử lý tất cả các dữ liệu có trong Doc chuyển sang dữ liệu kahcs dể tránh lỗi bảo mật
        return mongooseArrays.map( mongooseArrays => mongooseArrays.toObject());
    },

    mongooseToObject: function( mongoose){
        return mongoose ? mongoose.toObject() : mongoose;
    }
};
