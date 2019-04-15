<template>
	<div class="modal-mask">
		<div class ="modal-wrapper">
			<div class="modal-container">
			<h3>Report a New Bug</h3>
			<hr>
			<form @submit.prevent="CreateBug">
				<div class = "layoutInterior">
					<p>New Bug Nickname:</p>
					<input v-model="bugNickname">					
					<p>*Reporter Email:</p>
					<input v-model="emailReport">
					<p>*Version Found In:</p>
					<div class="version">
						<input v-model="ver1"> .
						<input v-model="ver2"> .
						<input v-model="ver3"> .
						<input v-model="ver4">
					</div>
					<p>*Project:</p>
					<select v-model="project">
						<option v-for="currentProject in projects" v-bind:value="currentProject">
						{{currentProject.projectName}}
						</option>
					</select>
					<p>*Priority:</p>
					<select name="Status" v-model="priority">
					  <option value="Low">Low</option>
					  <option value="Medium">Medium</option>
					  <option value="High">High</option>
					  <option value="Imediate">Imediate</option>
					</select>
				<p>*Bug Discription:</p>
				<textarea name="message" placeholder="Describe the bug using as many details as possible" v-model="bugDiscrip"></textarea>
				</div>
				<button  type="submit">Create Bug</button>
				<button @click="ToggleForm">Cancel</button>
			</form>

			* Required field
			</div>
		</div>
	</div>
</template>

<script>
export default
	{
	name: 'bugForm',
	data()
		{
		return{
			bugNickname: '',
			emailReport: '',
			priority: 'Low',
			bugDiscrip: '',
			project: '',
			ver1: '',
			ver2: '',
			ver3: '',
			ver4: '',
			}
		},
	async created()
		{
		await this.$store.dispatch("GetProjects",);
		this.project = this.projects[0];
		},
	computed:
		{
		projects() { return this.$store.state.projects; },
		},
	props:
		{
		ToggleForm: Function,
		},
	methods:
		{
		async CreateBug()
			{
			await this.$store.dispatch("CreateBug",
						{
						bugNickname: this.bugNickname,
						emailReport: this.emailReport,
						priority: this.priority,
						project: this.project,
						ver1: this.ver1,
						ver2: this.ver2,
						ver3: this.ver3,
						ver4: this.ver4,
						bugDiscrip: this.bugDiscrip,
						});
			await this.$store.dispatch("GetBugs",);
			this.ToggleForm();
			},
		}
	}
</script>

<style scoped>
input
	{
	margin:2px;
	}

button
	{
	margin:4px;
	}

p
	{
	text-align: right;
	margin:2px;
	}

select
	{
	margin:2px;
	}

textarea
	{
	margin:2px;
	height:5em;
	padding:4px;
	border-radius:8px;
	border: 3px solid #5E807F;
	box-sizing: border-box;
	}

textarea:focus
	{
	border: 3px solid #17B890;
	}

.modal-container
	{
	min-width: 20em;
	max-width: 50%;
	margin: 0px auto;
	padding: 1em;
	background-color: #DEE5E5;
	border: 5px solid #082D0F;
	border-radius:5px;
	transition: all .3s ease;
	}

.modal-mask
	{
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .5);
	display: table;
	transition: opacity .3s ease;
	}

.modal-wrapper
	{
	display: table-cell;
	vertical-align: middle;
	}

.version input
	{
	width:3em !important;
	padding:.25em;
	margin: .25em;
	}
</style scoped>
