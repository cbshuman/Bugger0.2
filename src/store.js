import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store(
	{
	state:
		{
		user: null,
		userProfiles:[],
		userNames:[],
		projects: [],
		projectNames: [],
		permissions: [],
		permissionNames: [],
		bugs : [],
		},
	mutations:
		{
		setUser(state, user)
			{
			state.user = user;
			},
		setUserProfiles(state,users)
			{
			state.userProfiles = users;
			},
		setUserNames(state,users)
			{
			state.userNames = users;
			},
		setProjects(state, projects)
			{
			state.projects = projects;
			},
		setProjectNames(state, projectNames)
			{
			state.projectNames = projectNames;
			},
		setPermissions(state, permissions)
			{
			state.permissions = permissions;
			},
		setPermissionNames(state, permissionNames)
			{
			state.permissionNames = permissionNames;
			},
		setBugs(state, bugs)
			{
			state.bugs = bugs;
			}
		},
	actions:
		{
		async LogIn(context, data)
			{
			try
				{
				let response = await axios.post("/api/users/login", data);
				context.commit('setUser', response.data);
				return "";
				}
			catch (error)
				{
				return "Error: " + error.response.data.message;
				}
			},
		async GetUser(context)
			{
			try
				{
				let response = await axios.get("/api/users");
				context.commit('setUser', response.data);
				return "";
				}
			catch (error)
				{
				return "";
				}
			},
		async GetUserProfile(context,data)
			{
			try
				{
				let response = await axios.get("/api/users/userprofile/" + data.id);
				return response.data;
				}
			catch (error)
				{
				return "";
				}
			},
		async GetUserProfiles(context)
			{
			//console.log("Getting user profiles");
			try
				{
				let response = await axios.get("/api/users/allusers/");
				context.commit('setUserProfiles', response.data);
				return response.data;
				}
			catch (error)
				{
				return "";
				}
			},
		async GetUserNames(context,users)
			{
			let returnValue = [];
			if(users)
				{
				for(let i = 0; i < users.length; i++)
					{
					returnValue.push(users[i].username)
					}
				}
			context.commit('setUserNames', returnValue);
			return"";
			},
		async DisableUserAccount(context,data)
			{
			try
				{
				let response = await axios.delete("/api/users/" + data.id);
				return response.data;
				}
			catch (error)
				{
				return "";
				}
			},
		async CreateNewUser(context, data)
			{
			try
				{
				let response = await axios.post("/api/users/", data);
				return "";
				}
			catch (error)
				{
				return "";
				}
			},
		async CreateRemoveUser(context, data)
			{
			try
				{
				let response = await axios.post("/api/users/", data);
				context.commit('setUser', response.data);
				return "";
				}
			catch (error)
				{
				return "";
				}
			},
		async UpdateUser(context,data)
			{
			try
				{
				let response = await axios.put("/api/users/update/", data);
				return "";
				}
			catch(error)
				{
				console.log(error);
				return error;
				}
			},
		async UpdateUserPhoto(context,data)
			{
			try
				{
				let response = await axios.put("/api/users/update/picture", data);
				return "";
				}
			catch(error)
				{
				console.log(error);
				return error;
				}
			},
		async ChangePassword(context,data)
			{
			try
				{
				let response = await axios.put("/api/users/update/password/", data);
				return "";
				}
			catch(error)
				{
				console.log(error);
				return error;
				}
			},
		async UpdateUserPermissions(context,data)
			{
			try
				{
				let response = await axios.put("/api/users/update/security/",data);

				if(data.addPermission)
					{
					return "Successfully Added Permission!";
					}
				else
					{
					return "Successfully Removed Permission!";
					}
				}
			catch (error)
				{
				return (this.error = error);
				}
			},
		async LogOut(context)
			{
			try
				{
				let response = await axios.delete("/api/users");
				}
			catch (error)
				{
				// don't worry about it
				}
			},
		async GetPermissions(context)
			{
			//console.log("Getting Permisssions. . .");
			try
				{
				let response = await axios.get("/api/permissions/");
				context.commit('setPermissions',response.data);
				return true;
				}
			catch (error)
				{
				console.log(error);
				}
			},
		GetPermissionNames(context, permissions)
			{
			let returnValue = [];
			if(permissions)
				{
				for(let i = 0; i < permissions.length; i++)
					{
					returnValue.push(permissions[i].permissionName)
					}
				}
			context.commit('setPermissionNames', returnValue);
			return"";
			},
		async CreatePermission(context, data)
			{
			//console.log("Creating Permisssions. . .");
			try
				{
				let response = await axios.post("/api/permissions/", data);
				return true;
				}
			catch (error)
				{
				console.log(error);
				}
			},
		async GetBugs(context)
			{
			try
				{
				let response = await axios.get("/api/bugs");
				context.commit('setBugs',response.data);
				return true;
				}
			catch (error)
				{
				console.log(error);
				}
			},
		async GetUserBugs(context)
			{
			try
				{
				let response = await axios.get("/api/bugs/user/");
				context.commit('setBugs',response.data);
				return true;
				}
			catch (error)
				{
				console.log(error);
				}
			},
		async CommentOnBug(context,data)
			{
			try
				{
				let response = await axios.put("/api/bugs/comment/" + data.id ,data);
				return response.data;
				}
			catch (error)
				{
				console.log(error);
				return "Error: " + error.response.data.message;
				}
			},
		async UpdateBug(context,data)
			{
			try
				{
				let response = await axios.put("/api/bugs/" + data.id ,data);
				return "Bug successfully updated!";
				}
			catch (error)
				{
				console.log(error);
				return "Error: " + error.response.data.message;
				}
			},
		async GetBug(context,bugID)
			{
			try
				{
				let response = await axios.get("/api/bugs/" + bugID ,{ id: bugID, });
				return response.data;
				}
			catch (error)
				{
				console.log(error);
				return "Error: " + error.response.data.message;
				}
			},
		async CreateBug(context,data)
			{
			try
				{
				let response = await axios.post("/api/bugs",data);
				return response.data;
				}
			catch (error)
				{
				console.log(error);
				return "Error: " + error.response.data.message;
				}
			},
		async GetProjects(context)
			{
			//console.log("Getting Projects. . .");
			try
				{
				let response = await axios.get("/api/projects");
				let projectData = response.data;

				for(let i = 0; i < projectData.length; i++)
					{
					let element = projectData[i];
					let bugs = await axios.get("/api/bugs/project/" + element.projectName);
					element.bugs = bugs.data;
					projectData[i] = element;
					}

				context.commit('setProjects',projectData);
				return true;
				}
			catch (error)
				{
				console.log(error);
				}
			},
		GetProjectNames(context,projects)
			{
			let returnValue = [];
			if(projects)
				{
				for(let i = 0; i < projects.length; i++)
					{
					returnValue.push(projects[i].projectName)
					}
				}
			context.commit('setProjectNames', returnValue);
			return(returnValue);
			},
		async CreateProject(context,data)
			{
			try
				{
				let response = await axios.post("/api/projects",data);
				return response.data;
				}
			catch (error)
				{
				console.log(error);
				return "Error: " + error.response.data.message;
				}
			},
		}
	})
