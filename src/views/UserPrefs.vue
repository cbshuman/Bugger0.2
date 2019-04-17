<template>
	<div class="content">
		<h3>User Preferances for {{user.firstName}} {{user.lastName}}</h3>
		<hr>

		<form @submit.prevent="UpdateUser()">
			<div class = "layout">
				<div>
				<h4>Profile Picture: </h4>
					<hr>
					<div class="profilePicture">
						<center>
							<div v-if="user.profilePicture" class ="imageWrapper">
								<img :src="user.profilePicture">
							</div>
							<div v-else class ="imageWrapper">
								<img src="/Profile_icon_Defualt.png">
							</div>
							<br>
							<input type="file" name="photo" @change="fileChanged">
						</center>
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

				<div class ="interalForm">
					<h4>Naming:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Email/Username:</p>
						<input placeholder="Email Address" v-model="username">
						<p>First Name:</p>
						<input placeholder="Real first name" v-model="firstName">
						<p>Last Name:</p>
						<input placeholder="Real last name" v-model="lastName">
						<p>Alias:</p>
						<input placeholder="Name to appear in comments" v-model="user.alias">
					</div>
				</div>

			</div>
		<button>Save Changes</button>
		<div>{{ errorA }}</div>
		</form>

		<div class = "layout">
			<div class ="interalForm">
				<h4>User Data:</h4>
				<hr>
				<div class = "layoutInterior">
					<p>UserID:</p>
					<i>{{user._id}}</i>
					<p>Permissions:</p>
					<div class="internalForm">
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
					<button type="submit">Change Password</button>
					<p></p><div v-if="errorB" class="errorB">{{errorB}}</div>
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
		return {
			username: "",
			firstName: "",
			lastName: '',
			oldPassword: "",
			newPassword: "",
			newPasswordRepeat: "",
			file: null,
			errorA: "",
			errorB: "",
			}
		},
	components:
		{
		},
	async created()
		{
		await this.$store.dispatch("GetUser",);
		this.username = this.user.username;
		this.firstName = this.user.firstName;
		this.lastName = this.user.lastName;
		},
	computed:
		{
		user() { return this.$store.state.user; },
		bugs() { return this.$store.state.bugs; },
		},
	methods:
		{
		fileChanged(event)
			{
			this.file = event.target.files[0]
			},
		async UpdatePassword()
			{
			this.errorB = await this.$store.dispatch("ChangePassword",
				{
				_id: this.user._id,
				oldPassword: this.oldPassword,
				newPassword: this.newPassword,
				newPasswordRepeat: this.newPasswordRepeat,
				});
			this.oldPassword = '';
			this.newPassword = '';
			this.newPasswordRepeat = '';
			await this.$store.dispatch("GetUser",);
			},
		async UpdateUserProfilePic()
			{
			if(this.file)
				{
				const formData = new FormData();
				formData.append('photo', this.file, this.file.name);
				await this.$store.dispatch("UpdateUserPhoto",formData);
				}
			},
		async UpdateUser()
			{
			this.errorA = await this.$store.dispatch("UpdateUser",
				{
				_id: this.user._id,
				username: this.username,
				firstName: this.firstName,
				lastName: this.lastName,
				alias: this.user.alias,
				address: this.user.address,
				phone: this.user.phone,
				secondaryEmail: this.user.secondaryEmail,
				});
			await this.UpdateUserProfilePic();
			await this.$store.dispatch("GetUser",);
			},
		}
	}
</script>

<style scoped>
form
	{
	padding: .25em;
	}

button
	{
	margin:2px;
	}

img
	{
	height:6em;
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

.buttonUpload
	{
	width:100%;
	}

.imageWrapper
	{
	height:5em;
	width:5em;
	background-color: #5E807F !important;
	border: 3px solid #082D0F;
	border-radius:500px;
	overflow: hidden;
	}

.interalForm
	{
	padding: .25em;
	}

.profilePicture
	{
	width:5em;
	padding: .25em;
	}

</style scoped>
