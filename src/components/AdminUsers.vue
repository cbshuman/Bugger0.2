<template>
	<div class="content">
		<h3>User Administration</h3>
		<hr>
		<div class = "layout">
			<form @submit.prevent="CreateNewUser()">
				<h4>Add new User</h4>
				<hr>
				<div class = "layoutInterior">
					<p>Email/Username:</p>
					<input placeholder="Email Address"  v-model="newUsername">
					<p>Password:</p>
					<input placeholder="Password" v-model="newPassword">
					<p>First Name:</p>
					<input placeholder="Real first name" v-model="newFirst">
					<p>Last Name:</p>
					<input placeholder="Real last name" v-model="newLast">

				<p><button type="submit">Add User </button></p>
				</div>
			</form>

			<form>
				<h4>Remove User</h4>
				<hr>
				<div class = "layoutInterior">
					<p>Email/Username:</p>
					<input placeholder="Email Address" v-model="deleteUsername">
					<p><button type="submit"> Remove User </button></p>
				</div>
			</form>

			<form @submit.prevent="AddPermission">
				<h4>User Permissions:</h4>
				<hr>
				<div class = "layoutInterior">
					<p>Email/Username:</p> 
					<input placeholder="Email Address" v-model="permissionUsername">
					<p>Security Group:</p>
					<input placeholder="Security Group" v-model="securityGroup">
				</div>
				<div v-if="error"> {{error}} </div>
				<button @click="AddRemoveSecurity(true)"> Add Security Group </button> | <button @click="AddRemoveSecurity(false)"> Remove Security Group </button>
			</form>
		</div>
	</div>
</template>

<script>
import Users from '@/components/AdminUsers.vue'
import Security from '@/components/AdminSecurity.vue'

export default
	{
	name: 'admin',
	data()
		{
		return {
			showPermissions: false,
			showProjects: false,
			user: '',
			newUsername: '',
			newPassword: '',
			newFirst: '',
			newLast: '',
			newMessage: '',
			deleteUsername: '',
			permissionUsername:'',
			securityGroup: '',
			securityRemoveAdd: true,
			error: '',
			}
		},
	components:
		{
		Users,
		Security,
		},
	async created()
		{
		},
	computed:
		{
		},
	methods:
		{
		async AddPermission()
			{
			this.error = await this.$store.dispatch("UpdateUserPermissions", { username: this.permissionUsername, permission: this.securityGroup, addPermission: this.securityRemoveAdd,});
			this.permissionUsername = '';
			this.securityGroup = '';
			},
		AddRemoveSecurity(value)
			{
			this.securityRemoveAdd = value;
			},
		async CreateNewUser()
			{
			this.error = await this.$store.dispatch("CreateNewUser",
				{
				username: this.newUsername,
				firstName: this.newPassword,
				lastName: this.newFirst,
				password: this.newLast,
				});
			}
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

</style scoped>
