<template>
	<div class="content">
		<h3>Your Bugs</h3>
		<bugList :bugs ="bugs" :showBugs = "true" />
		<hr>
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
		await this.$store.dispatch("GetUser");
		await this.$store.dispatch("GetUserBugs");
		},
	computed:
		{
		user() { return this.$store.state.user; },
		bugs() { return this.$store.state.bugs; },
		},
	methods:
		{
		}
	}
</script>
