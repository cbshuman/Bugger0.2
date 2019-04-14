<template>
	<div>
		<div class="content">
			<h3>Project Administration </h3>
			<hr>
			<div class = "layout">
				<form @submit.prevent="AddSecurityProject">
					<h4>Project Permissions:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Project names:</p> 
						<input placeholder="Project Name" v-model="securityProject">
						<p>Security Group:</p>
						<input placeholder="Security Group">
					</div>
					<button> Add Security Group </button> | <button> Remove Security Group </button>
				</form>

				<form @submit.prevent="RemoveProject">
					<h4>Delete Project:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Target Project:</p> 
						<input placeholder="Target project name">
					<p><button>Delete Project</button></p>
					</div>
				</form>


			</div>
		</div>
		<div class="content">
		<h3>Project List</h3>
		<hr>
		<projectList :projects ="projects" :showProjects = "false" />
		</div>
	</div>
</template>

<script>
import ProjectList from '@/components/ProjectList.vue'

export default
	{
	name: 'securityAdmin',
	data()
		{
		return {
			securityProject: '',
			
			newPermission: '',
			newPermDisc: '',
			}
		},
	components:
		{
		ProjectList,
		},
	async created()
		{
		await this.$store.dispatch("GetProjects",);
		},
	computed:
		{
		projects() { return this.$store.state.projects; },
		},
	methods:
		{
		async RemoveProject()
			{
			},
		async AddSecurityProject()
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
