import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store(
	{
	state:
		{
		user: null,
		projects: [],
		permissions: [],
		bugs : [],
		},
	mutations:
		{
		setUser(state, user)
			{
			state.user = user;
			},
		setProjects(state, projects)
			{
			state.projects = projects;
			},
		setPermissions(state, permissions)
			{
			state.permissions = permissions;
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
		async UpdateUserPermissions(context,data)
			{
			try
				{
				let response = await axios.put("/api/users/update/security/",data);
				return "";
				}
			catch (error)
				{
				return "";
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
		}
	})
