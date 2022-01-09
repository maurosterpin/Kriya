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
    <div class="quote-container">
      <div class="container-feed-card-head-msg">
        <h5>" {{ info.Quote }} "</h5>
      </div>
      <div class="container-feed-card-author">
        <h6>- {{ info.Author }}</h6>
      </div>
    </div>
    <div class="feed-card-button-container">
      <button
        v-if="
          likes.length === 0 &&
            info.UID != store.currentUserUid &&
            store.currentUserUid
        "
        class="feed-card-button button-hover"
        @click="congratulate"
      >
        <likeIcon class="margin-right likeIcon" />
      </button>
      <button
        v-else-if="isLiked && info.UID != store.currentUserUid"
        class="feed-card-button button-hover"
        @click="removeLike"
      >
        <likeIcon class="margin-right likeIcon" /> {{ isLiked }}
      </button>
      <button
        v-else-if="
          !isLiked && info.UID != store.currentUserUid && store.currentUserUid
        "
        class="feed-card-button button-hover"
        @click="congratulate"
      >
        <likeIcon class="margin-right likeIcon" />{{ likes.length }}
      </button>
      <button
        v-else-if="likes.length > 0 && info.UID === store.currentUserUid"
        class="feed-card-button button-hover"
      >
        <likeIcon class="margin-right likeIcon" />{{ likes.length }}
      </button>
      <div class="likesHover" v-for="(user, index) in likes" :key="index">
        {{ likeUsernames.join(", ") }}
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
  name: "feedCardQuote",
  props: ["info"],
  components: {
    likeIcon,
    cancelIcon,
  },
  mounted() {
    this.getUserData();
    this.getLikes();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getCurrentUserData();
      }
    });
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
      const user = firebase.auth().currentUser;
      db.collection("users")
        .doc(this.info.UID)
        .collection("like-notifications")
        .doc(user.uid)
        .set({
          notificationType: "quote",
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
  data() {
    return {
      username: "",
      profilePic: "",
      store,
      likes: [],
      likeUIDs: [],
      likeUsernames: [],
      currentUID: null,
      currentUserUsername: "",
    };
  },
};
</script>

<style scoped>
.quote-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}

.margin-right {
  margin-right: 3px;
}

.container-feed-card {
  width: 100%;
  margin-bottom: 55px;
  padding: 25px;
  background-color: #15161a;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
}

.container-feed-card-author {
  color: #fff;
  margin-top: 25px;
  margin-bottom: 10px;
}

.container-feed-card-author h6 {
  font-size: 14px;
  font-weight: 100;
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

@media screen and (max-width: 380px) {
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

  .container-feed-card-head-msg {
    width: 80% !important;
  }

  .container-feed-card-head-msg h5 {
    font-size: 15px !important;
  }

  .container-feed-card-author h6 {
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
  margin-top: 15px;
}

h5 {
  font-size: 25px;
  font-weight: 100;
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

.cancelIconStyle {
  width: 7px !important;
  cursor: pointer;
  margin-bottom: 25px !important;
}
</style>
