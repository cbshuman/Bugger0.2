const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

//User authentication
const auth = require("./auth.js");
const users = require("./users.js");
const User = users.model;

//Project data
const projects = require("./projects.js");
const Project = projects.model;

//Project Schema
const bugSchema = new mongoose.Schema(
	{
	bugNickname: String,
	emailReport: String,
	emailPrimary: String,
	emailSecondary: String,
	emailQA: String,
	dateCreated: String,
	dateModified: String,
	status: String,
	priority : String,
	project: String,
	ver1: String,
	ver2: String,
	ver3: String,
	ver4: String,
	fixVer1: String,
	fixVer2: String,
	fixVer3: String,
	fixVer4: String,
	bugDiscrip: String,
	comments: [],
	});

// create a virtual paramter that turns the default _id field into id
bugSchema.virtual('id').get(function() { return this._id.toHexString(); });

// Ensure virtual fields are serialised when we turn this into a JSON object
bugSchema.set('toJSON', { virtuals: true });

const Bug = mongoose.model('Bugs', bugSchema);

router.get('/', auth.verifyToken, User.verify, async (req, res) =>
	{
	try
		{
		let bugs = await Bug.find();
		let returnList = [];

		for(let i = 0; i < bugs.length; i++)
			{
			let project = await Project.findOne({ projectName: bugs[i].project});
			//console.log(req.user.comparePermissions(project.permissions));
			if(req.user.comparePermissions(project.permissions))
				{
				//console.log("Added bug because permissions are allowed")
				returnList.push(bugs[i]);
				}
			}
		//console.log(returnList);
		return res.send(returnList);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

router.get('/user', auth.verifyToken, User.verify, async (req, res) =>
	{
	//console.log("Email: " + req.user);
	try
		{
		let bugs = await Bug.find({ emailPrimary: req.user.username }).sort({ created: -1 });
		return res.send(bugs);
		res.sendStatus(200);
		}
	catch (error)
		{
		console.log(error);
		res.sendStatus(500);
		}
	});

router.get('/project/:projectName', auth.verifyToken, User.verify, async (req, res) =>
	{
	try
		{
		let bug = await Bug.find({ project : req.params.projectName, });
		return res.send(bug);
		res.sendStatus(200);
		}
	catch (error)
		{
		console.log(error);
		res.sendStatus(500);
		}
	});

router.get('/:id', auth.verifyToken, User.verify, async (req, res) =>
	{
	try
		{
		let bug = await Bug.findOne({ _id: req.params.id });
		return res.send(bug);
		res.sendStatus(200);
		}
	catch (error)
		{
		console.log(error);
		res.sendStatus(500);
		}
	});

//Update bug
router.put('/:id', auth.verifyToken, User.verify, async (req, res) =>
	{
	//console.log("Looking for bug #" + req.params.id);
	try
		{
		let bug = await Bug.findOne({ _id: req.params.id	});
		//console.log("Request Description: " + req.body.description + "/" + req.body.title);

		bug.bugNickname = req.body.bugNickname,
		bug.emailReport = req.body.emailReport,
		bug.emailPrimary = req.body.emailPrimary;
		bug.emailSecondary = req.body.emailSecondary;
		bug.emailQA = req.body.emailQA;
		bug.dateModified = new Date(Date.now()).toLocaleString();
		bug.status = req.body.status;
		bug.priority = req.body.priority;
		bug.project = req.body.project;
		bug.ver1 = req.body.ver1;
		bug.ver2 = req.body.ver2;
		bug.ver3 = req.body.ver3;
		bug.ver4 = req.body.ver4;
		bug.fixVer1 = req.body.fixVer1;
		bug.fixVer2 = req.body.fixVer2;
		bug.fixVer3 = req.body.fixVer3;
		bug.fixVer4 = req.body.fixVer4;
		bug.bugDiscrip = req.body.bugDiscrip;

		bug.save();
		res.sendStatus(200);
		}
	catch (error)
		{
		console.log(error);
		res.sendStatus(500);
		}
	});

router.put('/comment/:id', auth.verifyToken, User.verify, async (req, res) =>
	{
	//console.log("Looking for bug #" + req.params.id);
	try
		{
		let bug = await Bug.findOne({ _id: req.params.id });
		
		if(!req.body.comment)
			{
			res.sendStatus(500);
			}

		let comment =  { comment: req.body.comment, userID: req.user._id, date: new Date(Date.now()).toLocaleString() };
		bug.comments.push(comment);
		bug.save();
		res.sendStatus(200);
		}
	catch (error)
		{
		console.log(error);
		res.sendStatus(500);
		}
	});

//Create new bug
router.post('/', auth.verifyToken, User.verify, Project.defaultContact, async (req, res) =>
	{
	const bug = new Bug(
		{
		bugNickname: req.body.bugNickname,
		emailReport: req.body.emailReport,
		emailPrimary: req.defaultcontact,
		emailSecondary: '',
		emailQA: '',
		dateCreated: new Date(Date.now()).toLocaleString(),
		dateModified: new Date(Date.now()).toLocaleString(),
		status: "New",
		priority: req.body.priority,
		project: req.body.project,
		ver1: req.body.ver1,
		ver2: req.body.ver2,
		ver3: req.body.ver3,
		ver4: req.body.ver4,
		fixVer1: req.body.ver1,
		fixVer2: req.body.ver2,
		fixVer3: req.body.ver3,
		fixVer4: req.body.ver4,
		bugDiscrip: req.body.bugDiscrip,
		});
	try
		{
		await bug.save();
		return res.send(bug);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

module.exports = router;
