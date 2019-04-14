<template>
	<div class="content">
		<h3>Current Projects</h3>
		<hr>
		<projectList :projects ="projects" :showProjects = "true" />
		<button @click="ToggleForm">Create New Project</button>
	</div>
</template>

<script>
import ProjectList from '@/components/ProjectList.vue'

export default
	{
	name: 'admin',
	async created()
		{
		await this.$store.dispatch("GetProjects",);
		},
	components:
		{
		ProjectList,
		},
	computed:
		{
		projects() { return this.$store.state.projects; },
		},
	methods:
		{
		ToggleForm()
			{
			},
		},
	}
</script>

