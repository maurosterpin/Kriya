<template>
  <div class="notificationCard-wrapper">
    <div
      v-if="
        info.notificationType === 'goal' ||
          info.notificationType === 'to-do list'
      "
      class="likeNotificationCard"
    >
      <img :src="profilePic" class="profilePic" />{{ username }} congratulates
      you on a completed {{ info.notificationType }}!
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
  props: ["info"],
  data() {
    return {
      username: "",
      profilePic: "",
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      db.collection("users")
        .doc(this.info.notificationUID)
        .get()
        .then((doc) => {
          this.username = doc.data().username;
          this.profilePic = doc.data().profilePic;
        });
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
