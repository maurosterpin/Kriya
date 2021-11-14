<template>
  <div class="about text-center mt-5 pt-5">
    <div class="container">
      <div>
        <div class="bg-white p-5 mx-auto round" style="width:350px;">
          <div class="formHeader">
            <logo class="logo" />
            <h1>Kriya</h1>
          </div>
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
      <router-link to="/login" class="link2" style="font-weight:600"
        >Log in</router-link
      >
    </div>
  </div>
</template>

<script>
import logo from "../assets/Icons/logo.svg";
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
  components: {
    logo,
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        router.replace({ name: "Home" });
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
  background-color: #141518;
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
  font-size: 15px !important;
  color: #fff !important;
  background-color: #141518 !important;
}

input {
  margin-bottom: 40px;
  padding: 2px 5px !important;
}

.round {
  border-radius: 7px;
  background-color: #141518 !important;
  color: #fff !important;
}

.formHeader {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
}

.formHeader h1 {
  font-size: 55px;
  font-weight: 100;
  margin-left: 15px;
  margin-top: 12px;
}

.logo {
  width: 55px;
}

.link2 {
  color: #fff !important;
  text-decoration: underline !important;
  text-decoration-color: #39c75a;
}

.bg {
  background-color: #141518 !important;
  border: none;
  color: #141518;
  border-radius: 0;
  border-bottom: 1px solid #39c75a;
  font-family: "Nunito", sans-serif !important;
}

.btn {
  background-color: #39c75a;
  border-radius: 50px;
  color: #fff;
  margin-top: 10px;
  font-size: 15px !important;
  font-weight: 600 !important;
  font-family: "Nunito", sans-serif !important;
}
</style>
