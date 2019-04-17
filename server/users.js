const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const auth = require("./auth.js");

const security = require("./permissions.js");
const securityModel = security.model;

//Delete old profile pictures
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

//Load up profile pictures
const multer = require('multer')
const upload = multer(
	{
	dest: '../public/images/',
	limits:
		{
    	fileSize: 10000000
  		}
	});

const SALT_WORK_FACTOR = 10;

// Users
const userSchema = new mongoose.Schema(
	{
	username: String,
	password: String,
	firstName: String,
	lastName: String,
	alias: String,
	address: String,
	phone: String,
	secondaryEmail: String,
	profilePicture: String,
	enabled: Boolean,
	permissions: [],
	tokens: [],
	});

userSchema.pre('save', async function(next)
	{
	// only hash the password if it has been modified (or is new)
	if (!this.isModified('password'))
		{
		return next();
		}
	try
		{
		// generate a salt
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

		// hash the password along with our new salt
		const hash = await bcrypt.hash(this.password, salt);

		// override the plaintext password with the hashed one
		this.password = hash;
		next();
		}
	catch (error)
		{
		console.log(error);
		next(error);
		}
	});

userSchema.methods.comparePassword = async function(password)
	{
	try
		{
		const isMatch = await bcrypt.compare(password, this.password);
		return isMatch;
		}
	catch (error)
		{
		return false;
		}
	};

userSchema.methods.comparePermissions = function(permissions)
	{
	//Admins can see everything
	//console.log(permissions);
	if(!this.permissions.includes('admin'))
		{
		//Check the list of permissions
		for(let i = 0; i < permissions.length; i++)
			{
			//console.log("Checking permission: " + permissions[i]);
			//If you don't have a particular permission, return false
			if(!this.permissions.includes(permissions[i]))
				{
				//console.log("User doesn't have permission:" + permissions[i]);
				return(false);
				}
			}
		}
	return(true);
	};

// middleware to validate user account
userSchema.statics.verify = async function(req, res, next)
	{
	// look up user account
	const user = await User.findOne({ _id: req.user_id });
	//console.log(user._id);

	if (!user || !user.tokens.includes(req.token))
		{
		return res.clearCookie('token').status(403).send({ error: "Invalid user account." });
		}
	else if (user.permissions.includes('admin'))
		{
		req.isAdmin = true;
		}
	else
		{
		req.isAdmin = false;
		}

	//console.log(req.isAdmin);

	req.user = user;
	next();
	}


userSchema.methods.addToken = function(token) {	this.tokens.push(token); }
userSchema.methods.removeToken = function(token) { this.tokens = this.tokens.filter(t => t != token); }
userSchema.methods.removeOldTokens = function() { this.tokens = auth.removeOldTokens(this.tokens); }

userSchema.methods.toJSON = function()
	{
	var obj = this.toObject();
	delete obj.password;
	delete obj.tokens;
	return obj;
	}

const User = mongoose.model('User', userSchema);

// create a new user
router.post('/', auth.verifyToken, User.verify, async (req, res) =>
	{
	//console.log("User is an admin: " + req.isAdmin);
	//Verify that we have an admin account
	if(!req.isAdmin)
		{
		return res.status(403).send({error: "You require Administrator privlages to make the requested request!"});
		}

	//console.log("Creating user: " + req.body.username);
	if (!req.body.username || !req.body.password  || !req.body.lastName || !req.body.firstName)
		{
		return res.status(400).send({message: "username, real name(first and last), and password are required"});
		}

	try
		{
		//  check to see if username already exists
		const existingUser = await User.findOne(
			{
			username: req.body.username
			});
		if (existingUser)
			{
			return res.status(403).send({message: "username already exists"});
			}

		// create new user
		const user = new User(
			{
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password,
			alias: '',
			address: '',
			phone: '',
			secondaryEmail: '',
			profilePicture: '',
			enabled : true,
			permissions: [],
			tokens: [],
			});
		await user.save();
		return res.send(user);
		} 
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

// login
router.post('/login', async (req, res) =>
	{
	//console.log("Logging in, logging in!");

	if (!req.body.username || !req.body.password)
		{
		return res.sendStatus(400);
		}
	try 
		{
		//  lookup user record
		const existingUser = await User.findOne({ username: req.body.username });
		if (!existingUser)
			{
			return res.status(403).send({message: "username or password is wrong"});
			}
		// check password
		if (!await existingUser.comparePassword(req.body.password))
			{
			return res.status(403).send({ message: "username or password is wrong"});
			}
		login(existingUser, res);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

//Change Permissions
router.put('/update/security/', auth.verifyToken, User.verify, securityModel.verify, async (req, res) =>
	{
	//console.log("Updating Security . . ." + "Adding: " + req.body.addPermission);

	if(!req.isAdmin)
		{
		return res.status(403).send({error: "You require Administrator privlages to make the requested request!"});
		}
	try
		{
		const user = await User.findOne({ username: req.body.username });

		//Can't take the admin out of the admin group
		if(req.body.permission == 'admin' && req.body.username == 'admin')
			{
			return res.sendStatus(403).send({error: "Cannot take the admin out of the admin group!"});;
			}

		if(!user.permissions)
			{
			user.permissions = '';
			}

		//console.log(req.hasPermission);
	
		if(!req.hasPermission)
			{
			//console.log("Permission is not there");
			return res.sendStatus(500);
			}

		if (req.body.addPermission)
			{
			if(user.permissions.includes(req.body.permission))
				{
				console.log("Already has permission");
				return res.sendStatus(500);
				}
			user.permissions.push(req.body.permission);
			}
		else if(!req.body.addPermission)
			{
			if(!user.permissions.includes(req.body.permission))
				{
				console.log("Can't remove permission that isn't there");
				return res.sendStatus(500).send({error: "The user does not have the specified Permission"});;
				}
			for(let i = 0; i < user.permissions.length; i++)
				{
				if(user.permissions[i] == req.body.permission)
					{
					console.log("Removing permission at: " + i);
					user.permissions.splice(i,i+1);
					break;
					}
				}
			}

		await user.save();
		return res.send(user)
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

//Update profile information
router.put('/update/', auth.verifyToken, User.verify, async (req, res) =>
	{
	//console.log("Updating user: " + req.body.username + "/" + req.body._id);
	if (!req.body.username || !req.body.lastName || !req.body.firstName)
		{
		return res.status(400).send({message: "Username, real name(First and last), and password are required"});
		}

	if(req.user.username === 'admin')
		{
		return res.status(400).send({message: "Cannot modify the admin account settings"});
		}

	try
		{
		//search for user
		let user = await User.findOne({ _id: req.body._id });
		
		if (!user)
			{
			return res.status(403).send({message: "Can't find user"});
			}

		//console.log("updating: " + user.username);
		user.username = req.body.username;
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.alias = req.body.alias;
		user.address = req.body.address;
		user.phone = req.body.phone;
		user.secondaryEmail = req.body.secondaryEmail;

		await user.save();
		return res.send(user);
		} 
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

//Change Password
router.put('/update/password/', auth.verifyToken, User.verify, async (req, res) =>
	{
	console.log("Updating Password for: " + req.user.username + "-" + req.body.oldPassword);
	try
		{
		const user = req.user;

		if (!await user.comparePassword(req.body.oldPassword))
			{
			//console.log(" - wrong password")
			return res.status(403).send({ message: "Username or Password is wrong"});
			}
		if(req.body.newPassword !== req.body.newPasswordRepeat)
			{
			//console.log(" - new passwords do not match")
			return res.status(403).send({ message: "New passwords do not match"});
			}

		user.password = req.body.newPassword;

		console.log("Password updated!");
		await user.save();
		return res.send(user)
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

//Update the profile pic
router.put('/update/picture',auth.verifyToken, User.verify, upload.single('photo'), async (req, res) =>
	{
	user = req.user;

	//If the picture has been set, clear it out
	if(user.profilePicture)                                                                                        
		{
		try
			{
			// Delete the file like normal
			await unlinkAsync("../public/" + user.profilePicture);
			}
		catch (error)
			{
			console.log(error);
			return res.sendStatus(500);
			}
		}

	// check that the file is uploaded
	if (!req.file)
		{
		user.profilePicture = '';
		}
	else
		{
		user.profilePicture = "/images/" + req.file.filename;
		}

	try
		{
		await user.save();
		return res.sendStatus(200);
		}
	catch (error) 
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

// Get a user's profile - will only return generic information
router.get('/userprofile/:id', auth.verifyToken, async (req, res) =>
	{
	// look up user account
	const user = await User.findOne({ _id: req.params.id });
	if (!user)
		{
		return res.status(403).send({error: "User ID is invalid"});
		}

	let username ='';

	if(user.alias)
		{
		username = user.alias;
		}
	else
		{
		username = user.firstName;
		}

	//Set up the response
	let responce = {username: username, profilePicture: user.profilePicture};

	return res.send(responce);
	});

// Get user profiles
router.get('/allusers', auth.verifyToken, async (req, res) =>
	{
	// look up user account
	const users = await User.find();

	let response = [];
	users.forEach(async function(user)
		{
		response.push({username: user.username,first: user.firstName, last: user.lastName,alias: user.alias, profilePicture: user.profilePicture, permissions: user.permissions, enabled: user.enabled});
		});

	return res.send(response);
	});


// Get current user if logged in.
router.get('/', auth.verifyToken, async (req, res) =>
	{
	// look up user account
	const user = await User.findOne({_id: req.user_id});
	if (!user)
		{
		return res.status(403).send({error: "must login"});
		}

	//console.log("Looking for a cookie for : " + user.username);
	return res.send(user);
	});

// Logout
router.delete("/", auth.verifyToken, async (req, res) =>
	{
	// look up user account
	const user = await User.findOne({ _id: req.user_id});
	if (!user)
		{
		return res.clearCookie('token').status(403).send({ error: "must login"});
		}
	user.removeToken(req.token);
	await user.save();
	res.clearCookie('token');
	res.sendStatus(200);
	});

//Disable/Enable user
router.delete("/:removalusername", auth.verifyToken, User.verify, async (req, res) =>
	{
	//console.log("Totally disabling a user man!");
	//Verify that we have an admin account
	if(req.isAdmin === false)
		{
		//console.log("You can't do that man!");
		return res.status(403).send({error: "You require Administrator privlages to make the requested request!"});
		}

	try
		{
		//console.log("Disabling: " + req.params.removalusername );
		const user = await User.findOne({ username : req.params.removalusername });

		if(user.username == 'admin')
			{
			console.log("You can't disable the admin dude!");
			return res.sendStatus(500);
			}

		//console.log("Here's his status: " + user.enabled);

		user.enabled = !user.enabled;

		await user.save();
		console.log("It's done man: " + user.enabled);
		return res.sendStatus(200);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

//Login function
async function login(user, res) 
	{
	let token = auth.generateToken({id: user._id}, "24h");

	user.removeOldTokens();
	user.addToken(token);
	await user.save();

	return res.cookie("token", token, { expires: new Date(Date.now() + 86400 * 1000)}).status(200).send(user);
	}

module.exports = { model: User, routes: router, }
