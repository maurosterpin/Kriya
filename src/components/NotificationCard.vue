<template>
  <div class="notificationCard-wrapper">
    <router-link to="/direct-messages" class="link"
      ><div class="notificationCard">
        <img :src="profilePic" class="profilePic" />{{ username }}
        sent you a message
      </div>
    </router-link>
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
    console.log("TEST!!!", this.info.notificationUID);
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
