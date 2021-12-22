<template>
  <div class="notificationCard-wrapper">
    <router-link v-if="!likeInfo" to="/direct-messages" class="link"
      ><div class="notificationCard">
        <img :src="profilePic" class="profilePic" />{{ username }}
        sent you a message
      </div>
    </router-link>
    <div
      v-else-if="
        likeInfo.notificationType === 'goal' ||
          likeInfo.notificationType === 'to-do list'
      "
      class="likeNotificationCard"
    >
      <img :src="profilePic" class="profilePic" />{{ username }} congratulates
      you on a completed {{ likeInfo.notificationType }}!
    </div>
    <div v-else class="likeNotificationCard">
      <img :src="profilePic" class="profilePic" />{{ username }} liked the quote
      you posted!
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
export default {
  name: "NotificationCard",
  props: ["info", "likeInfo"],
  data() {
    return {
      username: "",
      profilePic: "",
    };
  },
  mounted() {
    console.log("TEST NOTIFICATION TYPE", this.notificationType);
    this.getUserData();
  },
  methods: {
    getUserData() {
      if (this.likeInfo) {
        db.collection("users")
          .doc(this.likeInfo.notificationUID)
          .get()
          .then((doc) => {
            this.username = doc.data().username;
            this.profilePic = doc.data().profilePic;
          });
      } else {
        db.collection("users")
          .doc(this.info.notificationUID)
          .get()
          .then((doc) => {
            this.username = doc.data().username;
            this.profilePic = doc.data().profilePic;
          });
      }
    },
  },
};
</script>

<style scoped>
.notificationCard {
  padding: 0px 10px;
  width: 280px;
  height: 50px;
  background: #fff;
  border-top: 1px solid rgb(216, 216, 216);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.likeNotificationCard {
  padding: 0px 10px;
  width: 280px;
  height: 50px;
  background: #fff;
  border-top: 1px solid rgb(216, 216, 216);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.link {
  color: black;
  text-decoration: none;
  font-weight: 500;
}

.profilePic {
  width: 35px;
  border-radius: 100px;
  margin-right: 7px;
}
</style>
