const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");

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
router.post('/', auth.verifyToken, async (req, res) =>
	{
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
			permissions: [],
			tokens: [],
			permissions: [],
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

//Update profile information
router.put('/update/:id', auth.verifyToken, async (req, res) =>
	{
	//console.log("Updating user: " + req.body.username + "/" + req.body.id);
	if (!req.body.username || !req.body.lastName || !req.body.firstName)
		{
		return res.status(400).send({message: "Username, real name(First and last), and password are required"});
		}

	try
		{
		//search for user
		let user = await User.findOne({ _id: req.body.id });
		
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
router.put('/update/security/:id', auth.verifyToken, async (req, res) =>
	{
	try
		{
		const user = await User.findOne({ _id: req.body.id });
		//console.log("Updating Password for: " + user.username + "-" + req.body.oldPassword);

		if(!user.permissions)
			{
			user.permissions = '';
			}

		if (req.body.addPermission)
			{
			user.permissions.push(req.body.permission);
			}
		else if(!req.body.addPermission)
			{
			for(let i = 0; i < user.permissions.length; i++)
				{
				if(user.permissions[i] == req.body.permission)
					{
					user.splice(i,i);
					return;
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

//Change Password
router.put('/update/password/:id', auth.verifyToken, async (req, res) =>
	{
	try
		{
		const user = await User.findOne({ _id: req.body.id });
		//console.log("Updating Password for: " + user.username + "-" + req.body.oldPassword);

		if (!await user.comparePassword(req.body.oldPassword))
			{
			//console.log(" - wrong password")
			return res.status(403).send({ message: "Username or Password is wrong"});
			}
		if(req.body.newPassword !== req.body.newPasswordRepeat)
			{
			//console.log(" - new passwords do not match")
			return res.status(403).send({ message: "Passwords do not match"});
			}

		user.password = req.body.newPassword;

		await user.save();
		return res.send(user)
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
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

//Delete user
router.delete("/:id/:password/:repeatPassword/:removalusername", auth.verifyToken, async (req, res) =>
	{
	//Check that the passwords match
	if(req.params.password != req.params.repeatPassword)
		{
		//console.log("passwd no matchy: A:" + req.params.password + "/ B:" +  req.params.repeatPassword);
		return res.status(403).send({error: "Your password does not match!"});
		}
	//console.log("AdminID: " +  req.params.id);

	const user = await User.findOne({_id:  req.params.id});

	if(!user)
		{
		console.log(" - Can't find admin user!")
		return res.status(403).send({ message: "Cannot find administrating user!"});
		}

	if (!await user.comparePassword(req.params.password))
		{
		//console.log(" - wrong password, is not: " + req.params.password)
		return res.status(403).send({ message: "Username or Password is wrong"});
		}
	try
		{
		//console.log("Deleting: " + req.params.removalusername );
		await User.deleteOne({ username : req.params.removalusername });
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
