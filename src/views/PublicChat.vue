<template>
  <div class="public-chat-wrapper">
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
  </div>
</template>

<script>
import sendIcon from "../assets/Icons/send-icon.svg";
import Message from "../components/Message.vue";
export default {
  name: "PublicChat",
  components: {
    sendIcon,
    Message,
  },
};
</script>

<style scoped>
.public-chat-wrapper {
  background-color: #39c75a !important;
  height: 100vh;
  overflow: hidden;
}

@media screen and (max-width: 960px) {
  .public-chat {
    max-width: 800px;
  }
}

@media screen and (max-width: 860px) {
  .public-chat {
    max-width: 700px;
  }
}
@media screen and (max-width: 760px) {
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
}
@media screen and (max-width: 360px) {
  .public-chat {
    max-width: 200px;
  }
}
</style>
