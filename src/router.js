import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ProjectList from './views/ProjectList.vue'
import BugList from './views/BugList.vue'
import UserPrefs from './views/UserPrefs.vue'
import Admin from './views/Admin.vue'
import About from './views/About.vue'
import BugView from './views/BugView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
	{ path: '/', name: 'home', component: Home },
    { path: '/projects', name: 'projectList', component: ProjectList },
    { path: '/bugList', name: 'bugList', component: BugList },
    { path: '/userPrefs', name: 'userPrefs', component: UserPrefs},
    { path: '/admin', name: 'admin', component: Admin },
    { path: '/about', name: 'about', component: About},
    { path: '/bug', name: 'bug', component: BugView}
	]
})
