<template>
  <header>
    <nav class="container" @click="checkClick">
      <logo v-if="!searchActivated || windowWidth > 400" class="logo" />
      <div v-if="!searchActivated || windowWidth > 400" class="branding">
        <router-link class="header" to="/">Kriya</router-link>
      </div>
      <div class="nav-links">
        <div v-if="searchActivated" class="searchInputContainer">
          <searchCancelIcon class="cancelIconSearch" />
          <input v-model="searchText" ref="searchInput" type="text" />
          <div v-if="searchText.length > 0" class="searchDropdown">
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
          <span
            v-if="
              notificationCount.length > 0 || likeNotificationCount.length > 0
            "
            class="notification"
          ></span>
          <div
            v-if="notificationDropdownActive && notificationCount.length > 0"
            class="notificationDropdown"
            @click="removeNotification"
          >
            <NotificationCard
              v-for="card in notificationCount"
              :key="card.index"
              :info="card"
            />
          </div>
          <div
            v-if="
              notificationDropdownActive && likeNotificationCount.length > 0
            "
            class="notificationDropdown"
          >
            <LikeNotificationCard
              v-for="card in likeNotificationCount"
              :key="card.index"
              :info="card"
            />
          </div>
          <div
            v-else-if="
              notificationDropdownActive &&
                notificationCount.length < 1 &&
                likeNotificationCount.length < 1
            "
            class="notificationDropdownEmpty"
          >
            No notifications
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import searchCancelIcon from "../assets/Icons/search-cancel-Icon.svg";
import logo from "../assets/Icons/logo.svg";
import profileIcon from "../assets/Icons/user-icon.svg";
import searchIcon from "../assets/Icons/search-icon.svg";
import notificationBell from "../assets/Icons/notification-bell.svg";
import UserSearchCard from "./UserSearchCard.vue";
import NotificationCard from "./NotificationCard.vue";
import LikeNotificationCard from "./LikeNotificationCard.vue";
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
    searchCancelIcon,
    LikeNotificationCard,
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
      notification: false,
      notificationCount: [],
      likeNotificationCount: [],
    };
  },
  created() {
    this.checkScreen();
    this.getMessageNotifications();
    this.getLikeNotifications();
  },
  mounted() {
    this.getUsers();
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
    });
    this.getLikeNotifications();
    setTimeout(() => {
      const user = firebase.auth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .collection("contacts")
        .onSnapshot(() => {
          this.getMessageNotifications();
        });
    }, 500);
  },
  methods: {
    removeNotification() {
      console.log("remove notification");
      this.notificationDropdownActive = !this.notificationDropdownActive;
    },
    removeLikeNotifications() {
      const user = firebase.auth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .collection("like-notifications")
        .get()
        .then((query) => {
          query.forEach((doc) => {
            db.collection("users")
              .doc(user.uid)
              .collection("like-notifications")
              .doc(doc.id)
              .delete();
          });
        });
    },
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
      this.notificationDropdownActive = !this.notificationDropdownActive;
      this.getMessageNotifications();
      this.removeLikeNotifications();
      this.getLikeNotifications();
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
    getMessageNotifications() {
      this.notificationCount = [];
      console.log("Getting notifications");
      const user = firebase.auth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .collection("contacts")
        .get()
        .then((query) => {
          query.forEach((doc) => {
            const data = doc.data();
            if (data.notification === true) {
              this.notificationCount.push({
                notification: data.notification,
                notificationUID: doc.id,
              });
            }
          });
        });
    },
    getLikeNotifications() {
      this.likeNotificationCount = [];
      console.log("Getting notifications");
      const user = firebase.auth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .collection("like-notifications")
        .get()
        .then((query) => {
          query.forEach((doc) => {
            const data = doc.data();
            this.likeNotificationCount.push({
              notificationType: data.notificationType,
              notificationUID: data.UID,
            });
          });
        })
        .then(console.log("Notification count test", this.notificationCount));
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

.cancelIconSearch {
  position: absolute;
  width: 8px;
  right: 7px;
  top: 9px;
  cursor: pointer;
}

.searchInputContainer {
  position: relative;
}

.notification {
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 100px;
  position: absolute;
  right: 0px;
  margin-top: 10px;
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
  margin-right: 230px;
}

.notificationDropdownEmpty {
  background-color: #fff;
  position: absolute;
  margin-top: 49px;
  margin-right: 150px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
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
