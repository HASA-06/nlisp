import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { userInfo } from 'os'
import Info from '../views/Info.vue'
import SignUp from '../views/SignUp.vue'
import SignIn from '../views/SignIn.vue'
import Policy from '../views/Policy.vue'
import Main from '../views/Main.vue'
import BoardsBulletinsMain from '../views/Boards/Bulletins/Main.vue'
import BoardsBulletinsRead from '../views/Boards/Bulletins/Read.vue'
import BoardsBulletinsCreate from '../views/Boards/Bulletins/Create.vue'
import BoardsMentoMentisMain from '../views/Boards/MentoMentis/Main.vue'
import BoardsMentoMentisRead from '../views/Boards/MentoMentis/Read.vue'
import BoardsMentoMentiReadDetail from '../views/Boards/MentoMentis/ReadDetail.vue'
import BoardsMentoMentiCreate from '../views/Boards/MentoMentis/Create.vue'
import ActivitysPicturesMain from'../views/Activitys/Pictures/Main.vue'
import ActivitysPicturesCreate from '../views/Activitys/Pictures/Create.vue'
import ActivitysNoticesMain from '../views/Activitys/Notices/Main.vue'
import ActivitysNoticesCreate from '../views/Activitys/Notices/Create.vue'
import ActivitysNoticesRead from '../views/Activitys/Notices/Read.vue'
import CalendersMonth from '../views/Calenders/Month.vue'
import CalendersWeek from '../views/Calenders/Week.vue'
import CalendersCreate from '../views/Calenders/Create.vue'
import Chatting from '../views/Chatting.vue'
import Historys from '../views/Historys.vue'
import Qna from '../views/Qna.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path : '/user/sign-up', 
    name : 'SignUp',
    component : SignUp
  },
  {
    path : '/user/sign-in',
    name : 'SignIn',
    component : SignIn
  },
  {
    path : '/user/policy',
    name : 'Policy',
    component : Policy
  },
  {
    path : '/user/info',
    name : 'Info',
    component : Info
  },
  {
    path : '/main',
    name : 'Main',
    component : Main
  },
  {
    path : '/boards/bulletins/main',
    name : 'BoardsBulletinsMain',
    component : BoardsBulletinsMain
  },
  {
    path : '/boards/bulletins/read',
    name : 'BoardsBulletinsRead',
    component : BoardsBulletinsRead
  },
  {
    path :'/boards/bulletins/create',
    name : 'BoardsBulletinsCreate',
    component : BoardsBulletinsCreate
  },
  {
    path : '/boards/mento-mentis/main',
    name : 'BoardsMentoMentisMain',
    component : BoardsMentoMentisMain
  },
  {
    path : '/boards/mento-mentis/read',
    name : 'BoardsMentoMentisRead',
    component : BoardsMentoMentisRead
  },
  {
    path : '/boards/mento-mentis/read-detail',
    name : 'BoardsMentoMentiReadDetail',
    component : BoardsMentoMentiReadDetail
  },
  {
    path : '/boards/mento-mentis/create',
    name : 'BoardsMentoMentiCreate',
    component : BoardsMentoMentiCreate
  },
  {
    path : '/activitys/pictures/main',
    name : 'ActivitysPicturesMain',
    component : ActivitysPicturesMain
  },
  {
    path: '/activitys/pictures/create',
    name : 'ActivitysPicturesCreate',
    component : ActivitysPicturesCreate
  },
  {
    path : '/activitys/notices/main',
    name : 'ActivitysNoticesMain',
    component : ActivitysNoticesMain
  },
  {
    path : '/activitys/notices/create',
    name : 'ActivitysNoticesCreate',
    component : ActivitysNoticesCreate
  },
  {
    path : '/activitys/notices/read',
    name : 'ActivitysNoticesRead',
    component : ActivitysNoticesRead
  },
  {
    path : '/calenders/month',
    name : 'CalendersMonth',
    component : CalendersMonth
  },
  {
    path : '/calenders/week',
    name : 'calendersWeek',
    component : CalendersWeek
  },
  {
    path : '/calenders/create',
    name : 'CalendersCreate',
    component : CalendersCreate
  },
  {
    path : '/chatting',
    name : 'Chatting',
    component : Chatting
  },
  {
    path : '/historys',
    name : 'Historys',
    component : Historys
  },
  {
    path : '/qna',
    name : 'Qna',
    component : Qna
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
