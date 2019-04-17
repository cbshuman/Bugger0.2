<template>
		<div>
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
					<h4>Disable User</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Email/Username:</p>
						<div>
							<input placeholder="Email Address" v-model="deleteUsername">
							<autoComplete :collection="userNames" :targetValue="deleteUsername" @SetValue="GetdeleteUsername" />
						</div>
						<p><button type="submit"> Remove User </button></p>
					</div>
				</form>

				<form @submit.prevent="AddPermission">
					<h4>User Permissions:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Email/Username:</p>
						<div>
							<input placeholder="Email Address" v-model="permissionUsername">
							<autoComplete :collection="userNames" :targetValue="permissionUsername" @SetValue="GetPermissionUsername" />
						</div>
						<p>Security Group:</p>
						<div>
							<input v-model="securityGroup" placeholder="Search">
							<autoComplete :collection="permissionNames" :targetValue="securityGroup" @SetValue="GetSecurityGroup" />
						</div>
						<p></p>
						<div v-if="permissionReport"> {{permissionReport}} </div>
					</div>
					<button @click="AddRemoveSecurity(true)"> Add Security Group </button> | <button @click="AddRemoveSecurity(false)"> Remove Security Group </button>
				</form>
			</div>
		</div>
		<div class="content">
			<userList :users = "userProfiles" :showView = "false" />
		</div>
	</div>
</template>

<script>
import UserList from '@/components/UserList.vue'
import Security from '@/components/AdminSecurity.vue'
import AutoComplete from '@/components/AutoCompleteForm.vue'

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
			permissionReport: '',
			}
		},
	components:
		{
		UserList,
		Security,
		AutoComplete,
		},
	async created()
		{
		await this.$store.dispatch("GetUserProfiles",);
		await this.$store.dispatch("GetUserNames",this.userProfiles);
		await this.$store.dispatch("GetPermissions",);
		await this.$store.dispatch("GetPermissionNames",this.permissions);
		},
	computed:
		{
		userProfiles() { return this.$store.state.userProfiles; },
		permissions() { return this.$store.state.permissions; },
		userNames() { return this.$store.state.userNames; },
		permissionNames() { return this.$store.state.permissionNames; },
		},
	methods:
		{
		AddRemoveSecurity(value)
			{
			this.securityRemoveAdd = value;
			},
		async AddPermission()
			{
			this.permissionReport = await this.$store.dispatch("UpdateUserPermissions", { username: this.permissionUsername, permission: this.securityGroup, addPermission: this.securityRemoveAdd,});
			this.permissionUsername = '';
			this.securityGroup = '';
			await this.$store.dispatch("GetUserProfiles",);
			await this.$store.dispatch("GetUserNames",this.userProfiles);
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
			await this.$store.dispatch("GetUserProfiles",);
			await this.$store.dispatch("GetUserNames",this.userProfiles);
			},
		GetPermissionUsername(input)
			{
			this.permissionUsername = input;
			return(this.permissionUsername);
			},
		GetSecurityGroup(input)
			{
			this.securityGroup = input;
			return(this.securityGroup);
			},
		GetdeleteUsername(input)
			{
			this.deleteUsername = input;
			return(this.deleteUsername);
			},
		}
	}
</script>


<style scoped>
form
	{
	padding: .25em;
	}
p
	{
	text-align: right;
	margin:2px;
	}

</style scoped>
