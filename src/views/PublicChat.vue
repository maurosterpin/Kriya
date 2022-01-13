<template>
  <div class="public-chat-home">
    <div class="public-chat-wrapper2">
      <div class="public-chat-relative2">
        <div class="public-chat2">
          <transition name="list" appear>
            <div class="roomContainer2">
              <h6 v-if="!createNewRoom" class="public-chat-h52">
                {{ selectedRoom }}
              </h6>
              <input
                v-else
                placeholder="Type room name..."
                v-model="roomName"
                type="text"
                class="newRoomInput2"
              />
            </div>
          </transition>
          <div v-if="createNewRoom" class="buttons2">
            <transition name="list" appear>
              <div class="addRoomBtn2" @click="addNewRoom">Add room</div>
            </transition>
            <transition name="list" appear>
              <div
                class="cancelAddRoomBtn2"
                @click="createNewRoom = !createNewRoom"
              >
                Cancel
              </div>
            </transition>
          </div>
          <transition name="list" appear>
            <singleArrow
              v-if="!createNewRoom"
              class="singleArrow2"
              :class="{ 'rotate-90': roomSelect }"
              @click="enableRoomSelect"
            />
          </transition>
          <transition name="list" appear>
            <div v-if="roomSelect" class="roomSelect2">
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
          <div class="messages3">
            <transition-group tag="div" name="list" appear>
              <Message
                v-on:respond="UpdateResponseData($event)"
                v-for="message in publicChat"
                :key="message.Date"
                :info="message"
                :isPublic="true"
              />
            </transition-group>
          </div>
          <transition name="list" appear>
            <div v-if="responding" class="respondingWindow">
              Replying...
              <cancelIcon class="cancelReply" @click="cancelReply" />
            </div>
          </transition>
          <div class="input2" @keyup.enter="sendPublicChatMessage">
            <sendIcon class="send-icon2" @click="sendPublicChatMessage" />
            <transition name="list" appear>
              <input
                id="publicChatInput"
                v-model="messageText"
                class="public-chat-input-2"
                type="text"
                placeholder="Send message..."
              />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cancelIcon from "../assets/Icons/cancel-Icon.svg";
import singleArrow from "../assets/Icons/single-arrow-left.svg";
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
    cancelIcon,
    singleArrow,
  },
  data() {
    return {
      store,
      posts: [],
      chatMessages: [],
      messageText: null,
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
  mounted() {
    db.collection("roomList").onSnapshot(() => {
      this.getRooms();
    });
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
      const el = document.getElementById("publicChatInput");
      el.focus();
    },
    routerPush() {
      if (window.innerWidth > 960) {
        window.removeEventListener("resize", this.routerPush);
        router.push({
          name: "Home",
        });
      }
    },
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
    chooseRoom(room) {
      this.$forceUpdate();
      this.$emit("emitter");
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
            this.cancelReply();
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
  display: flex;
  flex-direction: row;
  justify-content: right;
  max-width: 100%;
}

.roomContainer2 {
  padding: 0px 15px;
  width: 100%;
}

.public-chat-h52 {
  width: 100%;
  margin-bottom: 12px;
  padding: 15px 25px;
  background-color: #141518;
  border-radius: 25px;
  padding-left: 35px;
}

.buttons2 {
  display: flex;
  position: absolute;
  margin-top: 45px;
  z-index: 150;
  top: 30px;
  left: 30px;
}

.addRoomBtn2 {
  padding: 5px 10px;
  background-color: #39c75a;
  border-radius: 100px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  margin-left: 15px;
  transition: all 0.3s ease;
}

.addRoomBtn2:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.8);
}

.cancelAddRoomBtn2 {
  padding: 5px 10px;
  background-color: #d31e1e;
  border-radius: 100px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.3s ease;
}

.newRoomInput2 {
  border: none !important;
  border-radius: 100px;
  padding: 13px 20px !important;
  width: 100%;
}

.cancelAddRoomBtn2:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.8);
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

.singleArrow2 {
  width: 10px;
  fill: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 200;
  position: absolute;
  bottom: 32px;
  left: 34px;
  top: 50px;
}

.send-icon2 {
  fill: #fff;
  width: 13px;
  cursor: pointer;
  position: absolute;
  margin-top: 20px;
  margin-right: 22px;
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

.rotate-90 {
  transform: rotate(-90deg);
}

.roomSelect2 {
  padding: 15px;
  border-radius: 25px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  position: absolute;
  background-color: #141518;
  z-index: 200;
  display: flex;
  flex-direction: column;
  top: 75px;
  left: 15px;
}

.roomSelect2 ul {
  list-style: none;
}

.roomSelect2 li {
  min-width: 200px;
  font-size: 16px;
  margin-top: 15px;
  padding: 5px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.roomSelect2 li:hover {
  background-color: rgba(0, 0, 0, 0.5);
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

/* message transitions */
.list-leave {
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
