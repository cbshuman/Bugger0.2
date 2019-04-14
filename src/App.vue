<template>
	<div id="app">
		<div class = "header">
			<h1>Bugger Ver 0.2</h1>
			<h2>- Bugtracking Program - </h2>
		
		<p class ="loggedUser" v-if="user">Logged in as: <b>{{user.username}}</b></p>
		</div>

		<div class = "navigationbar" v-if="user">
			<router-link to="/">Home</router-link>
			<router-link to="/projects">Projects</router-link>
			<router-link to="/bugList">Bug List</router-link>
			<router-link to="/userPrefs">Profile</router-link>
			<router-link to="/admin">Admin</router-link>
			<router-link to="/about">About</router-link>
			<a  @click="LogOut()" href="/">Logout</a>
		</div>

		<div v-if="!user">
			<login />
		</div>

		<router-view  v-else />

	</div>
</template>

<script>
import Login from '@/components/Login.vue'

export default
	{
	name: 'app',
	components:
		{
		Login,
		},
	async created()
		{
		await this.$store.dispatch("GetUser",);
		},
	computed:
		{
		user() { return this.$store.state.user; },
		},
	methods:
		{
		async LogOut()
			{
			await this.$store.dispatch("LogOut",);
			},
		},
	}
</script>

<style>
a
	{
	font-weight: bold;
	color: #444;
	}

body
	{
  	background-color: #5E807F !important;
  	color: #082D0F !important;
  	margin: 0;
	}

h1
	{
	text-align: center;
	font-size:2em;
	margin-bottom:0px;
	}

h2
	{
	text-align: center;
	font-size:1.25em;
	margin-bottom:0px;
	}

h3
	{
	font-size:1.65em;
	margin:0px;
	}

h4
	{
	margin-bottom:0px;
	}

.content
	{
	margin:1em;
	padding:.5em;
	border: 5px solid #082D0F;
	border-radius:5px;
	background-color: #DEE5E5 !important;
	}

.layout
	{
  	display: grid;
	grid-template-columns: auto auto;
	}

.layoutInterior
	{
  	display: grid;
	grid-template-columns: 25% 50%;
	}

.header
	{
  	background-color: #DEE5E5;
	border-bottom: 3px solid #082D0F;
	padding:.25em;
	margin:0px;
	}

.login
	{
	padding:.35em;
	margin-top:2em;
	margin-left: auto;
	margin-right: auto;
  	text-align: center;
	display: block;
	width:25%;
  	background-color: #DEE5E5;
	border: 5px solid #082D0F;
	border-radius:5px;
	}

.loggedUser
	{
	margin-bottom:2px;
	}

.navigationbar
	{
	margin:0px;
	margin-bottom:1em;
	width: 100%;
  	background-color: #9DC5BB;
	border-bottom: 3px solid #082D0F;
	font-size:1.15em;
	}

.navigationbar a
	{
	margin:.25em;
	padding:.25em;
	}

.navigationbar a:hover
	{
	font-size:1.25em;
  	background-color: #DEE5E5;
  	background-color: #DEE5E5;
	border-bottom: 3px solid #082D0F;
	border-right: 3px solid #082D0F;
	border-left: 3px solid #082D0F;
	border-radius:5px;
	}

.navigationbar a.router-link-exact-active
	{
	color: #082D0F;
	font-size:1.25em;
  	background-color: #DEE5E5;
	border-bottom: 3px solid #082D0F;
	border-right: 3px solid #082D0F;
	border-left: 3px solid #082D0F;
	border-radius:5px;
	}

#app
	{
	margin:0px;
	padding:0px;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	}

</style>
