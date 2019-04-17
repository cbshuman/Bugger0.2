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
				<div>
					<input placeholder="Enter the name of the default bug contact" v-model="defaultContact">
					<autoComplete :collection="userNames" :targetValue="defaultContact" @SetValue="GetDefaultContact" />
				</div>
				<p>Project Discription:</p>
				<textarea name="message" placeholder="Describe the project using as many details as possible" v-model="projDiscrip"></textarea>
				<p>Security Groups:</p>
					<div class="securityLayout">
						<center>Avalible</center>
						<center>Selected</center>
						<div class="securityGroups">
							<div class="securityItem" v-for="permission in permissionsAvaliable" @click="MoveSecurityGroup(permissionsSelected,permissionsAvaliable,permission)">
							{{permission}}
							</div>
						</div>
						<div overflow-y: scroll class="securityGroups">
							<div class="securityItem" v-for="permission in permissionsSelected" @click="MoveSecurityGroup(permissionsAvaliable,permissionsSelected,permission)">
							{{permission}}
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
import AutoComplete from '@/components/AutoCompleteForm.vue'

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
	components:
		{
		AutoComplete,
		},
	async created()
		{
		await this.$store.dispatch("GetProjects",);

		//Permissions
		await this.$store.dispatch("GetPermissions",);
		await this.$store.dispatch("GetPermissionNames",this.permissions);

		//User info
		await this.$store.dispatch("GetUserProfiles",);
		await this.$store.dispatch("GetUserNames",this.userProfiles);

		console.log(this.permissionNames);

		this.permissionsAvaliable = this.permissionNames;
		this.project = this.projects[0];
		},
	computed:
		{
		projects() { return this.$store.state.projects; },

		//Permissions
		permissions() { return this.$store.state.permissions; },
		permissionNames() { return this.$store.state.permissionNames; },

		//User info for auto complete
		userProfiles() { return this.$store.state.userProfiles; },
		userNames() { return this.$store.state.userNames; },
		},
	props:
		{
		ToggleForm: Function,
		},
	methods:
		{
		async CreateProject()
			{
			await this.$store.dispatch("CreateProject",{ projectName: this.projectName,	projectDisc: this.projDiscrip, defaultAssignee: this.defaultContact, permissions: this.permissionsSelected,});
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
			to = to.sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase())});
			from = from.sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase())});;
			},
		GetDefaultContact(input)
			{
			this.defaultContact = input;
			},
		}
	}
</script>

<style scoped>
input
	{
	margin:2px;
	width:100%;
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
	color: white;
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
