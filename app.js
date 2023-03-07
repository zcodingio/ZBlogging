const express = require('express');
const app = express();
const path = require('path');
var fs = require('fs');
//Require Required Components for Users Login/Registration services
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');



// require bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Include EJS library
app.set('view engine', 'ejs');

//Require Lodash library
var _ = require('lodash');

//require Axios for Get & Post Requests
const axios = require('axios');

// Get Public Directory
app.use(express.static(path.join(__dirname, "public")));


//Set Server Port
port = process.env.PORT || 3000;


//Require All Routers for frontend
require('./routers')(app);
















//Route to server
app.listen(port, (req, res) => {
    console.log('Server listening on port ' + port);
});


