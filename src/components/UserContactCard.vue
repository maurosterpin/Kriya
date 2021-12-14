<template>
  <div
    class="contact"
    @click="$parent.chooseContact(info.UID, info.messagesID)"
  >
    <div class="contact-head">
      <avatar class="contact-user-icon" />
      <div class="contact-head-txt">
        <h6>{{ username }}</h6>
        <h6>just now</h6>
      </div>
      <div class="contact-body"></div>
    </div>
  </div>
</template>

<script>
import avatar from "../assets/Icons/avatar.svg";
import { db } from "@/firebase";

export default {
  data() {
    return {
      username: "",
    };
  },
  components: {
    avatar,
  },
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
        });
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

.contact {
  cursor: pointer;
  max-width: 600px;
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
</style>
