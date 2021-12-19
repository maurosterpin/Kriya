<template>
  <div class="public-chat-wrapper">
    <div class="public-chat-relative">
      <div class="public-chat">
        <h6 class="public-chat-h5">public chat</h6>
        <div class="messages">
          <div class="messages-space">
            <Message
              v-for="message in publicChat"
              :key="message.Date"
              :info="message"
            />
          </div>
        </div>
        <div class="input">
          <input
            v-model="messageText"
            class="public-chat-input"
            type="text"
            placeholder="Send message..."
          />
          <sendIcon class="send-icon" @click="sendPublicChatMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import Message from "../components/Message.vue";
import sendIcon from "../assets/Icons/send-icon.svg";
import { db } from "@/firebase";
import firebase from "@/firebase";
import router from "@/router";
export default {
  name: "Home",
  components: {
    sendIcon,
    Message,
  },
  data() {
    return {
      store,
      posts: [],
      chatMessages: [],
      messageText: null,
      publicChat: [],
      defaultProfilePicture: null,
    };
  },
  mounted() {
    if (window.innerWidth > 960) {
      router.push({
        name: "Home",
      });
    } else {
      window.addEventListener("resize", this.routerPush);
    }
    setTimeout(() => {
      this.getDefaultProfilePicture();
      db.collection("public-chat").onSnapshot(() => {
        this.getPublicChatMessages();
      });

      this.getPosts();
      if (this.store.logged) {
        const user = firebase.auth().currentUser;
        this.store.currentUserUid = user.uid;
        console.log(this.store.currentUserUid);
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            // Check if user exists
            if (doc.exists) {
              store.displayName = doc.data().username;
              store.profilePic = doc.data().profilePic;
              // Else create a new user
            } else {
              const dataBase = db.collection("users").doc(user.uid);
              dataBase.set({
                username: store.displayName,
                profilePic: this.defaultProfilePicture,
                uid: user.uid,
              });
              console.log("User added!");
            }
          });
      }
      if (this.store.quoteText == "") {
        store.quoteExist = true;
        this.getQuote();
      }
    }, 300);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.routerPush);
  },

  methods: {
    getQuote() {
      console.log("getQuote");
      // Get current user
      const user = firebase.auth().currentUser;
      // Get quote from user firestore collection
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          store.quoteText = doc.data().Quote;
          store.quoteAuthor = doc.data().Author;
          store.currentUserUid = user.uid;
        });
    },
    routerPush() {
      if (window.innerWidth > 960) {
        window.removeEventListener("resize", this.routerPush);
        router.push({
          name: "Home",
        });
      }
    },
    getPosts() {
      db.collection("posts")
        .orderBy("CompletionDate", "desc")
        .get()
        .then((query) => {
          this.posts = [];
          query.forEach((doc) => {
            const data = doc.data();
            this.posts.push({
              Tasks: data.Tasks,
              ListType: data.ListType,
              Date: data.Date,
              Completed: data.Completed,
              CompletionDate: data.CompletionDate,
              UID: data.UID,
              Quote: data.Quote,
              Author: data.Author,
              Color: "#15161a !important",
            });
          });
        });
    },
    sendPublicChatMessage() {
      console.log("sendPublicChatMessage");
      if (this.messageText != "") {
        // Get current user
        const user = firebase.auth().currentUser;
        // Add quote to user firestore collection
        const dataBase = db.collection("public-chat");

        dataBase.add({
          Message: this.messageText,
          UID: user.uid,
          Date: Date.now(),
        });
        this.messageText = "";
      } else {
        console.log("Unable to send empty message");
      }
    },
    getDefaultProfilePicture() {
      db.collection("default")
        .doc("defaultProfilePicture")
        .get()
        .then((doc) => {
          this.defaultProfilePicture = doc.data().profilePic;
        });
    },
    getPublicChatMessages() {
      console.log("getPublicChatMessages");
      db.collection("public-chat")
        .orderBy("Date", "asc")
        .get()
        .then((query) => {
          this.publicChat = [];
          query.forEach((doc) => {
            const data = doc.data();
            this.publicChat.push({
              Message: data.Message,
              Date: data.Date,
              UID: data.UID,
            });
          });
        });
    },
  },
  watch: {},
};
</script>

<style scoped>
.public-chat-wrapper {
  background-color: #39c75a !important;
  height: 891px;
  overflow: hidden;
}

@media screen and (max-width: 960px) {
  .public-chat-relative {
    width: 1000px;
    position: relative;
  }

  .public-chat {
    margin: auto;
    position: fixed;
    background-color: #39c75a;
    max-width: 770px;
    width: 100%;
    left: 25px;
    padding: 30px 0px;
    border-radius: 50px;
    color: #fff;
    box-shadow: 4px 4px 15px rgba(0, 0, 0, 0);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
@media screen and (max-width: 830px) {
  .public-chat {
    max-width: 600px;
  }
}
@media screen and (max-width: 660px) {
  .public-chat {
    max-width: 500px;
  }
}
@media screen and (max-width: 560px) {
  .public-chat {
    max-width: 400px;
  }
}
@media screen and (max-width: 460px) {
  .public-chat {
    max-width: 300px;
  }

  .messages::-webkit-scrollbar {
    width: 0px;
  }
}
@media screen and (max-width: 355px) {
  .public-chat {
    max-width: 250px;
  }
}

@media screen and (max-width: 297px) {
  .public-chat {
    left: 20px;
  }
}

@media screen and (max-width: 287px) {
  .public-chat {
    left: 15px;
  }
}

@media screen and (max-width: 280px) {
  .public-chat {
    left: 5px;
  }
  .public-chat-input {
    outline: none;
    border: none;
    border-bottom: 1px solid #141518;
    border-radius: 25px;
    padding: 12px 20px !important;
    width: 80%;
    margin: auto;
    margin-top: 10px;
  }
  .public-chat-input::placeholder {
    font-size: 13px !important;
  }

  .public-chat-h5 {
    padding: 10px 20px;
    background-color: #141518;
    border-radius: 25px;
    width: 80%;
    margin: auto;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .send-icon {
    fill: #fff;
    width: 13px;
    cursor: pointer;
    position: absolute;
    margin-top: 18px;
    margin-right: 47px;
  }
}

@media screen and (max-width: 256px) {
  .public-chat {
    left: 0px;
  }
}
</style>
