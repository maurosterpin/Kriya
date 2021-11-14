import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: {
      needsNoUser: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      needsNoUser: true,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   console.log(from.name, " -> ", to.name);
//   const noUser = store.logged != null;
//   if (noUser && to.meta.needsNoUser) {
//     console.error("NE");
//   } else {
//     next();
//   }
// });

export default router;
