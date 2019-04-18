<template>
	<div class = "login">
	<h2>Login:</h2>
	<hr>
	<form @submit.prevent="LogIn">
		<p>Username: <input v-model="username" placeholder="Enter your username/email"></p>
		<p>Password: <input v-model="password" type="password" placeholder="Enter your passoword"></p>
		<button  type="submit"> Login </button>
		<p v-if="error">{{error}}</p>
	</form>
	</div>
</template>


<script>
export default
	{
	name: 'Login',
	data()
		{
		return {
			name: '',
			username: '',
			password: '',
			error: '',
			}
		},
	methods:
		{
		async LogIn()
			{
			try
				{
				this.error = await this.$store.dispatch("LogIn", {username: this.username, password: this.password},);
				}
			catch (error)
				{
				console.log(error);
				}
			},
		}
	}
</script>
