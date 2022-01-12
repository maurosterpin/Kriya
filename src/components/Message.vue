<template>
  <div class="public-chat-msg">
    <div class="public-chat-msg-head">
      <img
        @click="visitProfile"
        :src="profilePic"
        alt="ProfilePicture"
        class="PfpImg"
      />{{ username }}
      <span class="public-chat-msg-head-time">{{ postedFromNow }}</span>
      <optionsIcon class="optionsIcon" @click="moreOptions = !moreOptions" />
      <div class="moreOptionsDropdown" v-if="moreOptions">
        <ul>
          <li
            v-if="info.UID === currentUID"
            @click="moreOptions = !moreOptions"
          >
            Edit
          </li>
          <li @click="moreOptions = !moreOptions">Respond</li>
          <li v-if="info.UID === currentUID" @click="removePost">Delete</li>
        </ul>
      </div>
    </div>
    <div class="public-chat-msg-body">
      {{ info.Message }}
    </div>
  </div>
</template>

<script>
import optionsIcon from "../assets/Icons/more-options.svg";
import moment from "moment";
import { db } from "@/firebase";
import firebase from "@/firebase";
import router from "@/router";
export default {
  data() {
    return {
      username: "",
      profilePic: null,
      currentUID: null,
      moreOptions: false,
    };
  },
  name: "Message",
  props: ["info", "isPublic", "messagesID"],
  components: {
    optionsIcon,
  },
  computed: {
    postedFromNow() {
      return moment(this.info.Date).fromNow();
    },
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    removePost() {
      if (this.isPublic) {
        db.collection("public-chat")
          .doc(this.info.docID)
          .delete();
      } else {
        db.collection("direct-messages")
          .doc(this.info.parentDocID)
          .collection("messages")
          .doc(this.info.docID)
          .delete();
      }
    },
    getUserData() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          const user = firebase.auth().currentUser;
          this.currentUID = user.uid;
          db.collection("users")
            .doc(this.info.UID)
            .get()
            .then((doc) => {
              this.username = doc.data().username;
              this.profilePic = doc.data().profilePic;
            });
        } else {
          db.collection("users")
            .doc(this.info.UID)
            .get()
            .then((doc) => {
              this.username = doc.data().username;
              this.profilePic = doc.data().profilePic;
            });
        }
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
  },
};
</script>

<style scoped>
.public-chat-msg {
  max-width: 1000px;
  width: 100%;
  padding: 25px;
  border-radius: 25px;
  color: #fff;
  background-color: #141518;
  margin-bottom: 20px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.public-chat-msg:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 1);
}

.optionsIcon {
  width: 35px;
  position: absolute;
  right: -10px;
  top: -20px;
  transition: all 0.3s ease;
  border-radius: 50px;
}

.optionsIcon:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.moreOptionsDropdown {
  position: absolute;
  background-color: #141518;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.7);
  padding: 10px 0px 0px 0px;
  border-radius: 15px;
  font-size: 15px;
  width: 150px;
  right: -10px;
  top: 10px;
}

ul {
  margin-top: 5px;
  list-style-type: none;
}

li {
  transition: all 0.3s ease;
  padding: 5px 15px 5px 15px;
  border-radius: 5px;
}

li:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

li:last-child:hover {
  background-color: rgba(209, 13, 13, 0.795);
}

li:first-child:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.public-chat-msg-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 15px;
  cursor: pointer;
  margin-bottom: 5px;
  position: relative;
}

.PfpImg {
  width: 40px;
  height: 40px;
  border-radius: 100px;
  margin-right: 10px;
}

.user-icon {
  border-radius: 50%;
  width: 40px;
  margin-right: 12px;
}

.public-chat-msg-head-time {
  right: 0;
  margin-left: auto;
}

.public-chat-msg-body {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 15px;
  padding: 10px 20px;
}

.cancelIconStyle {
  width: 7px !important;
  cursor: pointer;
  margin-bottom: 25px !important;
}

@media screen and (max-width: 450px) {
  .PfpImg {
    width: 35px;
    height: 35px;
  }

  @media screen and (max-width: 280px) {
    .PfpImg {
      width: 30px;
      height: 30px;
    }

    .public-chat-msg-head-time {
      font-size: 10px !important;
    }

    .public-chat-msg-body {
      font-size: 12px !important;
    }
  }

  .public-chat-msg-body {
    font-size: 15px;
    padding: 5px 10px;
  }

  .public-chat-msg {
    padding: 22px;
  }

  .public-chat-msg-head {
    font-size: 13px;
  }

  .public-chat-msg-head-time {
    font-size: 12px;
  }
}
</style>
