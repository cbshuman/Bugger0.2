<template>
	<div class="content">
		<h3>Current Bugs</h3>
		<hr>
		<bugList :bugs ="bugs" :showBugs = "true" />

		<div  v-if="showBugForm">
			<bugForm :ToggleForm="ToggleForm" />
		</div>

		<button @click="ToggleForm">Create New Bug</button>
	</div>
</template>

<script>
import BugList from '@/components/BugList.vue'
import BugForm from '@/components/BugForm.vue'

export default
	{
	name: 'masterbuglist',
	data()
		{
		return {
			showBugForm: false,
			}
		},
	components:
		{
		BugList,
		BugForm
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
			this.showBugForm = !this.showBugForm;
			},
		}
	}
</script>
