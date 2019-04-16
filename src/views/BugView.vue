<template>
	<div class="content" v-if="bug">
		<h3>Bug #{{bug._id}}</h3>
		<hr>
		<form @submit.prevent="UpdateBug">
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
					<textarea name="message" placeholder="Describe the bug" v-model="bug.bugDiscrip"></textarea>
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

			<div class="comment" v-for="comment in comments">
				<center>
					<h4> {{comment.username}} </h4>
					<div v-if="comment.profilePicture" class ="imageWrapper">
						<img :src="comment.profilePicture">
					</div>
					<div v-else class ="imageWrapper">
						<img src="/Profile_icon_Defualt.png">
					</div>
				</center>
				<div>
				 	{{comment.comment}}
					<br>- <i>{{comment.date}}</i>
				</div>
			</div>

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
			comments: [],
			}
		},
	async created()
		{
		await this.$store.dispatch("GetBugs",);
		await this.$store.dispatch("GetProjects",);
		this.GetBugID();
		this.bug = await this.$store.dispatch("GetBug",this.bugID,);
		this.GetComments();
		},
	computed:
		{
		projects() { return this.$store.state.projects; },
		user() { return this.$store.state.user; },
		},
	methods:
		{
		async GetComments()
			{
			let comments = [];
			let store = this.$store;
			this.bug.comments.forEach(async function(element)
				{
				let userProfile = await store.dispatch("GetUserProfile", {id : element.userID});
				let comment = {comment: element.comment, username: userProfile.username, profilePicture: userProfile.profilePicture, date: element.date};
				comments.push(comment);
				});

			this.comments = comments;
			},
		GetBugID()
			{
			let url = window.location.href;
			this.bugID = url.slice(url.indexOf('#')+1,url.length);
			},
		async SendComment()
			{
			await this.$store.dispatch("CommentOnBug",{id : this.bug._id, comment: this.newComment, user: this.user._id})
			this.newComment ='';
			this.bug = await this.$store.dispatch("GetBug",this.bugID,);
			this.GetComments();
			},
		async UpdateBug()
			{
			this.bug = await this.$store.dispatch("UpdateBug",{
					id : this.bug._id,
					bugNickname: this.bug.bugNickname,
					emailReport: this.bug.emailReport,
					emailPrimary: this.bug.emailPrimary,
					emailSecondary: this.bug.emailSecondary,
					emailQA: this.bug.emailQA,
					status: this.bug.status,
					priority : this.bug.priority,
					project: this.bug.project,
					ver1: this.bug.ver1,
					ver2: this.bug.ver2,
					ver3: this.bug.ver3,
					ver4: this.bug.ver4,
					fixVer1: this.bug.fixVer1,
					fixVer2: this.bug.fixVer2,
					fixVer3: this.bug.fixVer3,
					fixVer4: this.bug.fixVer4,
					bugDiscrip: this.bug.bugDiscrip,
					});
			//Get the updated bug
			this.GetBugID();
			this.bug = await this.$store.dispatch("GetBug",this.bugID,);
			},
		}
	}
</script>

<style scoped>
img
	{
	height:3em;
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

p2
	{
	text-align: left;
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
	display: grid;
	grid-template-columns: 8em auto;
  	background-color: #9DC5BB;
	border: 5px solid #5E807F;
	border-radius:5px;
	width:50%;
	padding:.25em;
	margin:.5em;
	}

.comment center
	{
	width:7em;
	}

.comment h4
	{
	margin:0.25em;
	}

.imageWrapper
	{
	height:2.5em;
	width:2.5em;
	background-color: #5E807F !important;
	border: 3px solid #082D0F;
	border-radius:500px;
	overflow: hidden;
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
