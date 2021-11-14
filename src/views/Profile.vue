<template>
  <div class="app-wrapper">
    <div class="quote-wrapper">
      <div v-if="quoteExist" class="quote">
        <h1>" {{ quoteText }} "</h1>
        <h6>- {{ quoteAuthor }}</h6>
      </div>

      <form v-else-if="addQuote">
        <input
          v-model="quoteText"
          class="inputField2"
          type="text"
          id="goalDescription"
          name="description"
          placeholder="Quote..."
        />

        <input
          v-model="quoteAuthor"
          class="inputField2"
          type="text"
          id="goalReason"
          name="theWhy"
          placeholder="Author..."
        />

        <span v-on:click="submitQuote" class="button"><p>Submit</p></span>
      </form>

      <div v-else v-on:click="addQuoteMethod" class="quoteAdd">
        <h5>Add quote</h5>
        <addIcon class="addIcon" />
      </div>
    </div>
    <div class="profile">
      <div class="username"><avatar class="avatar" />Artemis</div>
      <Goal />
      <ToDoList />
      <router-view />
    </div>
  </div>
</template>

<script>
import ToDoList from "../components/ToDoList.vue";
import Goal from "../components/Goal.vue";
import store from "@/store";
import avatar from "../assets/Icons/avatar.svg";
import addIcon from "../assets/Icons/add-icon.svg";
export default {
  name: "Home",
  components: {
    ToDoList,
    Goal,
    avatar,
    addIcon,
  },
  data() {
    return {
      quoteExist: false,
      addQuote: false,
      quoteText: "",
      quoteAuthor: "",
    };
  },
  created() {},
  mounted() {
    console.log("STORE", store.logged);
  },
  methods: {
    addQuoteMethod() {
      console.log("ADD METHOD");
      this.addQuote = !this.addQuote;
    },
    submitQuote() {
      if (this.quoteText.length > 0 && this.quoteAuthor.length > 0) {
        this.quoteExist = !this.quoteExist;
      } else {
        console.log("Enter quote and author");
      }
    },
  },
  watch: {},
};
</script>

<style lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #141518;
}

.quote-wrapper {
  height: 350px;
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
    background-color: #141518;
    justify-content: center;
    align-items: center;

    .button {
      font-size: 15px;
      cursor: pointer;
      padding: 0px 17px;
      border-radius: 25px;
      margin: auto;
      color: #fff;
      background-color: #39c75a;

      p {
        margin-top: 15px;
      }
    }

    .inputField2 {
      display: flex;
      width: 100%;
      margin: 20px 0;
      border: none;
      background-color: #39c75a !important;
      outline: none;
      color: #fff !important;
    }

    .inputField2 input {
      width: 90%;
      height: 100%;
      padding: 5px 10px;
      caret-color: #39c75a;
      color: #fff !important;
      background-color: #39c75a !important;
      font-size: 15px;
      font-weight: 900;
    }

    ::placeholder {
      color: #fff !important;
      font-size: 14px;
      background-color: #39c75a;
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
  display: flex;
  margin: auto;
  width: 50%;
  color: #fff;
  margin-top: 45px;
  font-size: 15px;
  align-items: center;
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
</style>
