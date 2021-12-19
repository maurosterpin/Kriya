<template>
  <div class="public-chat-msg">
    <div class="public-chat-msg-head" @click="visitProfile">
      <img :src="profilePic" alt="ProfilePicture" class="PfpImg" />{{
        username
      }}
      <span class="public-chat-msg-head-time">{{ postedFromNow }}</span>
    </div>
    <div class="public-chat-msg-body">
      {{ info.Message }}
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { db } from "@/firebase";
import firebase from "@/firebase";
import router from "@/router";
export default {
  data() {
    return {
      username: "",
      profilePic: null,
    };
  },
  name: "Message",
  props: ["info"],
  components: {},
  computed: {
    postedFromNow() {
      return moment(this.info.Date).fromNow();
    },
  },
  mounted() {
    this.getUserData();
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
}

.public-chat-msg-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 15px;
  cursor: pointer;
  margin-bottom: 5px;
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
