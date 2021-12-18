<template>
  <header>
    <nav class="container" @click="checkClick">
      <logo class="logo" />
      <div class="branding">
        <router-link class="header" to="/">Kriya</router-link>
      </div>
      <div class="nav-links">
        <div v-if="searchActivated" class="searchInputContainer">
          <input v-model="searchText" ref="searchInput" type="text" />
          <div
            v-if="searchActivated && searchText != ''"
            class="searchDropdown"
          >
            <UserSearchCard
              v-for="card in cUsers"
              :key="card.Username"
              :test="card"
            />
          </div>
        </div>
        <router-link class="link-icon" to="#"
          ><searchIcon @click="changeSearchState"
        /></router-link>
        <router-link v-if="store.logged" class="link-icon" to="/profile"
          ><profileIcon
        /></router-link>
        <div class="notifications">
          <notificationBell
            v-if="store.logged"
            @click="notificationDropdownActivate"
            class="notificationBell"
          />
          <div v-if="notificationDropdownActive" class="notificationDropdown">
            <NotificationCard />
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import logo from "../assets/Icons/logo.svg";
import profileIcon from "../assets/Icons/user-icon.svg";
import searchIcon from "../assets/Icons/search-icon.svg";
import notificationBell from "../assets/Icons/notification-bell.svg";
import UserSearchCard from "./UserSearchCard.vue";
import NotificationCard from "./NotificationCard.vue";
import store from "@/store";
import firebase from "@/firebase";
import { db } from "@/firebase";
export default {
  name: "navigation",
  components: {
    profileIcon,
    searchIcon,
    UserSearchCard,
    logo,
    notificationBell,
    NotificationCard,
  },
  data() {
    return {
      mobile: null,
      mobileNav: null,
      windowWidth: null,
      store,
      searchActivated: false,
      searchText: "",
      users: [],
      notificationDropdownActive: false,
    };
  },
  created() {
    this.checkScreen();
  },
  mounted() {
    this.getUsers();
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
    notificationDropdownActivate() {
      console.log("TEST");
      this.notificationDropdownActive = !this.notificationDropdownActive;
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {});
    },
    getUsers() {
      db.collection("users")
        .get()
        .then((query) => {
          this.users = [];
          query.forEach((doc) => {
            const data = doc.data();
            this.users.push({
              Username: data.username,
              ProfilePic: data.profilePic,
              UID: data.uid,
            });
          });
        });
    },
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },
    changeSearchState() {
      setTimeout(() => {
        this.searchActivated = !this.searchActivated;
        this.searchText = "";
      }, 0);
    },
    checkClick(e) {
      if (e.target != this.$refs.searchInput && this.searchActivated) {
        this.searchActivated = !this.searchActivated;
      }
    },
  },
  computed: {
    cUsers() {
      return this.users.filter((user) =>
        user.Username.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  padding: 0px;
  margin: 0px;
}

.searchInputContainer {
  position: relative;
}

.searchDropdown {
  max-width: 189px;
  max-height: 300px;
  position: absolute;
  margin-right: 38px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden !important;
}

.notifications {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.notificationBell {
  width: 20px;
  fill: #fff;
  margin-left: 15px;
  cursor: pointer;
}

.notificationDropdown {
  background-color: #fff;
  position: absolute;
  margin-top: 49px;
  margin-right: 50px;
}

input[type="text"],
textarea {
  background-color: #fff !important;
  border: none;
  color: #141518 !important;
  font-weight: 600;
}

input:focus {
  outline: none !important;
}

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
