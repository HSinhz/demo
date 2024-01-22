const userRoute = require('./userRoute');

function route(app){
    
    app.use('/', userRoute);
    
}
module.exports = route;