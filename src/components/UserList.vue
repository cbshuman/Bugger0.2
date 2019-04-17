<template>
	<div>
		<h4  v-if="!show"> Users: [ <a @click="ToggleView">Show</a>	] </h4>
		<h4  v-else> Users: [ <a @click="ToggleView">Hide</a>	] </h4>
		<table>
			<tr>
				<th>Profile</th>
				<th width="20%">Username</th>
				<th>First</th>
				<th>Last</th>
				<th>Alias</th>
				<th>Permissions</th>
				<th>Enabled</th>
			</tr>
			<tr v-for="user in users" v-if="show">
				<td width="3em">
					<div class="imageWrapper" v-if="user.profilePicture">
						<img :src="user.profilePicture">
					</div>
					<div v-else class ="imageWrapper">
						<img src="/Profile_icon_Defualt.png">
					</div>
				</td>
				<td>{{user.username}}</td>
				<td>{{user.first}}</td>
				<td>{{user.last}}</td>
				<td v-if="user.alias">{{user.alias}}</td>
				<td v-else><i>No Alias</i></td>
				<td><div v-for="permission in user.permissions">{{permission}}</div></td>
				<td>{{user.enabled}}</td>
			</tr>
		</table>
	</div>
</template>

<script>
export default
	{
	name: 'userList',
	data()
		{
		return { show: null,}
		},
	created()
		{
		this.show = this.showView;
		},
	props:
		{
		users: Array,
		showView: Boolean,
		},
	methods:
		{
		ToggleView()
			{
			this.show = !this.show;
			},
		},
	}
</script>

<style scoped>
img
	{
	height:3em;
	}

table
	{
	width:100%;
	}

th
	{
	color:#DEE5E5;
	height:2em;
	font-size:1.5em;
	background-color: #5E807F;
	}

td
	{
	padding:.25em;
	}

tr:hover
	{
	background-color: #17B890;
	}

tr a
	{
	font-size:1em;
	color:#082D0F;
	}

tr a:hover
	{
	font-size:1em;
	color:#DEE5E5;
	}

.imageWrapper
	{
	height:2.5em;
	width:2.5em;
	background-color: #5E807F !important;
	border: 3px solid #082D0F;
	border-radius:500px;
	overflow: hidden;
	}
</style scoped>
