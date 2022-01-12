<template>
  <div class="settings-wrapper">
    <transition name="list2" appear>
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
    </transition>
    <transition name="list2" appear>
      <div class="change-profile-picture">
        Profile picture<br /><br />
        <input
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
    </transition>
  </div>
</template>

<script>
import { db } from "@/firebase";
import firebase from "@/firebase";
import router from "@/router";
export default {
  name: "Settings",
  components: {},
  data() {
    return {
      usernameInput: null,
      selectedFile: null,
      imageUrl: null,
      width: null,
      height: null,
    };
  },
  mounted() {
    window.removeEventListener("resize", this.routerPush);
    setTimeout(() => {
      this.getUserData();
    }, 500);
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        router.push({
          name: "Login",
        });
      }
    });
  },
  methods: {
    onFileSelected(event) {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(event.target.files[0]);
      this.selectedFile = event.target.files[0];
      var img = new Image();
      setTimeout(() => {
        img.src = this.imageUrl;
        console.log("TEST", img.width, img.height);

        this.width = img.width;
        this.height = img.height;
      }, 100);
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
      if (this.width === this.height) {
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
      } else {
        alert("Image must have equal width & height");
      }
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
  transition: all 0.3s ease;
}

.change-username:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.7);
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
  transition: all 0.3s ease;
}

.change-profile-picture:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.7);
}

.ProfilePictureImg {
  width: 100px;
  height: 100px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ProfilePictureImg:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.7);
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
  transition: all 0.3s ease;
}

.h6-settings:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.8);
}

@media screen and (max-width: 400px) {
  .settings-wrapper {
    justify-content: flex-start;
    font-size: 15px;
  }

  .change-username {
    margin-top: 55px;
    padding: 27px 22px;
  }

  .ProfilePictureImg {
    width: 65px;
    height: 65px;
    border-radius: 100px;
  }

  input.change-username-input {
    width: 170px !important;
    font-size: 16px !important;
  }

  .change-profile-picture {
    padding: 20px 60px;
  }
}

/* message transitions */
.list2-leave {
  opacity: 1;
  transform: scale(1);
}
.list2-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.list2-leave-active {
  transition: all 0.4s ease;
  position: absolute;
}

.list2-enter {
  opacity: 0;
  transform: scale(0.6);
}
.list2-enter-to {
  opacity: 1;
  transform: scale(1);
}
.list2-enter-active {
  transition: all 0.4s ease;
}

.list-move {
  transition: all 0.3s ease;
}
</style>
