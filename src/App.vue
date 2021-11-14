<template>
  <div class="app-wrapper">
    <div class="app">
      <Navigation />
      <router-view />
    </div>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import firebase from "@/firebase";
import store from "@/store";

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email);
    store.logged = true;
  } else {
    console.log("No user");
    store.logged = false;
  }
});

export default {
  name: "app",
  components: {
    Navigation,
  },
  data() {
    return {
      store,
    };
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Nunito", sans-serif;
}
body {
  background-color: #39c75a;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
}

.link {
  cursor: pointer;
  text-decoration: none;
  color: black;
  font-weight: 900;
}

.link-light {
  color: #fff;
}
</style>
