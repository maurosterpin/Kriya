<template>
  <div class="direct-messages-wrapper">
    <div class="contacts">
      <UserContactCard />
    </div>

    <div class="direct-messages">
      <div class="messages">
        <Message
          v-for="message in messages"
          :key="message.key"
          :info="message"
        />
      </div>

      <div class="input">
        <input
          v-model="messageText"
          class="public-chat-input"
          type="text"
          placeholder="Send message..."
        />
        <sendIcon class="send-icon" @click="sendMessage" />
      </div>
    </div>
  </div>
</template>

<script>
import sendIcon from "../assets/Icons/send-icon.svg";
import Message from "../components/Message.vue";
import UserContactCard from "../components/UserContactCard.vue";
import { db } from "@/firebase";
import firebase from "@/firebase";

export default {
  name: "DirectMessages",
  data() {
    return {
      messages: [],
      messageText: "",
    };
  },
  components: {
    sendIcon,
    Message,
    UserContactCard,
  },
  mounted() {
    this.getMessages();
  },
  methods: {
    getContacts() {
      console.log("Getting contacts");
    },
    sendMessage() {
      if (this.messageText != "") {
        console.log("Sending message");
        // Get current user
        const user = firebase.auth().currentUser;
        // Prepare messages for firestore update
        console.log("Pushing messages");
        this.messages.push({
          UID: user.uid,
          Message: this.messageText,
          Date: Date.now(),
        });
        console.log("Messages pushed");
        // Set doc id
        console.log("Setting docID");

        console.log("docID set");
        // Update direct-messages firestore collection
        console.log("Updating direct-messages collection");
        db.collection("direct-messages")
          .doc("test")
          .set({
            Messages: this.messages,
            Date: Date.now(),
          });
        console.log("Database set");
        // Set up contact for current user
        const contactForCurrentUser = db
          .collection("users")
          .doc(user.uid)
          .collection("contacts")
          .doc("P2mOjgdJ99O8rSMIyaPcpq2daHE2");

        contactForCurrentUser.get().then((doc) => {
          if (!doc.exists) {
            console.log("Contact being added");
            contactForCurrentUser.set({ messagesID: "test" });
          } else {
            console.log("Contact for current user already created");
          }
        });

        // Set up contact for other user
        const contactForOtherUser = db
          .collection("users")
          .doc("P2mOjgdJ99O8rSMIyaPcpq2daHE2")
          .collection("contacts")
          .doc(user.uid);

        contactForOtherUser.get().then((doc) => {
          if (!doc.exists) {
            console.log("Contact being added");
            contactForOtherUser.set({ messagesID: "test" });
          } else {
            console.log("Contact for other user already created");
          }

          setTimeout(() => {
            this.getMessages();
          }, 50);
        });
      } else {
        console.log("Unable to send empty message");
      }
    },
    getMessages() {
      console.log("Getting messages");
      db.collection("direct-messages")
        .doc("test")
        .get()
        .then((doc) => {
          this.messages = [];
          if (doc.exists) {
            this.messages = doc.data().Messages;
          }
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

.contacts {
  display: flex;
  flex-direction: column;
  margin-left: 170px;
  position: relative;
  align-items: center;
  width: 500px;
}

.messages {
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 25px;
  height: 797px;
  width: 1000px;
}

@media screen and (max-width: 1700px) {
  .contacts {
    margin-left: 40px;
  }
}

@media screen and (max-width: 1390px) {
  .messages {
    width: 700px;
  }
}

@media screen and (max-width: 1100px) {
  .messages {
    width: 500px;
  }
}
</style>
