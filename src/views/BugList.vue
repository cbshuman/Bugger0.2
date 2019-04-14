<template>
	<div class="content">
		<h3>Current Bugs</h3>
		<hr>
		<bugList :bugs ="bugs" :showBugs = "true" />
		<button @click="ToggleForm">Create New Bug</button>
	</div>
</template>

<script>
import BugList from '@/components/BugList.vue'

export default
	{
	name: 'masterbuglist',
	data()
		{
		return { }
		},
	components:
		{
		BugList,
		},
	async created()
		{
		await this.$store.dispatch("GetBugs",);
		},
	computed:
		{
		bugs() { return this.$store.state.bugs; },
		},
	methods:
		{
		ToggleForm()
			{
			},
		}
	}
</script>
