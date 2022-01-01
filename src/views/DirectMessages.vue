<template>
  <div class="direct-messages-home">
    <div
      class="direct-messages-wrapper"
      :class="{ 'justify-content-center': chosenDmMobile }"
    >
      <div
        class="contacts"
        :class="{ 'margin-auto': cWindowWidth, 'display-none': chosenDmMobile }"
      >
        <div class="search-container">
          <transition name="list2" appear>
            <input
              v-model="searchText"
              class="findContactsSearch"
              :class="{ 'border-bottom-radius-none': cUsersLength }"
              type="text"
              placeholder="Find new users"
            />
          </transition>
          <transition-group
            name="list2"
            appear
            v-if="searchText != ''"
            class="searchDropdown"
          >
            <UserSearchContactCard
              v-for="card in cUsers"
              :key="card.Username"
              :test="card"
            />
          </transition-group>
        </div>
        <!--div class="contactCards"-->
        <transition-group tag="div" class="innerDiv" name="list2" appear>
          <UserContactCard
            v-for="contact in cLoadedContacts"
            :key="contact.messagesID"
            :info="contact"
          />
        </transition-group>
        <div class="contacts-illustration">
          <h6
            v-if="windowWidth <= 900 && contacts.length > 0"
            class="illustrationTitle"
          >
            Choose a contact to see messages
          </h6>
          <h6
            v-else-if="windowWidth <= 900 && contacts.length < 1"
            class="illustrationTitle"
          >
            There is nothing here
          </h6>
          <illustration v-if="windowWidth <= 900" class="illustration" />
        </div>
      </div>
      <div
        class="noMessageScreen"
        v-if="contacts.length < 1 && windowWidth > 900"
      >
        <h6 class="illustrationTitle">
          There is nothing here
        </h6>
        <illustration
          v-if="contacts.length < 1 && windowWidth > 900"
          class="illustration"
        />
      </div>
      <div
        class="chooseContactIllustration"
        v-if="chosenDmId == '' && contacts.length > 0 && windowWidth > 900"
      >
        <div class="margin-right-illustration">
          <transition name="list2" appear>
            <h6 class="illustrationTitle">
              Choose a contact to see messages
            </h6>
          </transition>
          <transition name="list2" appear>
            <illustration class="illustration" />
          </transition>
        </div>
      </div>

      <div
        class="direct-messages"
        v-else-if="chosenDmId != '' && contacts.length > 0"
      >
        <div class="collapse-icon">
          <singleArrow
            v-if="windowWidth < 900"
            class="doubleArrow"
            @click="hideMessages"
          />
        </div>
        <transition-group tag="div" name="list2" appear class="messages2">
          <Message
            v-for="message in messages"
            :key="message.Date"
            :info="message"
          />
        </transition-group>

        <div
          v-if="contacts.length > 0"
          class="input"
          @keyup.enter="sendMessage"
        >
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
import singleArrow from "../assets/Icons/single-arrow-left.svg";
import router from "@/router";

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
      windowWidth: window.innerWidth,
      notificationCount: [],
    };
  },
  components: {
    sendIcon,
    Message,
    UserContactCard,
    illustration,
    UserSearchContactCard,
    singleArrow,
  },
  mounted() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        router.push({
          name: "Login",
        });
      }
    });
    window.removeEventListener("resize", this.routerPush);
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    });
    this.getNotificationCount();
    this.getUsers();
    this.getLatestContactId();
    this.getContacts();
    this.getNotificationCount();
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
              notification: data.notification,
            });
          });
        })
        .then(() => {
          this.loadedContacts = [];
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
        .collection("messages")
        .onSnapshot(() => {
          this.removeNotification();
          this.getMessages();
        });
    },
    removeNotification() {
      const user = firebase.auth().currentUser;

      db.collection("users")
        .doc(user.uid)
        .collection("contacts")
        .doc(this.receiverUID)
        .update({
          notification: false,
        })

        .then(this.getNotificationCount())
        .then(this.getContacts());
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
          contactForCurrentUser
            .set({
              messagesID: this.LatestDmId,
              notifications: false,
            })
            .then(
              setTimeout(() => {
                this.getContacts();
              }),
              300
            );
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
        let temp = "";
        temp += this.chosenDmId;
        console.log("MESSAGE TEXT", this.messageText);

        // Update direct-messages firestore collection
        console.log("Updating direct-messages collection");
        db.collection("direct-messages")
          .doc(temp)
          .collection("messages")
          .add({
            Message: this.messageText,
            Date: Date.now(),
            UID: user.uid,
          });
        console.log("Database set");
        this.messageText = "";

        // Send notification to user
        console.log("Sending notification");
        db.collection("users")
          .doc(this.receiverUID)
          .collection("contacts")
          .doc(user.uid)
          .get()
          .then(() => {
            db.collection("users")
              .doc(this.receiverUID)
              .collection("contacts")
              .doc(user.uid)
              .update({
                notification: true,
                Date: Date.now(),
              });
          });
        /*setTimeout(() => {
          this.getMessages();
        }, 10);*/
      } else {
        console.log("Unable to send empty message");
      }
    },
    getNotificationCount() {
      this.notifications = [];
      console.log("Getting notifications");
      const user = firebase.auth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .collection("notifications")
        .get()
        .then((query) => {
          query.forEach((doc) => {
            const data = doc.data();
            this.notificationCount.push({
              notification: data.notification,
              notificationUID: doc.id,
            });
          });
        });
    },
    getMessages() {
      let temp = "";
      temp += this.chosenDmId;
      console.log("Getting messages");
      db.collection("direct-messages")
        .doc(temp)
        .collection("messages")
        .orderBy("Date", "desc")
        .get()
        .then((query) => {
          this.messages = [];
          query.forEach((doc) => {
            const data = doc.data();
            this.messages.push({
              Message: data.Message,
              Date: data.Date,
              UID: data.UID,
              docID: doc.id,
              parentDocID: temp,
            });
          });
        });
      //   if (doc.exists) {
      //     this.messages = [];

      //     this.messages = doc.data().Messages;
      //   } else {
      //     this.messages = [];
      //   }
      // })
      // .then(() => {
      //   this.messages.sort((a, b) =>
      //     a.Date > b.Date ? 1 : b.Date > a.Date ? -1 : 0
      //   );
      //   this.loadedMessages = [];
      // })
      // .then(() => {
      //   this.loadedMessages = this.messages.reverse();
      // });
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
    hideMessages() {
      this.chosenDmId = "";
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
    chosenDmMobile() {
      if (this.chosenDmId != "" && this.windowWidth <= 900) {
        return true;
      } else {
        return false;
      }
    },
    cWindowWidth() {
      if (this.windowWidth <= 900) {
        return true;
      } else {
        return false;
      }
    },
    cMessages() {
      return this.messages;
    },
    cLoadedContacts() {
      return this.loadedContacts;
    },
  },
};
</script>

<style scoped>
.direct-messages-home {
  height: 92.8vh;
  background-color: #39c75a !important;
}

.direct-messages-wrapper {
  background-color: #39c75a !important;
  display: flex;
  position: relative;
  flex-direction: row;
  height: 891px;
  overflow: hidden;
}

.search-container {
  position: relative;
  padding: 0px;
  margin-bottom: 40px;
}

.margin-auto {
  margin-left: auto !important;
  margin-right: auto !important;
}

.doubleArrow {
  fill: #fff;
  width: 38px;
  padding: 0.75em;
  margin-bottom: 20px;
  margin-left: 20px !important;
  position: fixed;
  top: 90px;
  left: -13px;
  display: flex;
  z-index: 50;
}

.display-none {
  display: none !important;
}

.justify-content-center {
  justify-content: center;
}

.mobile-height {
  max-height: 450px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
}

.margin-right-illustration {
  margin-right: 100px;
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
  margin-top: 27px;
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
  transition: all 1s ease;
}

.contactCards {
  overflow-y: auto !important;
  padding: 10px 55px;
  width: 450px;
}

.contactCards::-webkit-scrollbar {
  width: 0px;
}

.contacts {
  display: flex;
  flex-direction: column;
  margin-left: 170px;
  position: relative;
  align-items: center;
  padding: 0px 20px;
  width: 410px;
  pointer-events: auto;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

.innerDiv {
  width: 95%;
  margin-left: 2px;
}

.contacts::-webkit-scrollbar {
  width: 0px;
}

.messages2 {
  display: flex;
  position: relative;
  flex-direction: column-reverse;
  padding: 0px 25px;
  margin-top: 25px;
  width: 1000px;
  height: 751px;
  overflow-y: auto;
  overflow-x: hidden;
}

.illustrationTitle {
  text-align: center;
}

.direct-messages {
  padding-bottom: 25px !important;
}

@media screen and (min-width: 1900px) {
  .contacts {
    margin-left: 235px !important;
  }
}

@media screen and (max-width: 1700px) {
  .contacts {
    margin-left: 110px;
  }

  /* .chooseContactIllustration {
    margin-right: 500px;
  } */
}
@media screen and (max-width: 1470px) {
  .contacts {
    margin-left: 50px;
  }
}

/*@media screen and (max-width: 1570px) {
  .chooseContactIllustration {
    margin-right: 400px;
  }
}

@media screen and (max-width: 1400px) {
  .chooseContactIllustration {
    margin-right: 350px;
  }
}*/

@media screen and (max-width: 1400px) {
  .messages2 {
    width: 900px;
  }
}

@media screen and (max-width: 1303px) {
  .messages2 {
    width: 800px;
  }
}

@media screen and (max-width: 1203px) {
  .messages2 {
    width: 700px;
  }
}

@media screen and (max-width: 1103px) {
  .messages2 {
    width: 600px;
  }
}

@media screen and (max-width: 1003px) {
  .messages2 {
    width: 500px;
  }
}

@media screen and (max-width: 450px) {
  .messages2 {
    /* max-height: 350px; */
    width: 300px;
  }

  /* .direct-messages-wrapper {
    height: 86.2vh !important;
  } */

  .messages2::-webkit-scrollbar {
    width: 0px;
  }

  .input {
    width: 250px;
    margin: auto;
    padding-top: 15px;
  }

  @media screen and (max-width: 380px) {
    .contacts {
      width: 292px;
    }
    .findContactsSearch {
      width: 250px;
    }
  }

  @media screen and (max-height: 812px) {
    .direct-messages-wrapper {
      height: 734px !important;
    }
    .messages2 {
      height: 600px;
    }
  }

  @media screen and (max-height: 736px) {
    .direct-messages-wrapper {
      height: 658px !important;
    }
    .messages2 {
      height: 500px;
    }
  }

  @media screen and (max-height: 708px) {
    .direct-messages-wrapper {
      height: 629px !important;
    }
    .messages2 {
      height: 475px;
    }
  }

  @media screen and (max-height: 668px) {
    .direct-messages-wrapper {
      height: 589px !important;
    }
    .messages2 {
      height: 450px;
    }
  }

  @media screen and (max-height: 568px) {
    .direct-messages-wrapper {
      height: 490px;
    }
  }
}

/* message transitions */
.list2-leave {
  opacity: 1;
  transform: scale(1);
}
.list2-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.list2-leave-active {
  transition: all 0.4s ease;
  position: absolute;
}

.list2-enter {
  opacity: 0;
  transform: scale(0.6);
}
.list2-enter-to {
  opacity: 1;
  transform: scale(1);
}
.list2-enter-active {
  transition: all 0.4s ease;
}

.list-move {
  transition: all 0.3s ease;
}
</style>
