<template>
  <div
    class="contact"
    @click="$parent.$parent.chooseContact(info.UID, info.messagesID)"
  >
    <div class="contact-head">
      <img :src="profilePic" alt="ProfilePicture" class="PfpImg" />
      <div class="contact-head-txt">
        <span v-if="info.notification" class="notification"></span>

        <h6 class="contacth6">{{ username }}</h6>
        <h6 class="contacth6">{{ postedFromNow }}</h6>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import moment from "moment";

export default {
  data() {
    return {
      username: "",
      profilePic: "",
    };
  },
  components: {},
  props: ["info"],
  name: "UserContactCard",
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
  },
  computed: {
    postedFromNow() {
      return moment(this.info.Date).fromNow();
    },
  },
};
</script>

<style scoped>
.direct-messages-wrapper {
  background-color: #39c75a !important;

  display: flex;
  position: relative;
  flex-direction: row;
}

.PfpImg {
  width: 40px;
  height: 40px;
  border-radius: 100px;
  margin-right: 10px;
}

.notification {
  width: 12px;
  height: 12px;
  background-color: red;
  border-radius: 100px;
  position: absolute;
  right: 0px;
  margin-top: 50px;
  margin-right: 30px !important;
}

.contact {
  cursor: pointer;
  max-width: 350px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 38px;
}

.direct-messages {
  display: flex;
  flex-direction: column;
}

.contact-head {
  padding: 15px;
  background-color: #141518;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  color: #fff;
  max-width: 350px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  width: 100%;
}

.contact-user-icon {
  width: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.contact-head-txt {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 5px;
}

.messages {
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 25px;
  height: 800px;
}

@media screen and (max-width: 380px) {
  .contact {
    max-width: 300px;
  }
  .notification {
    margin-right: 20px !important;
  }
  .contacth6 {
    font-size: 12px !important;
  }
}
</style>
