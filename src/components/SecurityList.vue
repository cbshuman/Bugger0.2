<template>
	<div>
		<h4  v-if="!showPermissions"> Security Groups: [ <a @click="TogglePermissions">Show</a>	] </h4>
		<h4  v-else> Security Groups: [ <a @click="TogglePermissions">Hide</a>	] </h4>
		<hr>
		<table>
			<tr>
				<th width="20%">Security Group</th>
				<th>Discription</th>
			</tr>
			<tr v-for="permission in permissions" v-if="showPermissions">
				<td>{{permission.permissionName}} </td>
				<td>{{permission.permissionDisc}} </td>
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
		permissions: Array,
		},
	data()
		{
		return { showPermissions: false, };
		},
	methods:
		{
		TogglePermissions()
			{
			//console.log(this.permissions);
			this.showPermissions = !this.showPermissions;
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
