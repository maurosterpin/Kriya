<template>
  <div class="user-search-card-wrapper">
    <div class="user-search-card"><avatar class="user-icon" />{{ test }}</div>
  </div>
</template>

<script>
import avatar from "../assets/Icons/avatar.svg";
export default {
  props: ["test"],
  name: "UserSearchCard",
  components: {
    avatar,
  },

  mounted() {
    console.log("INFO TEST", this.test);
  },
};
</script>

<style>
.user-search-card-wrapper {
  cursor: pointer;
}

.user-search-card {
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 10px 15px;
  background-color: #fff;
  width: 188px;
  align-items: center;
  border-top: 1px solid rgb(226, 226, 226);
}

.user-icon {
  width: 35px;
  border-radius: 50px;
  margin-right: 10px;
}
</style>
