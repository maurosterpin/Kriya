<template>
  <div class="about text-center mt-5 pt-5">
    <div class="container">
      <div>
        <div class="bg-white mx-auto round width">
          <div class="formHeader">
            <logo class="logo" />
            <h1>Kriya</h1>
          </div>
          <form>
            <div class="form-group">
              <input
                type="email"
                v-model="username"
                class="form-control bg"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Email address"
              />
            </div>
            <div class="form-group">
              <input
                v-model="password"
                @click="checkEnabled"
                type="password"
                class="form-control bg"
                id="exampleInputPassword1"
                placeholder="Password"
              />
            </div>
            <button
              type="button"
              @click="login()"
              class="btn"
              style="font-size: 13px; font-weight:600; width:250px;"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="bg-white mx-auto round width margin">
      Don't have an account?
      <router-link to="/signup" class="link2" style="font-weight:600"
        >Sign up</router-link
      >
    </div>
  </div>
</template>
<script>
import firebase from "@/firebase";
import logo from "../assets/Icons/logo.svg";

let enable = false;

export default {
  name: "Login",
  data() {
    return {
      enable,
      username: "",
      password: "",
    };
  },
  mounted() {
    window.removeEventListener("resize", this.routerPush);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.replace({ name: "Home" });
      }
    });
  },
  components: {
    logo,
  },

  methods: {
    login() {
      console.log("login..." + this.username + this.password);

      firebase
        .auth()
        .signInWithEmailAndPassword(this.username, this.password)
        .then((result) => {
          console.log("Uspjesna prijava", result);
          this.$router.replace({ name: "Home" });
        })
        .catch(function(error) {
          console.log("Greska", error);
        });
    },
    checkEnabled() {
      if (this.username != "") {
        this.enable = true;
      }
    },
  },
};
</script>

<style>
body {
  font-size: 14px;
}

input[type="email"],
input[type="password"],
input,
input::-webkit-input-placeholder {
  font-size: 12px;
}
</style>
