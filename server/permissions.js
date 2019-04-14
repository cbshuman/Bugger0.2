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
		await User.deleteOne({ permissionName : req.params.permissionName });
		return res.sendStatus(200);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

module.exports = router;