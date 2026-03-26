require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//MiddleWare
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/auth',require('./routes/auth'));
app.use('/email', require('./routes/email'));
app.use(errorController.get404Page);

app.listen(5000);
