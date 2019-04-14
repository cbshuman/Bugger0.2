<template>
	<div class="content" v-if="bug">
		<h3>Bug #{{bug._id}}</h3>
		<hr>
		<form>
			<div  class = "layout">

				<div class ="interalForm">
					<h4>Naming:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Bug Nickname:</p>
						<input placeholder="Enter a nickname for the bug" v-model="bug.bugNickname">
					</div>
				</div>

				<div class ="interalForm">
					<h4>Project Information:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Project:</p>
						<select v-model="bug.project">
							<option v-for="project in projects" v-bind:value="project.projectName">
							{{project.projectName}}
							</option>
						</select>
						<p>Version Found In:</p>
						<div class="version">
							<input v-model="bug.ver1" type="number"> .
							<input v-model="bug.ver2" type="number"> .
							<input v-model="bug.ver3" type="number"> .
							<input v-model="bug.ver4" type="number">
						</div>
						<p>Version Fixed In:</p>
						<div class="version">
							<input v-model="bug.fixVer1" type="number"> .
							<input v-model="bug.fixVer2" type="number"> .
							<input v-model="bug.fixVer3" type="number"> .
							<input v-model="bug.fixVer4" type="number">
						</div>
					</div>
				</div>

				<div class ="interalForm">
					<h4>Contact Info:</h4>
					<hr>
					<div class = "layoutInterior">
						<p>Reporter Contact:</p>
						<input placeholder="Contact that reported the bug" v-model="bug.emailReport">

						<p>Bug Primary Contact:</p>
						<input placeholder="Primary engineer assigned to fix" v-model="bug.emailPrimary">

						<p>Bug Secondary Contact:</p>
						<input placeholder="Secondary engineer assigned to fix" v-model="bug.emailSecondary">

						<p>Bug QA Contact:</p>
						<input placeholder="Primary QA tester" v-model="bug.emailQA">
					</div>
				</div>

				<div class ="interalForm">
					<h4>Bug Status:</h4>
					<hr>
					<div class = "layoutInterior">

						<p>Created On:</p>
						<i>{{bug.dateCreated}}</i>

						<p>Last Modified on:</p>
						<i>{{bug.dateModified}}</i>

						<p>Bug Status:</p>
						<select v-model="bug.status">
						  <option value="New">New</option>
						  <option value="Can't Reproduce">Can't Reproduce</option>
						  <option value="On Hold">On Hold</option>
						  <option value="Fix in Progress">Fix in Progress</option>
						  <option value="Fixed">Fixed</option>
						</select>

						<p>Current Priority:</p>
						<select v-model="bug.priority">
						  <option value="Low">Low</option>
						  <option value="Medium">Medium</option>
						  <option value="High">High</option>
						  <option value="Imediate">Imediate</option>
						</select>
					</div>
				</div>

				<div class ="interalForm">
					<h4>Bug Discription:</h4>
					<hr>
					<textarea name="message" placeholder="Describe the bug" v-model="bug.discription"></textarea>
				</div>

			</div>
		
		<br><button  type="submit">Save Changes</button> <p v-if="error" class="error">{{error}}</p>
		</form>		

		<div class = "comments">
			<h4>Comments</h4>
			<hr>
			<div class = "bugInfo">
				<form @submit.prevent="SendComment()">
					<textarea v-model="newComment" placeholder="Enter New Comment"></textarea>
					<br><button>Save Comment</button>
				</form type="submit" type="button">
			</div>
		<div class="comment" v-for="comment in bug.comments"> <h4>- {{comment.usersName}} on {{comment.date}}: </h4> {{comment.comment}} </div>
		</div>
	</div>
</template>

<script>
export default
	{
	name: 'bug',
	data()
		{
		return {
			bugID : '',
			bug: null,
			error: '',
			newComment:'',
			}
		},
	async created()
		{
		await this.$store.dispatch("GetBugs",);
		await this.$store.dispatch("GetProjects",);
		this.GetBugID();
		this.bug = await this.$store.dispatch("GetBug",this.bugID,);
		},
	computed:
		{
		projects() { return this.$store.state.projects; },
		},
	methods:
		{
		GetBugID()
			{
			let url = window.location.href;
			this.bugID = url.slice(url.indexOf('#')+1,url.length);
			},
		}
	}
</script>

<style scoped>
input
	{
	margin:2px;
	}
p
	{
	text-align: right;
	margin:2px;
	}

textarea
	{
	width:50%;
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

.comment
	{
  	background-color: #9DC5BB;
	border: 5px solid #5E807F;
	border-radius:5px;
	width:50%;
	padding:1em;
	margin:.5em;
	}

.comment h4
	{
	margin:0.25em;
	}

.interalForm
	{
	padding: .25em;
	}

.version input
	{
	width:3em !important;
	height:.5em;
	padding:.25em;
	margin: .25em;
	}
</style scoped>
