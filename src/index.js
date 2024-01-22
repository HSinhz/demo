const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
require("dotenv").config();
const { createJWT, verifyToken } = require('./middleware/jwtacction');
const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, 'public')));
const routes = require( './routes/IndexRoute')

// kết nối với dtb ở đây
const db = require('./config/db/config');

// Connect to DB
db.connect();

// Xử lý dũ liệu từ form subbmit lên bằng phương thức POST
app.use(express.urlencoded(
  {
    extended: true
  }
));
app.use(express.json());
app.use(methodOverride('_method'))

// test JWT 

// ----------------------------------


//Templete engine
app.engine('hbs', handlebars.engine(
  {
    extname: '.hbs',
    helpers: {
      sum: ( a, b) => a + b,
    }
  }
));

// Dùng để render ra view
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources' , 'views'));




// Route init
routes(app);




app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
})