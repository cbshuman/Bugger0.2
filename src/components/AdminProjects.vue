<template>
	<div>
		<div class="content">
			<h3>Project Administration </h3>
			<hr>
			<div class = "layout">
				<form @submit.prevent="AddSecurityProject">
					<h4>Project Permissions:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Project names:</p>
						<div>
							<input v-model="securityProject" placeholder="Select desired permission . . .">
							<autoComplete :collection="projectNames" :targetValue="securityProject" @SetValue="GetSecurityProject" />
						</div>
						<p>Security Group:</p>
						<div>
							<input v-model="newPermission" placeholder="Select desired permission . . .">
							<autoComplete :collection="permissionNames" :targetValue="newPermission" @SetValue="GetNewPermission" />
						</div>
					</div>
					<button> Add Security Group </button> | <button> Remove Security Group </button>
				</form>

				<form @submit.prevent="RemoveProject">
					<h4>Delete Project:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Target Project:</p> 
						<div>
							<input v-model="deleteProject" placeholder="Select project to delete">
							<autoComplete :collection="projectNames" :targetValue="deleteProject" @SetValue="GetRemoveProject" />
						</div>
					<p><button>Delete Project</button></p>
					</div>
				</form>

			</div>
		</div>
		<div class="content">
		<h3>Project List</h3>
		<hr>
		<projectList :projects ="projects" :showProjects = "false" />
		</div>
	</div>
</template>

<script>
import ProjectList from '@/components/ProjectList.vue'
import AutoComplete from '@/components/AutoCompleteForm.vue'

export default
	{
	name: 'securityAdmin',
	data()
		{
		return {
			securityProject: '',
			newPermission: '',
			deleteProject: '',
			}
		},
	computed:
		{
		projects() { return this.$store.state.projects; },
		permissions() { return this.$store.state.permissions; },
		projectNames() { return this.$store.state.projectNames;  },
		permissionNames() { return this.$store.state.permissionNames; },
		},
	components:
		{
		ProjectList,
		AutoComplete,
		},
	async created()
		{
		await this.$store.dispatch("GetProjects",);
		await this.$store.dispatch("GetPermissions",);
		await this.$store.dispatch("GetProjectNames",this.projects);
		await this.$store.dispatch("GetPermissionNames",this.permissions);
		},
	methods:
		{
		async RemoveProject()
			{
			},
		async AddSecurityProject()
			{
			},
		GetSecurityProject(valueIn)
			{
			this.securityProject = valueIn;
			return(this.securityProject);
			},
		GetNewPermission(valueIn)
			{
			this.newPermission = valueIn;
			return(this.newPermission);
			},
		GetRemoveProject(valueIn)
			{
			this.deleteProject = valueIn;
			return(this.deleteProject);
			},
		}
	}
</script>

<style scoped>
form
	{
	padding: .25em;
	}

input
	{
	margin:2px;
	}

p
	{
	text-align: right;
	margin:2px;
	}

</style>
