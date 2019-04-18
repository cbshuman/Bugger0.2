const mongoose = require('mongoose');

//----------------------- Bug Schema --------------------------||
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

const Bug = mongoose.model('Bugs', bugSchema);

//----------------------- Project Schema --------------------------||
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
	//console.log("Setting the default contact . . . for: " + req.body.project);
	// look up the project
	const project = await Project.findOne({ projectName: req.body.project});

	//We have a problem if the project does not exist
	if(!project)
		{
		console.log("Project does not exist");
		return res.sendStatus(500);
		}
	//console.log(project.defaultAssignee);

	req.defaultcontact = project.defaultAssignee;
	next();
	}

const Project = mongoose.model('Project', projectSchema);

module.exports = { modelBug: Bug, modelProject: Project, }
