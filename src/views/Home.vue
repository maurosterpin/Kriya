<template>
  <div class="home-wrapper">
    <div class="home">
      <div class="feed-wrapper">
        <div class="feed">
          <FeedCard
            v-for="card in posts"
            :key="card.name"
            :info="card"
            :listType="card.ListType"
          />
        </div>
      </div>
      <div class="public-chat-relative">
        <div class="public-chat">
          <h6 class="public-chat-h5">general</h6>
          <div class="messages">
            <div class="messages-space">
              <Message /><Message /><Message /><Message /><Message />
            </div>
          </div>
          <div class="input">
            <input
              class="public-chat-input"
              type="text"
              placeholder="Send message..."
            />
            <sendIcon class="send-icon" />
          </div>
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import FeedCard from "../components/FeedCard.vue";
import Message from "../components/Message.vue";
import sendIcon from "../assets/Icons/send-icon.svg";
import { db } from "@/firebase";
import firebase from "@/firebase";
export default {
  name: "Home",
  components: {
    sendIcon,
    Message,
    FeedCard,
  },
  data() {
    return {
      store,
      posts: [],
    };
  },
  created() {},
  mounted() {
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
            const UIDtest = user.uid;
            dataBase.set({
              username: store.displayName,
              profilePic: store.profilePic,
              uid: UIDtest,
            });
            console.log("User added!");
          }
        });
    }
    if (this.store.quoteText == "") {
      store.quoteExist = true;
      this.getQuote();
    }
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
        });
    },
    getPosts() {
      db.collection("posts")
        .orderBy("Date", "desc")
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
            });
          });
        });
    },
  },
  watch: {},
};
</script>

<style lang="scss">
/* width */
body::-webkit-scrollbar {
  width: 0px;
}

.home {
  font-size: 14px;
  background-color: #39c75a;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow: hidden !important;
}

.feed-wrapper {
  max-width: 800px;
  display: flex;
  overflow: auto;
  height: 91.9vh;
  padding: 0 45px;
}

.feed-wrapper::-webkit-scrollbar {
  width: 0px;
}

.feed {
  margin: 5px auto;
  padding: 25px 0px;
  width: 370px;
}

.public-chat-relative {
  width: 1000px;
  position: relative;
  float: right;
}

.public-chat {
  right: 45px;
  position: fixed;
  background-color: #39c75a;
  max-width: 1000px;
  width: 100%;
  margin-left: 0px;
  padding: 30px 0px;
  border-radius: 50px;
  color: #fff;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media screen and (max-width: 1460px) {
  .public-chat {
    max-width: 800px;
  }

  .public-chat-relative {
    max-width: 800px;
  }
}

@media screen and (max-width: 1260px) {
  .public-chat {
    max-width: 600px;
  }

  .public-chat-relative {
    max-width: 600px;
  }
}

@media screen and (max-width: 1060px) {
  .public-chat {
    max-width: 500px;
  }

  .public-chat-relative {
    max-width: 500px;
  }
}

@media screen and (max-width: 960px) {
  .public-chat {
    max-width: 0px;
  }

  .public-chat-relative {
    max-width: 0px;
  }
}

@media screen and (max-width: 460px) {
  .feed-wrapper {
    padding: 0px;
  }
}

.messages {
  height: 710px;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
}

.messages-space {
  padding: 0px 20px;
}

/* width */
::-webkit-scrollbar {
  width: 7px;
  height: 6px;
  background-color: #30a84c;
}

/* Track */
::-webkit-scrollbar-track {
  background: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #1e1f24;
  border-radius: 50px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #2e3036;
}

.input {
  display: flex;
  flex-direction: row;
  justify-content: right;
  max-width: 100%;
}

.public-chat-h5 {
  margin-bottom: 25px;
  padding: 15px 25px;
  background-color: #141518;
  border-radius: 25px;
}

.public-chat-input {
  outline: none;
  border: none;
  border-bottom: 1px solid #141518;
  border-radius: 25px;
  padding: 15px 25px !important;
  width: 100%;
}

.send-icon {
  fill: #fff;
  width: 15px;
  cursor: pointer;
  position: absolute;
  margin-top: 20px;
  margin-right: 25px;
}
</style>
