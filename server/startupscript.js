const users = require("./users.js");
const permissions = require("./permissions.js");

const User = users.model;
const Perm = permissions.model;

async function Statup ()
	{
	console.log("-- = Starting Server = --");
	
	let user = await User.findOne({username: 'admin'});
	let admin_p = await Perm.findOne({permissionName: 'admin'});	

	if(!user)
		{
		console.log("Creating Admin Account");
		// create new user
		user = new User(
			{
			username: 'admin',
			firstName: 'Sudo',
			lastName: 'Su',
			password: 'admin',
			alias: '',
			address: 'BUGGER',
			phone: '',
			secondaryEmail: '',
			profilePicture: '',
			enabled : true,
			permissions: [],
			tokens: [],
			});
		}

	if(!admin_p)
		{
		console.log("Creating Admin Security Group");
		admin_p = new Perm({permissionName: 'admin', permissionDisc: 'Special group used to administer the server. Has access to all bugs, projects, and can create and disable users.',});
		admin_p.save();
		}

	if(!user.permissions.includes('admin'))
		{
		console.log("Adding admin permission to admin account");
		user.permissions.push('admin');
		}

	//Make sure that this is true, it shouldn't ever not be true, but say lave
	user.enabled = true;
	user.save();
	console.log("-- = Server Started = --");
	}

module.exports = { Statup: Statup,}
