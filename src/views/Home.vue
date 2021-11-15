<template>
  <div class="home-wrapper">
    <div class="home">
      <div class="feed"><ToDoList /></div>
      <div class="public-chat">
        <!--<h6 class="public-chat-h5">general</h6>-->
        <Message /><Message /><Message /><Message /><Message />
        <div class="input">
          <input
            class="public-chat-input"
            type="text"
            placeholder="Send message..."
          />
          <sendIcon class="send-icon" />
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
.home {
  font-size: 14px;
  background-color: #39c75a;
  min-height: 100vh;
  display: flex;
  display: row;
  justify-content: space-between;
}

.feed {
  margin-left: auto;
  padding: 25px 0px;
  width: 600px;
}

.public-chat {
  right: 0;
  position: relative;
  background-color: #39c75a;
  max-width: 700px;
  margin-right: auto;
  margin-left: 50px;
  padding: 30px 10px;
  border-radius: 50px;
  color: #fff;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
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
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
}

.public-chat-input {
  outline: none;
  border: none;
  border-bottom: 1px solid #141518;
  border-radius: 25px;
  padding: 15px 25px !important;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
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
