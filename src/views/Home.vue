<template>
  <div class="home-wrapper">
    <div class="home">
      <div class="feed-wrapper">
        <div class="feed"><ToDoList /><ToDoList /><ToDoList /></div>
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

import ToDoList from "../components/ToDoList.vue";

import Message from "../components/Message.vue";
import sendIcon from "../assets/Icons/send-icon.svg";
export default {
  name: "Home",
  components: {
    ToDoList,
    sendIcon,
    Message,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    console.log("STORE", store.logged);
  },
  methods: {},
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
  justify-content: space-evenly;
}

.feed-wrapper {
  max-width: 800px;
  display: flex;
}

.feed {
  margin: auto;
  padding: 25px 0px;
  width: 370px;
}

.public-chat-relative {
  width: 1000px;
  position: relative;
  float: right;
}

.public-chat {
  right: 15px;
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
  width: 10px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #141518;
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
