<template>
	<div class="content">
		<h3>Current Projects</h3>
		<hr>
		<projectList :projects ="projects" :showProjects = "true" />
		<button @click="ToggleForm">Create New Project</button>

		<div  v-if="showProjectForm">
			<ProjectForm :ToggleForm="ToggleForm" />
		</div>
	</div>
</template>

<script>
import ProjectList from '@/components/ProjectList.vue'
import ProjectForm from '@/components/ProjectForm.vue'

export default
	{
	name: 'admin',
	data()
		{
		return {
			showProjectForm: false,
			}
		},
	async created()
		{
		await this.$store.dispatch("GetProjects",);
		},
	components:
		{
		ProjectList,
		ProjectForm,
		},
	computed:
		{
		projects() { return this.$store.state.projects; },
		},
	methods:
		{
		ToggleForm()
			{
			this.showProjectForm = !this.showProjectForm;
			},
		},
	}
</script>

