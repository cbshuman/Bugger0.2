const express = require('express');
const bodyParser = require("body-parser");

const multer = require('multer')
const upload = multer(
	{
	dest: '../public/images/',
	limits:
		{
    	fileSize: 10000000
  		}
	});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/bugger', { useNewUrlParser: true });



const cookieParser = require("cookie-parser");
const bugs = require("./bugs.js");
const permissions = require("./permissions.js");
const projects = require("./projects.js");
const users = require("./users.js");

app.use(cookieParser());
app.use("/api/bugs", bugs);
app.use("/api/projects", projects.routes);
app.use("/api/permissions", permissions.routes);
app.use("/api/users", users.routes);

app.listen(3000, () => console.log('Server listening on port 3000!'));
