import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import axios from 'axios'
import Home from '../views/Home.vue'
const Login = () => import("../views/Login.vue");
const RebuildSong = () => import("../views/RebuildSong.vue")
const RebuildSongList = () => import("../views/RebuildSongList.vue")
const AddSong = () => import("../views/AddSong.vue")
const FreePractice = () => import("../views/FreePractice.vue")
const PerfectPitch = () => import("../views/PerfectPitch.vue")
const Ranking = () => import("../views/Ranking.vue")

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/rebuildSong/:id",
    name: "Rebuild Song",
    component: RebuildSong,
  },
  {
    path: "/rebuildSongList",
    name: "Rebuild Song List",
    component: RebuildSongList,
  },
  {
    path: "/addSong",
    name: "Add Song",
    component: AddSong,
    beforeEnter: (to, from, next) => {
      axios.get("/users/isAdmin", { params: {
        userId: store.state.userId
      }})
      .then((res) => {
        if (res.data === true) {
          next()
        } else {
          next("/")
        }
      })
    }
  },
  {
    path: '/editSong/:id',
    name: 'Edit Song',
    component: AddSong,
    beforeEnter: (to, from, next) => {
      axios.get("/users/isAdmin", { params: {
        userId: store.state.userId
      }})
      .then((res) => {
        if (res.data === true) {
          next()
        } else {
          next("/")
        }
      })
    }
  },
  {
    path: "/freePractice",
    name: "Free Practice",
    component: FreePractice,
  },
  {
    path: "/perfectPitch",
    name: "Perfect Pitch",
    component: PerfectPitch,
  },
  {
    path: "/ranking",
    name: "Ranking",
    component: Ranking,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/freePractice', '/perfectPitch', "/ranking"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = store.state.loggedIn;

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});


export default router
