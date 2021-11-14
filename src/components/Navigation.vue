<template>
  <header>
    <nav class="container">
      <logo class="logo" />
      <div class="branding">
        <router-link class="header" to="/">Kriya</router-link>
      </div>
      <div class="nav-links">
        <router-link class="link-icon" to="#"><searchIcon /></router-link>
        <router-link v-if="store.logged" class="link-icon" to="/profile"
          ><profileIcon
        /></router-link>
        <router-link v-else class="link-icon" to="/login"
          ><profileIcon
        /></router-link>

        <a href="#" v-if="store.logged" class="link" @click="logout"
          >Sign Out</a
        >
      </div>
    </nav>
  </header>
</template>

<script>
import logo from "../assets/Icons/logo.svg";
import profileIcon from "../assets/Icons/user-icon.svg";
import searchIcon from "../assets/Icons/search-icon.svg";
import store from "@/store";
import firebase from "@/firebase";
export default {
  name: "navigation",
  components: {
    profileIcon,
    searchIcon,
    logo,
  },
  data() {
    return {
      mobile: null,
      mobileNav: null,
      windowWidth: null,
      store,
    };
  },
  created() {
    this.checkScreen();
  },
  mounted() {},
  methods: {
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.window <= 750) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
      this.mobileNav = false;
      return;
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {});
    },

    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.logo {
  width: 25px;
  margin-right: 8px;
}

header {
  background-color: #141518;
  padding: 0 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 99;

  nav {
    display: flex;
    padding: 20px 0;

    .branding {
      display: flex;
      align-items: center;

      .header {
        font-weight: 100;
        font-size: 23.5px;
        color: #fff;
        text-decoration: none;
        margin-top: 3px;
      }
    }
    .nav-links {
      position: relative;
      display: flex;
      flex: 1;

      justify-content: flex-end;
      align-items: center;

      .link {
        margin-right: 32px;
        color: #fff;
      }

      .link-icon {
        right: 8rem;
        margin-top: 6px;
        margin-left: 15px;
      }

      .link:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
