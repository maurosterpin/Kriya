<template>
  <div class="direct-messages-wrapper">
    <div class="contacts">
      <input
        v-model="searchText"
        class="findContactsSearch"
        type="text"
        placeholder="Find users"
      />
      <UserContactCard
        v-for="contact in contacts"
        :key="contact.key"
        :info="contact"
      />
    </div>
    <h6 v-if="contacts.length < 1" class="illustrationTitle">
      There is nothing here
    </h6>
    <illustration v-if="contacts.length < 1" class="illustration" />
    <div class="chooseContactIllustration" v-else-if="chosenDmId == ''">
      <h6 class="illustrationTitle">
        Choose a contact to see messages
      </h6>
      <illustration class="illustration" />
    </div>

    <div class="direct-messages" v-else-if="chosenDmId != ''">
      <div class="messages">
        <Message
          v-for="message in messages.reverse()"
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
import illustration from "../assets/Icons/illustration-empty.svg";

export default {
  name: "DirectMessages",
  data() {
    return {
      messages: [],
      messageText: "",
      contacts: [],
      LatestDmId: "",
      receiverUID: "",
      chosenDmId: "",
    };
  },
  components: {
    sendIcon,
    Message,
    UserContactCard,
    illustration,
  },
  mounted() {
    this.getLatestContactId();
    this.getContacts();
    this.getMessages();
  },
  methods: {
    getContacts() {
      // Get current user
      const user = firebase.auth().currentUser;
      console.log("Getting contacts");
      db.collection("users")
        .doc(user.uid)
        .collection("contacts")
        .get()
        .then((query) => {
          this.contacts = [];
          query.forEach((doc) => {
            const data = doc.data();
            this.contacts.push({
              messagesID: data.messagesID,
              UID: doc.id,
            });
          });
        });
    },
    chooseContact(UID, messagesID) {
      console.log("chooseContact", UID);
      this.chosenDmId = messagesID;
      this.receiverUID = UID;
      this.getMessages();
    },
    createContact() {
      // Get current user
      const user = firebase.auth().currentUser;
      // Set up contact for current user
      const contactForCurrentUser = db
        .collection("users")
        .doc(user.uid)
        .collection("contacts")
        .doc(this.receiverUID);

      contactForCurrentUser.get().then((doc) => {
        if (!doc.exists) {
          console.log("Contact being added");
          contactForCurrentUser.set({ messagesID: this.LatestDmId });
        } else {
          console.log("Contact for current user already created");
        }
      });

      // Set up contact for other user
      const contactForOtherUser = db
        .collection("users")
        .doc(this.receiverUID)
        .collection("contacts")
        .doc(user.uid);

      contactForOtherUser.get().then((doc) => {
        if (!doc.exists) {
          console.log("Contact being added");
          contactForOtherUser.set({ messagesID: this.LatestDmId });
          let tempLatestId = parseInt(this.LatestDmId);
          tempLatestId += 1;
          db.collection("direct-messages")
            .doc("LatestDmId")
            .set({ LatestDmId: tempLatestId });
          this.getLatestContactId();
        } else {
          console.log("Contact for other user already created");
        }
      });
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
        this.messageText = "";

        // Update direct-messages firestore collection
        console.log("Updating direct-messages collection");
        db.collection("direct-messages")
          .doc(this.chosenDmId)
          .set({
            Messages: this.messages,
            Date: Date.now(),
          });
        console.log("Database set");

        setTimeout(() => {
          this.getMessages();
        }, 50);
      } else {
        console.log("Unable to send empty message");
      }
    },
    getMessages() {
      console.log("Getting messages");
      db.collection("direct-messages")
        .doc(this.chosenDmId)
        .get()
        .then((doc) => {
          this.messages = [];
          if (doc.exists) {
            this.messages = doc.data().Messages;
          }
        });
    },
    getLatestContactId() {
      console.log("gettingLatestContactId");
      db.collection("direct-messages")
        .doc("LatestDmId")
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.LatestDmId = doc.data().LatestDmId;
            parseInt(this.LatestDmId);
            console.log(this.LatestDmId);
          } else {
            this.LatestDmId = "1";
            parseInt(this.LatestDmId);
            console.log(this.LatestDmId);
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
  height: 891px;
}

.chooseContactIllustration {
  margin: auto;
  margin-right: 600px;
}

input:focus {
  outline: none !important;
}

input.findContactsSearch {
  padding: 15px !important;
}

.findContactsSearch {
  margin-top: 50px;
  width: 350px;
  height: 40px;
  border-radius: 10px;
  border: none;
  display: none;
}

.contacts {
  display: flex;
  flex-direction: column;
  margin-left: 170px;
  position: relative;
  align-items: center;
  width: 500px;
  pointer-events: auto;
}

.messages {
  display: flex;
  position: relative;
  flex-direction: column-reverse;
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
