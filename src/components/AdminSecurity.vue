<template>
	<div class="content">
		<h3>Security Groups</h3>
		<hr>
		<div class = "layout">
			<form @submit.prevent="CreatePermission">
				<h4>Create Security Group</h4>
				<hr>
				<div class = "layoutInterior">
					<p>New Group Name</p> 
					<input placeholder="Security Group Name" v-model="newPermission">
					<p>Discription:</p>
					<input placeholder="Disciption" v-model="newPermDisc">
				<p><button> Create Security Group </button></p>
				</div>
			</form>

			<form @submit.prevent="RemovePermission">
				<h4>Remove Security Group:</h4>
				<hr>
				<div class = "layoutInterior">
					<p>Target Group:</p> 
					<input placeholder="Target group">
				<p><button> Remove Security Group </button></p>
				</div>
			</form>
		</div>
		<securityList :permissions="permissions" />
	</div>
</template>

<script>
import SecurityList from '@/components/SecurityList.vue'

export default
	{
	name: 'securityAdmin',
	data()
		{
		return {
			newPermission: '',
			newPermDisc: '',
			}
		},
	components:
		{
		SecurityList,
		},
	async created()
		{
		await this.$store.dispatch("GetProjects",);
		await await this.$store.dispatch("GetPermissions",);
		},
	computed:
		{
		permissions() { return this.$store.state.permissions; },
		},
	methods:
		{
		async CreatePermission()
			{
			try
				{
				this.error = await this.$store.dispatch("CreatePermission", { permissionName: this.newPermission, permissionDisc: this.newPermDisc});
				this.newPermission = '';
				this.newPermDisc = '';
				await this.$store.dispatch("GetPermissions",);
				}
			catch (error)
				{
				console.log(error);
				}
			},
		async RemovePermission()
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

p
	{
	text-align: right;
	margin:2px;
	}
</style scoped>
