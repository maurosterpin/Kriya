import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import PublicChat from "../views/PublicChat.vue";
import DirectMessages from "../views/DirectMessages.vue";

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
  {
    path: "/public-chat",
    name: "PublicChat",
    component: PublicChat,
  },
  {
    path: "/direct-messages",
    name: "DirectMessages",
    component: DirectMessages,
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
