<template>
  <div class="direct-messages-wrapper">
    <div class="contacts">
      <div class="search-container">
        <input
          v-model="searchText"
          class="findContactsSearch"
          :class="{ 'border-bottom-radius-none': cUsersLength }"
          type="text"
          placeholder="Find users"
        />
        <div v-if="searchText != ''" class="searchDropdown">
          <UserSearchContactCard
            v-for="card in cUsers"
            :key="card.Username"
            :test="card"
          />
        </div>
      </div>
      <UserContactCard
        v-for="contact in loadedContacts"
        :key="contact.key"
        :info="contact"
      />
    </div>
    <div class="noMessageScreen" v-if="contacts.length < 1">
      <h6 class="illustrationTitle">
        There is nothing here
      </h6>
      <illustration v-if="contacts.length < 1" class="illustration" />
    </div>
    <div
      class="chooseContactIllustration"
      v-if="chosenDmId == '' && contacts.length > 0"
    >
      <h6 class="illustrationTitle">
        Choose a contact to see messages
      </h6>
      <illustration class="illustration" />
    </div>

    <div
      class="direct-messages"
      v-else-if="chosenDmId != '' && contacts.length > 0"
    >
      <div class="messages">
        <Message
          v-for="message in loadedMessages"
          :key="message.key"
          :info="message"
        />
      </div>

      <div v-if="contacts.length > 0" class="input">
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
import UserSearchContactCard from "@/components/UserSearchContactCard.vue";

export default {
  name: "DirectMessages",
  data() {
    return {
      messages: [],
      loadedMessages: [],
      messageText: "",
      contacts: [],
      LatestDmId: "",
      receiverUID: "",
      chosenDmId: "",
      users: [],
      searchText: "",
      loadedContacts: [],
      imageUrl: null,
    };
  },
  components: {
    sendIcon,
    Message,
    UserContactCard,
    illustration,
    UserSearchContactCard,
  },
  mounted() {
    setTimeout(() => {
      this.getUsers();
      this.getLatestContactId();
      this.getContacts();
    }, 200);
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
        })
        .then(() => {
          this.loadedContacts = this.contacts;
        });
    },
    chooseContact(UID, messagesID) {
      this.chosenDmId = "";
      this.receiverUID = "";
      this.chosenDmId = messagesID;
      this.receiverUID = UID;
      let temp = "";
      temp += this.chosenDmId;
      console.log("Setting up real-time listener");
      db.collection("direct-messages")
        .doc(temp)
        .onSnapshot(() => {
          setTimeout(() => {
            this.getMessages();
          }, 100);
        });
    },
    createContact(UID) {
      console.log("createContact");
      // Get current user
      const user = firebase.auth().currentUser;
      // Set up contact for current user
      const contactForCurrentUser = db
        .collection("users")
        .doc(user.uid)
        .collection("contacts")
        .doc(UID);

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
        .doc(UID)
        .collection("contacts")
        .doc(user.uid);

      contactForOtherUser
        .get()
        .then((doc) => {
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
        })
        .then(() => {
          this.getContacts();
          this.searchText = "";
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
        let temp = "";
        temp += this.chosenDmId;
        console.log("MESSGE TEXT", this.messageText);

        // Update direct-messages firestore collection
        console.log("Updating direct-messages collection");
        db.collection("direct-messages")
          .doc(temp)
          .set({
            Messages: this.messages,
            Date: Date.now(),
          });
        console.log("Database set");

        /*setTimeout(() => {
          this.getMessages();
        }, 10);*/
      } else {
        console.log("Unable to send empty message");
      }
    },
    getMessages() {
      let temp = "";
      temp += this.chosenDmId;
      console.log("Getting messages");
      db.collection("direct-messages")
        .doc(temp)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.messages = [];

            this.messages = doc.data().Messages;
          } else {
            this.messages = [];
          }
        })
        .then(() => {
          this.messages.sort((a, b) =>
            a.Date > b.Date ? 1 : b.Date > a.Date ? -1 : 0
          );
          this.loadedMessages = [];
        })
        .then(() => {
          this.loadedMessages = this.messages.reverse();
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
    getUsers() {
      db.collection("users")
        .get()
        .then((query) => {
          this.users = [];
          query.forEach((doc) => {
            const data = doc.data();
            this.users.push({
              Username: data.username,
              ProfilePic: data.profilePic,
              UID: data.uid,
            });
          });
        });
    },
  },
  computed: {
    cUsers() {
      return this.users.filter((user) =>
        user.Username.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
    cUsersLength() {
      if (this.cUsers.length > 0 && this.searchText != "") {
        return true;
      } else {
        return false;
      }
    },
    cMessages() {
      return this.messages;
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

.search-container {
  position: relative;
  padding: 0px;
  margin-bottom: 40px;
}

.searchDropdown {
  max-width: 350px;
  max-height: 300px;
  position: absolute;
  margin-right: 38px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden !important;
}

.chooseContactIllustration {
  margin: auto;
  margin-right: 600px;
}

.noMessageScreen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 7.9%;
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
  height: 45px;
  border-radius: 10px;

  border: none;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  margin-bottom: 0px;
}

.border-bottom-radius-none {
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
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
