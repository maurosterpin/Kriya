<template>
  <div class="notificationCard-wrapper">
    <div class="notificationCard">Artemis sent you a message</div>
  </div>
</template>

<script>
export default {
  name: "NotificationCard",
};
</script>

<style scoped>
.notificationCard {
  padding: 0px 10px;
  width: 280px;
  height: 50px;
  background: #fff;
  border-top: 1px solid black;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
}
</style>
