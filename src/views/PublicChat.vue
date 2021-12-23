<template>
  <div class="public-chat-home">
    <div class="public-chat-wrapper2">
      <div class="public-chat-relative2">
        <div class="public-chat2">
          <h6 class="public-chat-h6">public chat</h6>
          <div class="messages3">
            <div class="messages-space">
              <Message
                v-for="message in publicChat"
                :key="message.Date"
                :info="message"
              />
            </div>
          </div>
          <div class="input2">
            <input
              v-model="messageText"
              class="public-chat-input-2"
              type="text"
              placeholder="Send message..."
            />
            <sendIcon class="send-icon2" @click="sendPublicChatMessage" />
          </div>
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
.public-chat-home {
  height: 92.8vh;
  background-color: #39c75a !important;
}

.public-chat-wrapper2 {
  background-color: #39c75a !important;
  height: 891px;
  overflow: hidden;
}

.input2 {
  width: 90vw;
}

.public-chat2 {
  margin: auto;
  position: relative;
  background-color: #39c75a;
  width: 100%;
  padding: 30px 0px;
  border-radius: 50px;
  color: #fff;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.public-chat-input-2 {
  outline: none;
  border: none;
  border-bottom: 1px solid #141518;
  border-radius: 25px;
  padding: 15px 25px !important;
  width: 90vw;
}

.public-chat-h6 {
  margin-bottom: 12px;
  padding: 15px 25px;
  background-color: #141518;
  border-radius: 25px;
  width: 90vw;
}

.send-icon2 {
  fill: #fff;
  width: 13px;
  cursor: pointer;
  position: absolute;
  right: 57px;
  margin-top: 20px;
}

.messages3 {
  display: flex;
  flex-direction: column-reverse;
  width: 93vw;
  height: 670px;
  overflow-y: auto;
}

.input2 {
  margin-top: 15px;
}

@media screen and (max-height: 812px) {
  .public-chat-wrapper2 {
    height: 734px !important;
  }
  .messages3 {
    height: 500px;
  }
}

@media screen and (max-height: 736px) {
  .public-chat-wrapper2 {
    height: 658px !important;
  }
  .messages3 {
    height: 430px;
  }
}

@media screen and (max-height: 668px) {
  .public-chat-wrapper2 {
    height: 589px !important;
  }
  .messages3 {
    height: 370px !important;
  }
}

@media screen and (max-height: 568px) {
  .public-chat-wrapper2 {
    height: 490px !important;
  }
  .public-chat2 {
    height: 500px !important;
  }
}

@media screen and (max-width: 36  0px) {
  .messages3::-webkit-scrollbar {
    width: 0px !important;
  }
}
</style>
