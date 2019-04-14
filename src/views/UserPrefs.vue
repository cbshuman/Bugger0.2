<template>
	<div class="content">
		<h3>User Preferances</h3>
		<hr>
		<img src="/Profile_icon_Defualt.png">
		<form @submit.prevent="UpdateUser()">
			<div class = "layout">
				<div class ="interalForm">
					<h4>Naming:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Email/Username:</p>
						<input placeholder="Email Address" v-model="user.username">
						<p>First Name:</p>
						<input placeholder="Real first name" v-model="user.firstName">
						<p>Last Name:</p>
						<input placeholder="Real last name" v-model="user.lastName">
						<p>Alias:</p>
						<input placeholder="Name to appear in comments" v-model="user.alias">
					</div>
				</div>

				<div class ="interalForm">
					<h4>Contact Info:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Address:</p>
						<input placeholder="Address" v-model="user.address">
						<p>Phone Number:</p>
						<input placeholder="Phone Number" v-model="user.phone">
						<p>Secondary Email:</p>
						<input placeholder="Secondary email" v-model="user.secondaryEmail">
					</div>
				</div>
			</div>
		<button>Save Changes</button>
		</form>

		<div class = "layout">
			<div class ="interalForm">
				<h4>User Data:</h4>
				<hr>
				<div class = "layoutInterior">
					<p>UserID:</p>
					<i>{{user._id}}</i>
					<p>Permissions:</p>
					<div>
						<i v-for="permission in user.permissions">{{permission}}, <br></i>
					</div>
				</div>
			</div>
	
			<div class ="interalForm">
				<h4>Change Password:</h4>
				<hr>
				<form @submit.prevent="UpdatePassword()" class = "layoutInterior">
					<p>Current Password:</p>
					<input placeholder="Current Password" type="password" v-model="oldPassword">
					<p>New Password:</p>
					<input placeholder="New Password" type="password" v-model="newPassword">
					<p>Confirm New Password:</p>
					<input placeholder="New Password" type="password" v-model="newPasswordRepeat">
					<p>Confirm Change Password:</p>
					<button type="submit">Change Password</button> <p v-if="errorB" class="errorB">{{errorB}}</p>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
export default
	{
	name: 'UserPrefs',
	data()
		{
		return {oldPassword: "", newPassword: "", newPasswordRepeat: "", }
		},
	components:
		{
		},
	async created()
		{

		await this.$store.dispatch("GetUser",);
		},
	computed:
		{
		user() { return this.$store.state.user; },
		bugs() { return this.$store.state.bugs; },
		},
	methods:
		{
		UpdatePassword()
			{
			},
		UpdateUser()
			{
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

img
	{
	height:5em;
  	background-color: #5E807F !important;
	border: 3px solid #082D0F;
	border-radius:500px;
	}

p
	{
	text-align: right;
	margin:2px;
	}

.interalForm
	{
	padding: .25em;
	}

</style scoped>
