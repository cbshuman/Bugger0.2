const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");
const users = require("./users.js");
const User = users.model;

const permissionSchema = new mongoose.Schema(
	{
	permissionName: String,
	permissionDisc: String,
	});

// create a virtual paramter that turns the default _id field into id
permissionSchema.virtual('id').get(function() { return this._id.toHexString(); });

// Ensure virtual fields are serialised when we turn this into a JSON object
permissionSchema.set('toJSON', { virtuals: true });

// middleware to validate user account
permissionSchema.statics.verify = async function(req, res, next)
	{
	let permission = await Permission.findOne({permissionName : req.body.permission});

	if (!permission)
		{
		req.hasPermission = false;
		}
	else
		{
		req.hasPermission = true;
		}

	next();
	}

const PermissionExists = async (group) =>
	{
	try
		{
		let permission = await Permission.find(group);
	
		if(!permission)
			{
			return(false);
			}
		else
			{
			return(true);
			}
		}
	catch
		{
		return(false);
		}
	}

const Permission = mongoose.model('Permission', permissionSchema);

router.get('/', async (req, res) =>
	{
	//console.log("Getting permissions . . .");
	try
		{
		let permissions = await Permission.find();
		return res.send(permissions);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

router.post('/', async (req, res) =>
	{
	//console.log("Creating a new permission . . .");
	const permission = new Permission({permissionName: req.body.permissionName, permissionDisc: req.body.permissionDisc,});
	try
		{
		await permission.save();
		return res.send(permission);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

//Delete user
router.delete("/:permissionName", auth.verifyToken, async (req, res) =>
	{
	try
		{
		//console.log("Deleting: " + req.params.removalusername );
		await Permission.deleteOne({ permissionName : req.params.permissionName });
		return res.sendStatus(200);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

module.exports = { model: Permission, routes: router}
