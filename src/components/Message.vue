<template>
  <div class="public-chat-msg">
    <div class="public-chat-msg-head">
      <avatar class="user-icon" /><strong>username</strong>
      <span class="public-chat-msg-head-time">just now</span>
    </div>
    <div class="public-chat-msg-body">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    </div>
  </div>
</template>

<script>
import avatar from "../assets/Icons/avatar.svg";
export default {
  name: "Message",
  components: {
    avatar,
  },
};
</script>

<style scoped>
.public-chat-msg {
  max-width: 1000px;
  width: 100%;
  padding: 25px;
  border-radius: 25px;
  color: #fff;
  background-color: #141518;
  margin-bottom: 25px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
}

.public-chat-msg-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 15px;
  cursor: pointer;
}

.user-icon {
  border-radius: 50%;
  width: 40px;
  margin-right: 7px;
}

.public-chat-msg-head-time {
  right: 0;
  margin-left: auto;
}

.public-chat-msg-body {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 15px;
  padding: 10px 20px;
}
</style>
