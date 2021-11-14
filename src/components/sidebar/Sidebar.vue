<template>
  <div>
    <div class="sidebar" :style="{ width: sidebarWidth }">
      <div class="sidebar-link-wrapper">
        <router-link
          class="sidebar-link"
          :class="{ 'slide-left': collapsed }"
          to="/"
          >Home</router-link
        >
        <router-link
          class="sidebar-link"
          :class="{ 'slide-left': collapsed }"
          to="/"
          >Public chat</router-link
        >
        <router-link
          class="sidebar-link"
          :class="{ 'slide-left': collapsed }"
          to="/"
          >Messages</router-link
        >
      </div>

      <div class="sidebar-link-wrapper-bottom">
        <router-link
          v-if="!store.logged"
          class="sidebar-link"
          :class="{ 'slide-left': collapsed }"
          to="/login"
          >Log In</router-link
        >
        <router-link
          v-if="!store.logged"
          @click="logout"
          class="sidebar-link"
          :class="{ 'slide-left': collapsed }"
          to="/signup"
          >Sign In</router-link
        >
        <router-link
          v-if="store.logged"
          class="sidebar-link"
          :class="{ 'slide-left': collapsed }"
          to="/"
          >Settings</router-link
        >
        <a
          v-if="store.logged"
          @click="logout"
          class="sidebar-link sidebar-sign-out"
          :class="{ 'slide-left': collapsed }"
          to="/"
          >Sign Out</a
        >
      </div>
    </div>
    <div class="collapse-icon" @click="toggleSidebar">
      <doubleArrow
        class="doubleArrow"
        :class="{ 'rotate-180': !collapsed }"
        :style="{ 'margin-left': doubleArrowMarginLeft }"
      />
    </div>
  </div>
</template>

<script>
import doubleArrow from "../../assets/Icons/double-arrow-right.svg";
import store from "@/store";
import firebase from "@/firebase";
export default {
  name: "Sidebar",
  data() {
    return {
      collapsed: true,
      SIDEBAR_WIDTH: 230,
      SIDEBAR_WIDTH_COLLAPSED: 0,
      MARGIN_LEFT: 185,
      MARGIN_LEFT_COLLAPSED: 0,
      store,
    };
  },
  methods: {
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    },
    logout() {
      firebase.auth().signOut();
    },
  },
  computed: {
    sidebarWidth() {
      return `${
        this.collapsed ? this.SIDEBAR_WIDTH_COLLAPSED : this.SIDEBAR_WIDTH
      }px`;
    },
    doubleArrowMarginLeft() {
      return `${
        this.collapsed ? this.MARGIN_LEFT_COLLAPSED : this.MARGIN_LEFT
      }px`;
    },
  },
  components: {
    doubleArrow,
  },
};
</script>

<style scoped>
.sidebar {
  color: #fff;
  background-color: #39c75a;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.3);

  float: left;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  bottom: 0;

  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
}

.doubleArrow {
  fill: #fff;
  width: 38px;
  padding: 0.75em;
  margin-bottom: 5px;
  position: fixed;
  bottom: 0;
  z-index: 100;
  display: flex;
  transition: 0.4s ease;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: 0.4s ease;
}

.sidebar-link-wrapper {
  margin-top: 37px;
  font-weight: 100;
  display: flex;
  flex-direction: column;
}
.sidebar-link-wrapper-bottom {
  font-weight: 100;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  margin-bottom: 45px;
}

.sidebar-link {
  color: #fff;
  font-size: 18px;
  transition: 0.2s ease;
  margin-left: 25px;
  margin-bottom: 10px;
}

a:hover {
  cursor: pointer;
  text-decoration: underline !important;
}

.slide-left {
  margin-left: -450px;
  transition: 0.3s ease;
}
</style>
