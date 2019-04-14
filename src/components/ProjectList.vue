<template>
	<div>
		<h4  v-if="!showProjects"> Projects: [ <a @click="ToggleProjects">Show</a>	] </h4>
		<h4  v-else> Projects: [ <a @click="ToggleProjects">Hide</a>	] </h4>
		<table>
			<tr>
				<th width="20%">Project Name</th>
				<th>Bug Count</th>
				<th>Discription</th>
				<th>Security Groups</th>
			</tr>
			<tr v-for="project in projects" v-if="showProjects">
				<td>{{project.projectName}} </td>
				<td>{{project.bugs.length}}</td>
				<td>{{project.projectDisc}} </td>
			</tr>
		</table>
	</div>
</template>

<script>
export default
	{
	name: 'securityList',
	props:
		{
		projects: Array,
		showProjects: Boolean,
		},
	methods:
		{
		ToggleProjects()
			{
			this.showProjects = !this.showProjects;
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
	padding:.5em;
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
