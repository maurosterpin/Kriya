<template>
  <div
    class="user-search-card-wrapper"
    @click="$parent.$parent.createContact(test.UID)"
  >
    <div class="user-search-contact-card">
      <img :src="test.ProfilePic" class="user-icon" />{{ test.Username }}
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  data() {
    return {
      store,
    };
  },
  props: ["test"],
  name: "UserSearchContactCard",
  components: {},
  methods: {},
  mounted() {},
};
</script>

<style>
.user-search-card-wrapper {
  cursor: pointer;
}

.user-search-contact-card {
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 10px 15px;
  background-color: #16181b !important;
  border-top: 1px solid #373c44;
  width: 350px;
  align-items: center;
  color: #fff;
}

.user-icon {
  width: 35px;
  border-radius: 50px;
  margin-right: 10px;
}

@media screen and (max-width: 380px) {
  .user-search-contact-card {
    width: 250px;
  }
}
</style>
