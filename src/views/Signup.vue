<template>
  <div class="about text-center mt-5 pt-5">
    <div class="container">
      <div>
        <div class="bg-white p-5 mx-auto round" style="width:350px;">
          <form autocomplete="off">
            <div class="form-group">
              <input
                type="text"
                v-model="name"
                class="form-control bg"
                id="exampleInputUsername1"
                aria-describedby="usernameHelp"
                placeholder="Username"
              />
            </div>
            <div class="form-group">
              <input
                type="email"
                v-model="email"
                class="form-control bg"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Email address"
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                v-model="password"
                class="form-control bg"
                id="exampleInputPassword1"
                placeholder="Password"
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                @click="checkEnabled"
                v-model="passwordRepeat"
                class="form-control bg"
                id="exampleInputPassword2"
                placeholder="Repeat Password"
              />
            </div>
            <button
              type="button"
              @click="signup"
              class="btn"
              style="font-size: 13px; font-weight:600; width:250px;"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="bg-white p-4 mx-auto mt-3 round" style="width:350px">
      Have an account?
      <a href="login" class="link2" style="font-weight:600">Log in</a>
    </div>
  </div>
</template>

<script>
import firebase from "@/firebase";
import store from "@/store";
import router from "@/router";

let enable = false;

export default {
  name: "Signup",
  data() {
    return {
      enable,
      name: "",
      email: "",
      password: "",
      passwordRepeat: "",
      profilePic:
        "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
      posts: [],
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && store.logged == true) {
        router.push({ name: "Home" });
      }
    });
  },
  methods: {
    signup() {
      if (this.password === this.passwordRepeat) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(function() {
            console.log("Uspjesna registracija");
            store.logged = true;
          })
          .catch(function(error) {
            console.log("Doslo je do greske", error);
            alert(error);
          });
        console.log("Nastavak");
      } else {
        alert("Repeat password doesn't match password!");
      }
      store.displayName = this.name;
      store.profilePic =
        "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
      console.log(this.name);
    },
    checkEnabled() {
      if (this.password != "") {
        this.enable = true;
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap");

body {
  font-size: 14px;
}
input[type="text"],
input[type="email"],
input[type="password"],
input,
input::-webkit-input-placeholder,
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
textarea:-webkit-autofill,
select:-webkit-autofill {
  font-size: 12px;
  color: #39c75a !important;
  background-color: #141518 !important;
}

.round {
  border-radius: 7px;
  background-color: #141518 !important;
  color: #39c75a !important;
}

.link2 {
  color: #39c75a !important;
  text-decoration: underline !important;
}

.bg {
  background-color: #141518 !important;
  border: none;
  color: #141518;
  border-radius: 0;
  border-bottom: 2px solid #39c75a;
  font-family: "Nunito", sans-serif !important;
}

.btn {
  background-color: #141518;
  border: 2px solid #39c75a;
  color: #39c75a;
  margin-top: 10px;
  font-size: 15px !important;
  font-weight: 600 !important;
  font-family: "Nunito", sans-serif !important;
}

.btn:hover {
  background-color: #39c75a;
  border: 2px solid #39c75a;
  color: #141518;
  margin-top: 10px;
}
</style>
