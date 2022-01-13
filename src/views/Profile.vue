<template>
  <div class="app-wrapper">
    <div class="quote-wrapper">
      <div v-if="!addQuote && quoteText.length > 0" class="quote">
        <transition name="list2" appear>
          <h2>" {{ quoteComputed }} "</h2>
        </transition>
        <transition name="list2" appear>
          <h6>- {{ authorComputed }}</h6>
        </transition>
        <transition name="list2" appear>
          <span class="buttonQuoteEdit" @click="addQuoteMethod">Edit</span>
        </transition>
      </div>

      <form autocomplete="off" v-else-if="addQuote" class="quote-form">
        <transition name="list2" appear>
          <cancelIcon class="cancelIconStyle2" @click="addQuoteMethod" />
        </transition>
        <transition name="list2" appear>
          <input
            v-model="quoteTextInput"
            class="inputField2"
            type="text"
            id="goalDescription"
            name="content"
            placeholder="Quote..."
          />
        </transition>
        <transition name="list2" appear>
          <input
            v-model="quoteAuthor"
            class="inputField2"
            type="text"
            id="goalReason"
            name="description"
            placeholder="Author..."
          />
        </transition>
        <transition name="list2" appear>
          <span v-on:click="submitQuote" class="buttonQuote"
            ><strong>Submit</strong></span
          >
        </transition>
      </form>

      <div v-else v-on:click="addQuoteMethod" class="quoteAdd">
        <h5>Add quote</h5>
        <addIcon class="addIcon" />
      </div>
    </div>
    <div class="profile">
      <transition name="list2" appear>
        <div class="username">
          <img :src="profilePic" alt="ProfilePicture" class="avatar" />{{
            username
          }}
        </div>
      </transition>
      <transition-group tag="div" name="list2" appear>
        <Goal v-for="goal in goals" :key="goal.goalTitle" :info="goal" />
      </transition-group>
      <transition name="list2" appear>
        <AddGoal />
      </transition>
      <h6 v-if="goals.length < 1" class="illustrationTitle">
        There is nothing here
      </h6>
      <illustration v-if="goals.length < 1" class="illustration" />

      <router-view />
    </div>
  </div>
</template>

<script>
import AddGoal from "../components/AddGoal.vue";
import cancelIcon from "../assets/Icons/cancel-Icon.svg";
import Goal from "../components/Goal.vue";
import store from "@/store";
import addIcon from "../assets/Icons/add-icon.svg";
import illustration from "../assets/Icons/illustration-empty.svg";
import { db } from "@/firebase";
import firebase from "@/firebase";
import router from "@/router";
export default {
  name: "Home",
  components: {
    AddGoal,
    addIcon,
    illustration,
    Goal,
    cancelIcon,
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
      quoteTextInput: null,
    };
  },
  created() {},
  mounted() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        router.push({
          name: "Login",
        });
      }
    });
    window.removeEventListener("resize", this.routerPush);
    setTimeout(() => {
      this.getQuote();
      this.getGoals();
      this.$root.$on("Profile.vue", () => {
        this.getGoals();
      });
    }, 400);
  },
  methods: {
    getQuote() {
      console.log("getQuote");
      // Get current user
      const user = firebase.auth().currentUser;
      // Get quote from user firestore collection
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          this.quoteText = doc.data().Quote;
          this.quoteAuthor = doc.data().Author;
          this.username = doc.data().username;
          this.profilePic = doc.data().profilePic;
        });
    },
    addQuoteMethod() {
      this.addQuote = !this.addQuote;
      this.quoteTextInput = this.quoteText;
    },
    submitQuote() {
      if (
        this.quoteText.length > 0 &&
        this.quoteAuthor.length > 0 &&
        this.quoteText != this.quoteTextInput
      ) {
        // Get current user
        const user = firebase.auth().currentUser;
        // Add quote to user firestore collection
        let dataBase = db.collection("users").doc(user.uid);
        dataBase
          .update({
            Quote: this.quoteText,
            Author: this.quoteAuthor,
          })
          .then(() => {
            dataBase = db.collection("posts");
            dataBase.add({
              Quote: this.quoteTextInput,
              Author: this.quoteAuthor,
              CompletionDate: Date.now(),
              UID: user.uid,
            });
          });

        console.log("Quote added!");
        this.addQuote = !this.addQuote;
      } else {
        alert("Enter quote and author");
      }
    },
    getGoals() {
      // Get current user
      const user = firebase.auth().currentUser;
      // Empty goals array
      this.goals = [];
      // Get goals from user firestore collection
      db.collection("users")
        .doc(user.uid)
        .collection("goals")
        .orderBy("date", "desc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.goals.push({
              goalTitle: doc.data().name,
              goalMessage: doc.data().Msg,
              goalID: doc.id,
              completed: doc.data().completed,
              goalUID: user.uid,
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

.quote-form {
  width: 500px !important;
}

.buttonQuoteEdit {
  font-size: 13px;
  cursor: pointer;
  padding: 7px 15px;
  border-radius: 25px;
  margin: auto;
  margin-top: 20px;
  color: #fff;
  background-color: #141518;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.4);
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

@media screen and (max-width: 600px) {
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
    font-size: 12px !important;
    font-weight: 900;
  }

  form.quote-form {
    width: 250px !important;
    padding: 5px !important;
  }

  .buttonQuote {
    padding: 5px 8px !important;
    font-size: 10px !important;
  }

  .buttonQuoteEdit {
    font-size: 10px;
    padding: 3px 7px;
    margin-top: 12px;
  }

  .wrapper {
    padding: 15px !important;
    max-width: 250px !important;
  }

  .addIcon {
    width: 8px !important;
    margin-top: 5px !important;
  }

  .wrapper header {
    font-size: 13px !important;
  }

  .quote-wrapper {
    min-height: 230px !important;
  }

  .quote h2 {
    font-size: 18px;
    text-align: center;
  }

  .quote h6 {
    font-size: 12px;
  }

  .username {
    font-size: 14px !important;
  }

  .username .avatar {
    width: 40px !important;
    margin-right: 10px !important;
  }
}

.addIcon {
  cursor: pointer;
  pointer-events: auto;
  width: 10px;
  margin-left: 10px;
  margin-bottom: 6px;
}

/* message transitions */
.list2-leave-from {
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

.cancelIconStyle2 {
  width: 6px !important;
  right: 0px;
  margin-bottom: 25px;
  margin-left: auto;
  cursor: pointer;
}
</style>
