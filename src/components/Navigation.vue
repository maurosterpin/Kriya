<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" :to="{ Home }">Kriya</router-link>
      </div>
      <div class="nav-links">
        <ul>
          <router-link class="link-icon" to="#"><searchIcon /></router-link>
          <router-link class="link" to="#">Login/Register</router-link>
          <router-link v-if="temp" class="link" to="#"
            ><profileIcon
          /></router-link>
          <router-link v-if="temp" class="link" to="#"
            ><settingsIcon
          /></router-link>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import profileIcon from "../assets/Icons/user-icon.svg";
import settingsIcon from "../assets/Icons/user-settings.svg";
import searchIcon from "../assets/Icons/search-icon.svg";
export default {
  name: "navigation",
  components: {
    profileIcon,
    settingsIcon,
    searchIcon,
  },
  data() {
    return {
      mobile: null,
      mobileNav: null,
      windowWidth: null,
    };
  },
  created() {
    window.addEventListenter("resize", this.checkScreen);
    this.checkScreen();
  },
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

    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  background-color: #141518;
  padding: 0 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 99;

  nav {
    display: flex;
    padding: 25px 0;

    .branding {
      display: flex;
      align-items: center;

      .header {
        font-weight: 900;
        font-size: 24px;
        color: #39c75a;
        text-decoration: none;
      }
    }
    .nav-links {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      ul {
        margin-right: 0;

        .link {
          margin-right: 32px;
          color: #39c75a;
        }

        .link-icon {
          right: 10rem;
          position: absolute;
        }

        .link:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
