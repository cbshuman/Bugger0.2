<template>
	<div class="modal-mask">
		<div class ="modal-wrapper">
			<div class="modal-container">
			<h3>Create a New Project</h3>
			<hr>
			<form @submit.prevent="CreateProject">

				<div class = "layoutInterior">
				<p>Project Name:</p>
				<input v-model="projectName" placeholder="Enter the name of the new project">
				<p>Default Bug Contact:</p>
				<input v-model="defaultContact" placeholder="Enter the name of the default bug contact">
				<p>Project Discription:</p>
				<textarea name="message" placeholder="Describe the project using as many details as possible" v-model="projDiscrip"></textarea>
				<p>Security Groups:</p>
					<div class="securityLayout">
						<center>Avalible</center>
						<center>Selected</center>
						<div class="securityGroups">
							<div class="securityItem" v-for="permission in permissionsAvaliable" @click="MoveSecurityGroup(permissionsSelected,permissionsAvaliable,permission)">
							{{permission.permissionName}}
							</div>
						</div>
						<div overflow-y: scroll class="securityGroups">
							<div class="securityItem" v-for="permission in permissionsSelected" @click="MoveSecurityGroup(permissionsAvaliable,permissionsSelected,permission)">
							{{permission.permissionName}}
							</div>
						</div>					
					</div>
				</div>

				<button  type="submit">Create Project</button>
				<button @click="ToggleForm">Cancel</button>
			</form>

			* All fields (except security groups) are required.
			<br>** Once created, a project can only be modified by an admin.
			</div>
		</div>
	</div>
</template>

<script>
export default
	{
	name: 'bugForm',
	data()
		{
		return{
			projectName: '',
			defaultContact: '',
			projDiscrip: '',
			permissionsAvaliable: [],
			permissionsSelected: [],
			}
		},
	async created()
		{
		await this.$store.dispatch("GetProjects",);
		await await this.$store.dispatch("GetPermissions",);
		this.permissionsAvaliable = this.permissions;
		this.project = this.projects[0];
		},
	computed:
		{
		projects() { return this.$store.state.projects; },
		permissions() { return this.$store.state.permissions; },
		},
	props:
		{
		ToggleForm: Function,
		},
	methods:
		{
		async CreateProject()
			{
			let finalPermissions = [];
			for(let i = 0; i < this.permissionsSelected.length; i++)
				{
				finalPermissions.push(this.permissionsSelected[i].permissionName);
				}
			await this.$store.dispatch("CreateProject",{ projectName: this.projectName,	projectDisc: this.projDiscrip, defaultAssignee: this.defaultContact, permissions: finalPermissions,});
			await this.$store.dispatch("GetProjects",);
			this.ToggleForm();
			},
		MoveSecurityGroup(to,from,item)
			{
			to.push(item);
			var index = from.indexOf(item);
			if (index > -1)
				{
				from.splice(index, 1);
				}
			},
		}
	}
</script>

<style scoped>
input
	{
	margin:2px;
	}

button
	{
	margin:4px;
	}

p
	{
	text-align: right;
	margin:2px;
	}

select
	{
	margin:2px;
	}

textarea
	{
	margin:2px;
	height:5em;
	padding:4px;
	border-radius:8px;
	border: 3px solid #5E807F;
	box-sizing: border-box;
	}

textarea:focus
	{
	border: 3px solid #17B890;
	}

.modal-container
	{
	min-width: 20em;
	max-width: 50%;
	margin: 0px auto;
	padding: 1em;
	background-color: #DEE5E5;
	border: 5px solid #082D0F;
	border-radius:5px;
	transition: all .3s ease;
	}

.modal-mask
	{
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .5);
	display: table;
	transition: opacity .3s ease;
	}

.modal-wrapper
	{
	display: table-cell;
	vertical-align: middle;
	}

.securityGroups
	{
	margin:5px;
	height:5em;
	overflow: hidden;
 	overflow-y: scroll;
	background-color: white;
	border: 3px solid #5E807F;
	}

.securityItem:hover
	{
	background-color: #17B890;
	border: 3px solid #17B890;
	}

.securityLayout
	{
  	display: grid;
	grid-template-columns: 50% 50%;
	}

.version input
	{
	width:3em !important;
	padding:.25em;
	margin: .25em;
	}
</style scoped>
