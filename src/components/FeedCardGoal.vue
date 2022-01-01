<template>
  <div class="container-feed-card">
    <div class="container-feed-card-head">
      <img :src="profilePic" class="feed-icon" @click="visitProfile" />
      <div class="container-feed-card-head-txt">
        <h6 @click="visitProfile">{{ username }}</h6>
        <h6 @click="visitProfile">{{ postedFromNow }}</h6>
        <cancelIcon
          v-if="info.UID === store.currentUserUid"
          class="cancelIconStyle"
          @click="removePost"
        />
      </div>
    </div>
    <div class="container-feed-card-head-msg">
      <h5>I completed my goal!</h5>
    </div>
    <div class="goal-name">
      <h5>{{ info.GoalName }}</h5>
    </div>

    <div class="container-feed-card-body">
      <ToDoList :info="info" :listType="info.ListType" />
      <div class="feed-card-button-container">
        <transition name="list2" appear>
          <button
            v-if="isLiked"
            class="feed-card-button button-hover"
            @click="removeLike"
          >
            <likeIcon class="margin-right likeIcon" />
            {{ isLiked }}
          </button>
          <div class="likesHover" v-for="(user, index) in likes" :key="index">
            {{ likeUsernames.join(", ") }}
          </div>
        </transition>
        <transition name="list2" appear>
          <button
            v-if="!isLiked && info.UID != store.currentUserUid"
            class="feed-card-button"
            @click="congratulate"
          >
            Congratulate!
          </button>
          <button
            v-else-if="likes.length > 0 && info.UID === store.currentUserUid"
            class="feed-card-button button-hover"
          >
            <likeIcon class="margin-right likeIcon" /> {{ likes.length }}
          </button>
        </transition>
        <div class="likesHover" v-for="(user, index) in likes" :key="index">
          {{ likeUsernames.join(", ") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cancelIcon from "../assets/Icons/cancel-Icon.svg";
import likeIcon from "../assets/Icons/like-icon.svg";
import moment from "moment";
import { db } from "@/firebase";
import store from "@/store";
import router from "@/router";
import firebase from "@/firebase";
export default {
  name: "feedCard",
  props: ["info", "listType", "passedID", "goalName"],
  components: {
    likeIcon,
    cancelIcon,
  },
  data() {
    return {
      currentUserUsername: "",
      currentUID: "",
      username: "",
      profilePic: "",
      store,
      likes: [],
      likeUIDs: [],
      likeUsernames: [],
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getCurrentUserData();
      }
    });
    this.getUserData();
    this.getLikes();
  },
  methods: {
    removePost() {
      db.collection("posts")
        .doc(this.info.docID)
        .delete()
        .then(() => {
          this.$parent.getPosts();
        });
    },
    getCurrentUserData() {
      // Get current user
      const user = firebase.auth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          this.currentUID = user.uid;
          this.currentUserUsername = doc.data().username;
        });
    },
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
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
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
        } else {
          router.push({
            name: "VisitedProfile",
            params: { profileUid: this.info.UID },
          });
        }
      });
    },
    getLikes() {
      const dataBase = db
        .collection("posts")
        .doc(this.info.docID)
        .collection("likes");
      dataBase
        .orderBy("Date", "desc")
        .get()
        .then((query) => {
          this.likes = [];
          this.likeUIDs = [];
          this.likeUsernames = [];
          query.forEach((doc) => {
            const data = doc.data();
            this.likes.push({
              username: data.username,
              Date: data.Date,
            });
            this.likeUIDs.push(doc.id);
            this.likeUsernames.push(data.username);
          });
        });
    },
    congratulate() {
      console.log("congratulate");
      const dataBase = db
        .collection("posts")
        .doc(this.info.docID)
        .collection("likes")
        .doc(this.currentUID);
      dataBase
        .set({ username: this.currentUserUsername, Date: Date.now() })
        .then(() => {
          this.getLikes();
          this.sendNotification();
        });
    },
    removeLike() {
      console.log("removeLike");
      db.collection("posts")
        .doc(this.info.docID)
        .collection("likes")
        .doc(this.currentUID)
        .delete()
        .then(() => {
          this.getLikes();
        });
    },
    sendNotification() {
      db.collection("users")
        .doc(this.info.UID)
        .collection("like-notifications")
        .doc()
        .set({
          notificationType: "goal",
          UID: this.currentUID,
        });
    },
  },
  computed: {
    postedFromNow() {
      return moment(this.info.CompletionDate).fromNow();
    },
    isLiked() {
      if (this.likeUIDs.find((element) => element === this.currentUID)) {
        return this.likes.length;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.goal-name {
  margin: auto;
  margin-top: 10px;
  color: #fff;
  background-color: #39c75a;
  padding: 4px 4px;
  border-radius: 100px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.3);
  margin-bottom: 12px;
  min-width: 100px;
  text-align: center;
}

.goal-name h5 {
  padding: 9px 12px 0px 12px;
  font-size: 16px;
}

.container-feed-card {
  width: 100%;
  margin-bottom: 55px;
  padding: 25px;
  background-color: #141518;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
}

.goal h5 {
  margin-top: 15px;
  color: #fff;
}

.button-hover:hover + .likesHover {
  display: inline;
}

.likesHover {
  position: absolute;
  color: #fff;
  padding: 10px;
  background-color: #141518;
  border-radius: 100px;
  margin-top: -36px;
  display: none;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 1);
}

@media screen and (max-width: 380px) {
  h5 {
    font-size: 12px !important;
  }

  .goal-name {
    margin-bottom: 25px !important;
  }

  .container-feed-card {
    padding: 10px;
    max-width: 250px;
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
    font-size: 11px;
  }

  .feed-icon {
    width: 35px !important;
  }

  .container-feed-card-head-msg h5 {
    font-size: 12px !important;
  }

  .feed-card-button {
    margin-top: -5px !important;
    padding: 7px 12px !important;
    font-size: 12px !important;
  }

  .likeIcon {
    width: 15px !important;
  }

  .feed-card-button {
    margin-top: -3px !important;
    position: absolute;
    padding: 4px 11px !important;
    border-radius: 50px;
    border: none;
    background-color: #39c75a;
    color: #fff;
    box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
}

.container-feed-card-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #fff;
  cursor: pointer;
}

.margin-right {
  margin-right: 3px;
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
  display: flex;
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

.cancelIconStyle {
  width: 7px !important;
  cursor: pointer;
  margin-bottom: 25px !important;
}
</style>
