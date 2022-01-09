<template>
  <div class="user-search-card-wrapper" @click="visitProfile">
    <div class="user-search-card">
      <img :src="test.ProfilePic" class="user-icon" />{{ test.Username }}
    </div>
  </div>
</template>

<script>
import router from "@/router";
import store from "@/store";
import firebase from "@/firebase";
export default {
  data() {
    return {
      store,
    };
  },
  props: ["test"],
  name: "UserSearchCard",
  components: {},
  methods: {
    visitProfile() {
      if (store.currentUserUid) {
        console.log("visitProfile");
        // Get current user
        const user = firebase.auth().currentUser;
        if (user.uid != this.test.UID) {
          router.push({
            name: "VisitedProfile",
            params: { profileUid: this.test.UID },
          });
        } else {
          router.push({
            name: "Profile",
          });
        }
        window.location.reload();
      } else {
        router.push({
          name: "VisitedProfile",
          params: { profileUid: this.test.UID },
        });
        window.location.reload();
      }
    },
  },
  mounted() {},
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
