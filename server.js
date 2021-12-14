var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cors = require("cors");

var app = express();

app.use(cors());
app.options("*", cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());

frontendURL = process.env.FRONTEND_URL || "localhost:8080"

app.get("/", (req, res) => {
  res.redirect(frontendURL);
});

app.use(require('./src/routes/login'));
app.use(require('./src/routes/register'));
app.use('/api/v1/users', require('./src/routes/users'));

module.exports = app;