<template>
  <div class="container-feed-card">
    <div class="container-feed-card-head" @click="visitProfile">
      <avatar class="feed-icon" />
      <div class="container-feed-card-head-txt">
        <h6>{{ username }}</h6>
        <h6>{{ postedFromNow }}</h6>
      </div>
    </div>
    <div class="container-feed-card-head-msg">
      <h5>I completed my {{ info.ListType.toLowerCase() }} to-do list!</h5>
    </div>
    <div class="container-feed-card-body">
      <ToDoList :info="info" :listType="info.ListType" />
      <div class="feed-card-button-container">
        <button
          v-if="store.currentUserUid != info.UID"
          class="feed-card-button"
        >
          Congratulations!
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ToDoList from "../components/ToDoList.vue";
import avatar from "../assets/Icons/avatar.svg";
import moment from "moment";
import { db } from "@/firebase";
import store from "@/store";
import router from "@/router";
import firebase from "@/firebase";
export default {
  name: "feedCard",
  props: ["info", "listType", "passedID", "goalName"],
  components: {
    ToDoList,
    avatar,
  },
  mounted() {
    this.getUserData();
    console.log("UIDS:", this.store.currentUserUid, this.info.UID);
  },
  methods: {
    getUserData() {
      db.collection("users")
        .doc(this.info.UID)
        .get()
        .then((doc) => {
          this.username = doc.data().username;
          this.profilePic = doc.data().profilePic;
        });
    },
    visitProfile() {
      console.log("visitProfile");
      // Get current user
      const user = firebase.auth().currentUser;
      if (user.uid != this.info.UID) {
        router.push({
          name: "VisitedProfile",
          params: { profileUid: this.info.UID },
        });
      } else {
        router.push({
          name: "Profile",
        });
      }
    },
  },
  computed: {
    postedFromNow() {
      return moment(this.info.CompletionDate).fromNow();
    },
  },
  data() {
    return {
      username: "",
      profilePic: "",
      store,
    };
  },
};
</script>

<style scoped>
.container-feed-card {
  width: 100%;
  margin-bottom: 55px;
  padding: 25px;
  background-color: #141518;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 380px) {
  .container-feed-card {
    padding: 10px;
    max-width: 300px;
    margin: auto;
    margin-bottom: 55px;
  }

  .container-feed-card-head {
    padding: 5px;
  }

  .container-feed-card-head-txt h5 {
    font-size: 15px;
  }

  .container-feed-card-head-txt h6 {
    font-size: 14px;
  }

  .feed-icon {
    width: 35px !important;
  }

  .container-feed-card-head-msg h5 {
    font-size: 15px !important;
  }
}

.container-feed-card-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #fff;
  cursor: pointer;
}

.container-feed-card-head-txt {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}

.container-feed-card-head-msg {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-top: 15px;
}

.feed-icon {
  width: 45px;
  border-radius: 50px;
  margin-right: 10px;
}
.feed-card-button-container {
  position: relative;
  display: flex;
  justify-content: center;
}
.feed-card-button {
  margin-top: 5px;
  position: absolute;
  padding: 9px 16px;
  border-radius: 50px;
  border: none;
  background-color: #39c75a;
  color: #fff;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

*:focus {
  outline: none;
}
</style>
