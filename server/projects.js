const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

//user authentication
const auth = require("./auth.js");
const users = require("./users.js");
const User = users.model;

//Project Schema
const projectSchema = new mongoose.Schema(
	{
	projectName: String,
	projectDisc: String,
	defaultAssignee : String,
	permissions: [],
	});

// create a virtual paramter that turns the default _id field into id
projectSchema.virtual('id').get(function() { return this._id.toHexString(); });

// Ensure virtual fields are serialised when we turn this into a JSON object
projectSchema.set('toJSON', { virtuals: true });

// middleware to find the default contact
projectSchema.statics.defaultContact = async function(req, res, next)
	{
	console.log("Setting the default contact . . . for: " + req.body.project);
	// look up user account
	const project = await Project.findOne({ projectName: req.body.project});
	console.log(project.defaultAssignee);

	req.defaultcontact = project.defaultAssignee;
	next();
	}


const Project = mongoose.model('Project', projectSchema);

router.get('/', auth.verifyToken, User.verify, async (req, res) =>
	{
	try
		{
		let projects = await Project.find();
		return res.send(projects);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

router.post('/', auth.verifyToken, User.verify, async (req, res) =>
	{
	let exists = await Project.findOne({projectName: req.params.projectName})
	if(exists)
		{
		console.log("Project already exists");
		console.log(exists);
		return res.sendStatus(500);
		}

	const project = new Project(
		{
		projectName: req.body.projectName,
		projectDisc: req.body.projectDisc,
		defaultAssignee: req.body.defaultAssignee,
		permissions: req.body.permissions,
		});

	//console.log("Project: " + project.projectName + "/" + project.projectDisc + "/" + req.body.projectDisc);
	try
		{
		await project.save();
		return res.send(project);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

module.exports = { model: Project, routes: router, }
