const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

//user authentication
const auth = require("./auth.js");
const users = require("./users.js");
const User = users.model;

//Models
const models = require("./models.js");
const Bug = models.modelBug;
const Project = models.modelProject;

router.get('/', auth.verifyToken, User.verify, async (req, res) =>
	{
	try
		{
		let projects = await Project.find();

		let returnList = [];

		projects.forEach(async function(project)
			{
			//console.log(req.user.comparePermissions(project.permissions));
			if(req.user.comparePermissions(project.permissions))
				{
				//console.log("Added project because permissions are allowed")
				returnList.push(project);
				}
			});

		return res.send(returnList);
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

router.delete('/:projectName', auth.verifyToken, User.verify, async (req, res) =>
	{
	//console.log("Deleting Project . . .");
	if(!req.isAdmin)
		{
		return res.status(403).send({error: "You require Administrator privlages to make the requested request!"});
		}

	try
		{
		//See if we have even just one bug that has this as it's parent project
		let bug = await Bug.findOne({project : req.params.projectName});

		//console.log(bug);
		if(bug)
			{
			return res.sendStatus(500);
			}
		//console.log("Deleting: " + req.params.projectName );
		await Project.deleteOne({ projectName : req.params.projectName });
		return res.sendStatus(200);
		}
	catch (error)
		{
		console.log(error);
		return res.sendStatus(500);
		}
	});

module.exports = { model: Project, routes: router, }
