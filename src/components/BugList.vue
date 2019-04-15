<template>
	<div>
		<h4  v-if="!showBugs"> Bugs: [ <a @click="ToggleBugs">Show</a>	] </h4>
		<h4  v-else> Bugs: [ <a @click="ToggleBugs">Hide</a>	] </h4>
		<table>
			<tr>
				<th width="20%">Bug Id</th>
				<th>Bug Nickname</th>
				<th>Primary Contact</th>
				<th>Status</th>
				<th>Project</th>
				<th>Version</th>
				<th>Discription</th>
			</tr>
			<tr v-for="bug in bugs" v-if="show">
				<td><router-link v-bind:to="'/bug#' + bug._id">{{bug._id}}</router-link></td>
				<td>{{bug.bugNickname}}</td>
				<td>{{bug.emailPrimary}}</td>
				<td>{{bug.status}} </td>
				<td>{{bug.project}} </td>
				<td>{{bug.ver1}}.{{bug.ver2}}.{{bug.ver3}}.{{bug.ver4}} </td>
				<td>{{bug.bugDiscrip}}</td>
			</tr>
		</table>
	</div>
</template>

<script>
export default
	{
	name: 'bugList',
	data()
		{
		return { show: null,}
		},
	created()
		{
		this.show = this.showBugs;
		},
	props:
		{
		bugs: Array,
		showBugs: Boolean,
		},
	methods:
		{
		ToggleBugs()
			{
			this.show = !this.show;
			},
		},
	}
</script>

<style scoped>
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
</style scoped>
