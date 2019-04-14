const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

//Project Schema
const projectSchema = new mongoose.Schema(
	{
	projectName: String,
	projectDisc: String,
	defaultAssignee : String,
	});

// create a virtual paramter that turns the default _id field into id
projectSchema.virtual('id').get(function() { return this._id.toHexString(); });

// Ensure virtual fields are serialised when we turn this into a JSON object
projectSchema.set('toJSON', { virtuals: true });

const Project = mongoose.model('Project', projectSchema);

router.get('/', async (req, res) =>
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

router.post('/', async (req, res) =>
	{
	if(Project.findOne({projectName:  req.params.projectName}))
		{
		return res.sendStatus(500);
		}

	const project = new Project({projectName: req.body.projectName, projectDisc: req.body.projectDisc,});
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

module.exports = router;
