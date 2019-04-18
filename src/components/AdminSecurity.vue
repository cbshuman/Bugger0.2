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
					<div>
						<input v-model="deletePermission" placeholder="Search">
						<autoComplete :collection="permissionNames" :targetValue="deletePermission" @SetValue="GetRemovePermission" />
					</div>
				<p><button> Remove Security Group </button></p>
				</div>
			</form>
		</div>
		<securityList :permissions="permissions" />
	</div>
</template>

<script>
import SecurityList from '@/components/SecurityList.vue'
import AutoComplete from '@/components/AutoCompleteForm.vue'

export default
	{
	name: 'securityAdmin',
	data()
		{
		return {
			newPermission: '',
			newPermDisc: '',
			deletePermission: '',
			}
		},
	components:
		{
		SecurityList,
		AutoComplete,
		},
	async created()
		{
		await this.$store.dispatch("GetProjects",);
		await await this.$store.dispatch("GetPermissions",);
		await this.$store.dispatch("GetPermissionNames",this.permissions);
		},
	computed:
		{
		permissions() { return this.$store.state.permissions; },
		permissionNames() { return this.$store.state.permissionNames; },
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
		GetRemovePermission(valueIn)
			{
			this.deletePermission = valueIn;
			return(this.deletePermission);
			},
		async RemovePermission()
			{
			},
		}
	}
</script>

<style scoped>
input
	{
	width:100%;
	}

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
