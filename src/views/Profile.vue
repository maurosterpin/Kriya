<template>
  <div class="app-wrapper">
    <div class="quote-wrapper">
      <div v-if="quoteExist" class="quote">
        <h1>With freedom comes responsibility</h1>
        <h5>- Eleanor Roosevelt</h5>
      </div>

      <form v-else-if="addQuote">
        <input
          class="inputField"
          type="text"
          id="goalDescription"
          name="description"
          placeholder="Quote..."
        />

        <input
          class="inputField"
          type="text"
          id="goalReason"
          name="theWhy"
          placeholder="Author..."
        />

        <span v-on:click="submitTasks" class="button"><p>Submit</p></span>
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

.quote h1 {
  font-weight: 100;
}

.quote h5 {
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

form {
  margin: 55px auto;
  max-width: 350px;
  background-color: #39c75a;
  padding: 45px;
  border-radius: 35px;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 35px 0px black;
}
</style>
