<template>
  <div class="settings-wrapper">
    <div class="change-username">
      <label for="username-input">Username </label><br />
      <input
        v-model="usernameInput"
        class="change-username-input"
        type="text"
        id="username-input"
        name="username-input"
      />
      <h6 @click="updateUsername" class="h6-settings">Update</h6>
    </div>
    <div class="change-profile-picture">
      Profile picture<br /><br /><input
        type="file"
        id="img"
        style="display:none;"
        @change="onFileSelected"
        accept="image/*"
      />
      <label for="img"
        ><img
          :src="imageUrl"
          alt="ProfilePicture"
          class="ProfilePictureImg"/></label
      ><br />

      <h6 @click="updateProfilePicture" class="h6-settings">Update</h6>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import firebase from "@/firebase";
export default {
  name: "Settings",
  components: {},
  data() {
    return {
      usernameInput: null,
      selectedFile: null,
      imageUrl: null,
    };
  },
  mounted() {
    setTimeout(() => {
      this.getUserData();
    }, 500);
  },
  methods: {
    onFileSelected(event) {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(event.target.files[0]);
      this.selectedFile = event.target.files[0];
    },
    onUpload() {},
    getUserData() {
      // Get current user
      const user = firebase.auth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          this.usernameInput = doc.data().username;
          this.imageUrl = doc.data().profilePic;
        });
    },

    updateUsername() {
      console.log("Update username");
      const user = firebase.auth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .update({
          username: this.usernameInput,
        })
        .then(() => {
          alert("Username updated");
        });
    },
    updateProfilePicture() {
      console.log("Update profile picture");
      const user = firebase.auth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .update({
          profilePic: this.imageUrl,
        })
        .then(() => {
          alert("Image updated");
        });
    },
  },
};
</script>

<style>
.settings-wrapper {
  background-color: #39c75a !important;
  color: #fff !important;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  height: 891px;
  overflow: hidden;
}

.avatar-settings {
  border-radius: 100px;
}

.change-username {
  margin-top: 70px;
  padding: 55px 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #141518;
  border-radius: 25px;
}

.change-profile-picture {
  margin-top: 70px;
  margin-bottom: 101px;
  padding: 55px 99px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #141518;
  border-radius: 25px;
}

.ProfilePictureImg {
  width: 100px;
  height: 100px;
  border-radius: 100px;
}

input.change-username-input {
  border: none;
  border-bottom: 1px solid #39c75a;
  text-align: center;
  font-size: 18px !important;
}

input.change-username-input::placeholder {
  font-size: 18px;
  text-align: center;
}

input.change-username-input:focus {
  outline: none;
}

input.change-username-input:focus {
  outline: none;
}

.h6-settings {
  background-color: #39c75a;
  padding: 12px 15px;
  border-radius: 50px;
  cursor: pointer;
}
</style>
