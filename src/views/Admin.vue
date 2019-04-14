<template>
	<div>
		<div class="content">
			<b>Select Portlet: </b> 
			<a @click="ShowUsers">Users</a> | 
			<a @click="ShowSecurity">Security</a> | 
			<a @click="ShowProjects">Projects</a>
		</div>

		<users v-if ="users" />

		<security v-else-if ="security" />
	
		<projects v-else-if ="projects" />

	</div>
</template>

<script>
import Users from '@/components/AdminUsers.vue'
import Security from '@/components/AdminSecurity.vue'
import Projects from '@/components/AdminProjects.vue'

export default
	{
	name: 'admin',
	data()
		{
		return {
			users : true,
			security: false,
			projects: false,
			}
		},
	components:
		{
		Users,
		Security,
		Projects,
		},
	async created()
		{
		},
	computed:
		{
		},
	methods:
		{
		ShowUsers()
			{
			this.users = true;
			this.security = false;
			this.projects = false;
			},
		ShowSecurity()
			{
			this.users = false;
			this.security = true;
			this.projects = false;
			},
		ShowProjects()
			{
			this.users = false;
			this.security = false;
			this.projects = true;
			},
		}
	}
</script>
