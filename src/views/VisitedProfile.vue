<template>
  <div class="app-wrapper">
    <div class="quote-wrapper">
      <div v-if="quoteComputed != null" class="quote">
        <h2>" {{ quoteComputed }} "</h2>
        <h6>- {{ authorComputed }}</h6>
      </div>
    </div>
    <div class="profile">
      <div class="username">
        <img :src="profilePic" class="avatar" />{{ username
        }}<router-link
          @click="test"
          class="noDecorationLink"
          to="/direct-messages"
        >
          <span class="message-user">Message</span></router-link
        >
      </div>
      <transition-group tag="div" name="list2" appear>
        <Goal v-for="goal in goals" :key="goal.goalTitle" :info="goal" />
      </transition-group>
      <h6 v-if="goals.length < 1" class="illustrationTitle">
        There is nothing here
      </h6>
      <illustration v-if="goals.length < 1" class="illustration" />

      <router-view />
    </div>
  </div>
</template>

<script>
import Goal from "../components/Goal.vue";
import store from "@/store";

import illustration from "../assets/Icons/illustration-empty.svg";
import { db } from "@/firebase";
export default {
  name: "Home",
  components: {
    illustration,
    Goal,
  },
  data() {
    return {
      goals: [],
      addQuote: false,
      store,
      quoteText: null,
      quoteAuthor: null,
      username: null,
      profilePic: null,
    };
  },
  created() {},
  mounted() {
    window.removeEventListener("resize", this.routerPush);
    this.getQuote();
    this.getGoals();
    this.$root.$on("Profile.vue", () => {
      this.getGoals();
    });
  },
  methods: {
    getQuote() {
      console.log("getQuote");
      db.collection("users")
        .doc(this.$route.params.profileUid)
        .get()
        .then((doc) => {
          this.quoteText = doc.data().Quote;
          this.quoteAuthor = doc.data().Author;
          this.username = doc.data().username;
          this.profilePic = doc.data().profilePic;
        });
    },
    getGoals() {
      // Empty goals array
      this.goals = [];
      // Get goals from user firestore collection
      db.collection("users")
        .doc(this.$route.params.profileUid)
        .collection("goals")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.goals.push({
              goalTitle: doc.data().name,
              goalMessage: doc.data().Msg,
            });
          });
        });
    },
  },
  computed: {
    quoteComputed() {
      return this.quoteText;
    },
    authorComputed() {
      return this.quoteAuthor;
    },
    quoteExistComputed() {
      return this.quoteExist;
    },
  },
  watch: {},
};
</script>

<style lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  background-color: #141518;
}

.message-user {
  margin-left: 22px;
  padding: 10px 18px;
  background-color: #39c75a;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.message-user:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 1);
}

.PfpImg {
  width: 62px;
  height: 62px;
  border-radius: 100px;
  margin-right: 10px;
}

.illustration {
  margin: auto;
  margin-bottom: 100px;
}

.illustrationTitle {
  margin: auto;
  color: #fff;
}

.noDecorationLink {
  color: #fff;
  text-decoration: none;
}

.noDecorationLink:hover {
  color: #fff;
  text-decoration: none;
}

.quote-wrapper {
  min-height: 320px;
  background-color: #39c75a;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  form {
    margin: 55px auto;
    max-width: 350px;
    width: 20%;
    padding: 35px;
    border-radius: 35px;
    display: flex;
    flex-direction: column;
    background-color: #39c75a;
    justify-content: center;
    align-items: center;

    .buttonQuote {
      font-size: 15px;
      cursor: pointer;
      padding: 8px 19px;
      border-radius: 25px;
      margin: auto;
      margin-top: 20px;
      color: #fff;
      background-color: #141518;
      box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);

      p {
        margin-top: 15px;
      }
    }

    input[type="text"] {
      background-color: #141518 !important;
    }

    .inputField2 {
      display: flex;
      width: 100%;
      margin: 20px 0;
      border: none;
      outline: none;
      color: #fff !important;
      box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
      border-radius: 25px;
      padding: 10px 20px !important;
    }

    .quote-form input {
      width: 90%;
      height: 100%;
      padding: 5px 10px;
      caret-color: #39c75a;
      color: #fff !important;
      font-size: 15px;
      font-weight: 900;
    }

    ::placeholder {
      color: #fff !important;
      font-size: 14px;
      background-color: #141518 !important;
    }
  }

  .quote {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    flex-direction: column;
  }

  .quoteAdd {
    display: flex;
    color: #fff;
    cursor: pointer;
  }

  .quoteAdd:hover h5 {
    font-size: 22px;
    transition: 0.3s;
  }
}

.quote h2 {
  font-weight: 100;
}

.quote h6 {
  margin-top: 25px;
  font-weight: 100;
}
.username {
  margin: auto;
  display: flex;
  color: #fff;
  margin-top: 45px;
  font-size: 15px;
  align-items: center;
  margin-bottom: 35px;
}

.username .avatar {
  border-radius: 50%;
  width: 55px;
  margin-right: 15px;
}

.addIcon {
  cursor: pointer;
  pointer-events: auto;
  width: 10px;
  margin-left: 10px;
  margin-bottom: 6px;
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
