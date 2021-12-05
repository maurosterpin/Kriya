<template>
  <div class="direct-messages-wrapper">
    <div class="contacts">
      <div class="contact">
        <div class="contact-head">
          <avatar class="contact-user-icon" />
          <div class="contact-head-txt">
            <h6>username</h6>
            <h6>just now</h6>
          </div>
          <div class="contact-body"></div>
        </div>
      </div>
      <div class="contact">
        <div class="contact-head">
          <avatar class="contact-user-icon" />
          <div class="contact-head-txt">
            <h6>username</h6>
            <h6>just now</h6>
          </div>
          <div class="contact-body"></div>
        </div>
      </div>
      <div class="contact">
        <div class="contact-head">
          <avatar class="contact-user-icon" />
          <div class="contact-head-txt">
            <h6>username</h6>
            <h6>just now</h6>
          </div>
          <div class="contact-body"></div>
        </div>
      </div>
    </div>

    <div class="direct-messages">
      <div class="messages">
        <Message /><Message /><Message /><Message /><Message />
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
</template>

<script>
import sendIcon from "../assets/Icons/send-icon.svg";
import Message from "../components/Message.vue";
import avatar from "../assets/Icons/avatar.svg";
export default {
  name: "DirectMessages",
  components: {
    sendIcon,
    Message,
    avatar,
  },
};
</script>

<style scoped>
.direct-messages-wrapper {
  background-color: #39c75a !important;

  display: flex;
  position: relative;
  flex-direction: row;
}

.contacts {
  display: flex;
  flex-direction: column;
}

.contact {
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
}

.direct-messages {
  display: flex;
  flex-direction: column;
}

.contact-head {
  padding: 15px;
  background-color: #141518;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  color: #fff;
  width: 350px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
}

.contact-user-icon {
  width: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.contact-head-txt {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 5px;
}

.messages {
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 25px;
  height: 800px;
}
</style>
