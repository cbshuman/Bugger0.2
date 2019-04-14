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
app.use(cookieParser());

const projects = require("./projects.js");
app.use("/api/projects", projects);

const bugs = require("./bugs.js");
app.use("/api/bugs", bugs);

const users = require("./users.js");
app.use("/api/users", users.routes);

const permissions = require("./permissions.js");
app.use("/api/permissions", permissions.routes);

app.listen(3000, () => console.log('Server listening on port 3000!'));
