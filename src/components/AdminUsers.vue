<template>
	<div class="content">
		<h3>User Administration</h3>
		<hr>
		<div class = "layout">
			<form>
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
					<p>Admin Password:</p>
					<input placeholder="Admin Password" v-model="deletePassword">
					<p>Confirm Admin Password:</p>
					<input placeholder="Admin Password" v-model="deletePasswordrept">
					<p><button type="submit"> Remove User </button></p>
				</div>
			</form>

			<form>
				<h4>User Permissions:</h4>
				<hr>
				<div class = "layoutInterior">
					<p>Email/Username:</p> 
					<input placeholder="Email Address">
					<p>Security Group:</p>
					<input placeholder="Security Group">
				</div>
				<button> Add Security Group </button> | <button> Remove Security Group </button>
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
			deletePassword: '',
			deletePasswordrept: '',
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
