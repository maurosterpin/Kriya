<template>
  <div class="home-wrapper">
    <div class="home">
      <div class="feed-wrapper">
        <div class="feed">
          <div v-for="card in posts" :key="card.name">
            <transition name="list" appear>
              <FeedCard
                v-if="card.ListType"
                :info="card"
                :listType="card.ListType"
              />
            </transition>
            <transition name="list" appear>
              <FeedCardQuote v-if="card.Quote" :info="card" />
            </transition>
            <transition name="list" appear>
              <FeedCardGoal v-if="card.GoalName" :info="card" />
            </transition>
          </div>
        </div>
      </div>
      <div class="public-chat-relative">
        <div class="public-chat">
          <transition name="list" appear>
            <h6 v-if="!createNewRoom" class="public-chat-h5">
              {{ selectedRoom }}
            </h6>
            <input
              v-else
              placeholder="Type room name..."
              v-model="roomName"
              type="text"
              class="newRoomInput"
              id="roomInput"
            />
          </transition>
          <div v-if="createNewRoom" class="buttons">
            <transition name="list" appear>
              <div class="addRoomBtn" @click="addNewRoom">Add room</div>
            </transition>
            <transition name="list" appear>
              <div
                class="cancelAddRoomBtn"
                @click="createNewRoom = !createNewRoom"
              >
                Cancel
              </div>
            </transition>
          </div>
          <transition name="list" appear>
            <singleArrow
              v-if="!createNewRoom"
              class="singleArrow"
              :class="{ 'rotate-90': roomSelect }"
              @click="enableRoomSelect"
            />
          </transition>
          <transition name="list" appear>
            <div v-if="roomSelect" class="roomSelect">
              <ul>
                <li @click="createRoom">create new room +</li>
                <li
                  v-for="(item, index) in room"
                  :key="item"
                  @click="chooseRoom(room[index])"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </transition>
          <div class="messages">
            <transition-group
              tag="div"
              name="list"
              class="messages-space"
              appear
            >
              <Message
                v-on:respond="UpdateResponseData($event)"
                v-for="message in publicChat"
                :key="message.Date"
                :info="message"
                :isPublic="true"
                :room="selectedRoom"
              />
            </transition-group>
          </div>
          <transition name="list" appear>
            <div v-if="responding" class="respondingWindow">
              Replying...
              <cancelIcon class="cancelReply" @click="cancelReply" />
            </div>
          </transition>
          <div class="input" @keyup.enter="sendPublicChatMessage">
            <sendIcon class="send-icon" />
            <transition name="list" appear>
              <input
                id="homeInput"
                v-model="messageText"
                class="public-chat-input"
                type="text"
                placeholder="Send message..."
              />
            </transition>
          </div>
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import cancelIcon from "../assets/Icons/cancel-Icon.svg";
import singleArrow from "../assets/Icons/single-arrow-left.svg";
import store from "@/store";
import FeedCard from "../components/FeedCard.vue";
import FeedCardQuote from "../components/FeedCardQuote.vue";
import FeedCardGoal from "../components/FeedCardGoal.vue";
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
    FeedCardQuote,
    FeedCardGoal,
    cancelIcon,
    singleArrow,
  },
  data() {
    return {
      store,
      posts: [],
      chatMessages: [],
      messageText: "",
      publicChat: [],
      defaultProfilePicture: null,
      responding: false,
      replyUID: "",
      responseUsername: "",
      roomSelect: false,
      selectedRoom: "general",
      room: [],
      createNewRoom: false,
      roomName: "",
    };
  },
  created() {},
  mounted() {
    db.collection("roomList").onSnapshot(() => {
      this.getRooms();
    });
    this.getDefaultProfilePicture();
    window.removeEventListener("resize", this.routerPush);
    setTimeout(() => {
      db.collection("public-chat")
        .doc("rooms")
        .collection(this.selectedRoom)
        .onSnapshot(() => {
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
              setTimeout(() => {
                dataBase.set({
                  username: store.displayName,
                  profilePic: this.defaultProfilePicture,
                  uid: user.uid,
                  Quote: "Discipline is freedom",
                  Author: "Unknown",
                });
              }, 50);
              console.log("User added!");
            }
          });
      }
      if (this.store.quoteText == "") {
        store.quoteExist = true;
        this.getQuote();
      }
    }, 400);
  },
  methods: {
    addNewRoom() {
      if (this.roomName.length < 1) {
        alert("Room must have a name");
      } else if (this.room.find((element) => element === this.roomName)) {
        alert("Room already exists");
      } else {
        db.collection("roomList")
          .doc(this.roomName)
          .set({
            name: this.roomName,
          });
        alert("Room created");
        this.createNewRoom = !this.createNewRoom;
      }
    },
    createRoom() {
      this.createNewRoom = !this.createNewRoom;
      this.roomSelect = !this.roomSelect;
    },
    getRooms() {
      db.collection("roomList")
        .get()
        .then((query) => {
          this.room = [];
          query.forEach((doc) => {
            this.room.push(doc.id);
          });
        });
    },
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
    chooseRoom(room) {
      this.selectedRoom = room;
      this.enableRoomSelect();
      db.collection("public-chat")
        .doc("rooms")
        .collection(this.selectedRoom)
        .onSnapshot(() => {
          this.getPublicChatMessages();
          this.getPosts();
        });
    },
    enableRoomSelect() {
      this.roomSelect = !this.roomSelect;
    },
    cancelReply() {
      this.responding = false;
      this.replyUID = "";
    },
    UpdateResponseData(UID) {
      this.responding = true;
      this.replyUID = UID;
      const el = document.getElementById("homeInput");
      el.focus();
    },
    getPosts() {
      db.collection("posts")
        .orderBy("CompletionDate", "desc")
        .get()
        .then((query) => {
          this.posts = [];
          query.forEach((doc) => {
            const data = doc.data();
            if (
              this.selectedRoom === "general" ||
              doc.data().room === this.selectedRoom
            )
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
                docID: doc.id,
                GoalName: data.GoalName,
              });
          });
        });
    },
    sendPublicChatMessage() {
      if (this.store.logged) {
        console.log("sendPublicChatMessage");
        if (this.messageText != "") {
          // Get current user
          const user = firebase.auth().currentUser;
          // Add quote to user firestore collection
          const dataBase = db
            .collection("public-chat")
            .doc("rooms")
            .collection(this.selectedRoom);

          dataBase
            .add({
              Message: this.messageText,
              UID: user.uid,
              Date: Date.now(),
              Reply: this.responding,
              ReplyUID: this.replyUID,
              Edited: false,
            })
            .then(() => {
              this.responding = false;
              this.replyUID = "";
            });
          this.messageText = "";
        } else {
          console.log("Unable to send empty message");
        }
      } else {
        alert("You must be logged in to perform this action");
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
        .doc("rooms")
        .collection(this.selectedRoom)
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
              docID: doc.id,
              Reply: data.Reply,
              ReplyUID: data.ReplyUID,
              Edited: data.Edited,
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
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

.newRoomInput {
  border: none !important;
  border-radius: 100px;
  padding: 13px 20px !important;
}

input.textarea {
  margin-left: 25px;
}

*:focus {
  outline: none;
}

.buttons {
  display: flex;
  position: absolute;
  margin-top: 45px;
}

.addRoomBtn {
  padding: 5px 10px;
  background-color: #39c75a;
  border-radius: 100px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  margin-left: 15px;
  transition: all 0.3s ease;
}

.addRoomBtn:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.8);
}

.cancelAddRoomBtn {
  padding: 5px 10px;
  background-color: #d31e1e;
  border-radius: 100px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.3s ease;
}

.cancelAddRoomBtn:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.8);
}

.singleArrow {
  width: 10px;
  fill: #fff;
  position: absolute;
  left: 15px;
  margin-top: 19px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rotate-90 {
  transform: rotate(-90deg);
}

.roomSelect {
  padding: 15px;
  border-radius: 25px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  position: absolute;
  background-color: #141518;
  margin-top: 49px;
  z-index: 200;
  display: flex;
  flex-direction: column;
}

.roomSelect ul {
  list-style: none;
}

.roomSelect li {
  min-width: 200px;
  font-size: 16px;
  margin-top: 15px;
  padding: 5px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.roomSelect li:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.respondingWindow {
  background-color: #39c75a;
  padding: 5px 15px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  max-width: 250px;
  text-align: center;
  border-radius: 100px;
  position: absolute;
  bottom: 115px;
  left: 15px;
}

.cancelReply {
  width: 7px;
  margin-left: 15px;
  cursor: pointer;
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
  height: 707px !important;
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
  margin-bottom: 12px;
  padding: 15px 25px;
  background-color: #141518;
  border-radius: 25px;
  padding-left: 35px;
}

.public-chat-input {
  outline: none;
  border: none;
  border-bottom: 1px solid #141518;
  border-radius: 25px;
  padding: 15px 25px !important;
  width: 100%;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 12px;
}

.send-icon {
  fill: #fff;
  width: 15px;
  cursor: pointer;
  position: absolute;
  margin-top: 32px;
  margin-right: 35px;
}

/* message transitions */
.list-leave-from {
  opacity: 1;
  transform: scale(1);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.list-leave-active {
  transition: all 0.4s ease;
  position: absolute;
}

.list-enter {
  opacity: 0;
  transform: scale(0.6);
}
.list-enter-to {
  opacity: 1;
  transform: scale(1);
}
.list-enter-active {
  transition: all 0.4s ease;
}

.list-move {
  transition: all 0.3s ease;
}
</style>
