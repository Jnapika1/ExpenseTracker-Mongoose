const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

const express = require('express');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// const sequelize = require('./util/database');

// //models
const User = require('./models/userdetails');
// const Expense = require('./models/expensedetails');
// const Order = require('./models/order');
// const ForgotPassword = require('./models/forgotpassword');
// const File = require('./models/filehistory');



// app.set('view engine', 'ejs');
// app.set('views', 'views');

//routes
const userRoutes = require('./routes/routes');

//to record logs
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});

//helmet - security http headers - remove for csp/cors errors
// app.use(helmet());
//to log requests
app.use(morgan('combined', {stream: accessLogStream}));

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));

app.use(cors());

app.use(userRoutes);

app.use((req, res)=>{
    console.log('url', req.url);
	// res.setHeader("Content-Security-Policy-Report-Only", "default-src 'self' script-src 'self'; img-src 'self'; style-src 'self';base-uri 'self';form-action 'self'");
    res.sendFile(path.join(__dirname, `views/${req.url}`));
})

// User.hasMany(Expense);
// Expense.belongsTo(User, {
//     constraints: true,
//     onDelete: 'CASCADE'
// })

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(ForgotPassword);
// ForgotPassword.belongsTo(User);

// User.hasMany(File);
// File.belongsTo(User);

mongoose
.connect('mongodb+srv://jnapikaaish:sL2mLFkFwD6VfUBV@cluster0.yt3brse.mongodb.net/expensetracker?retryWrites=true&w=majority')
.then(result=>{
    console.log("connected");
    // const user = new User({
    //     username: "max",
    //     email: "maxtest@gmail.com",
    //     password: "max1234"
    // });
    // user.save();
    // console.log(user);
    app.listen(8000);
    
}).catch(err=>{
    console.log(err);
})

