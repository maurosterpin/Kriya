<template>
  <div>
    <div v-if="goalSetup" class="goal-form">
      <form autocomplete="off">
        <div class="form-group">
          <input
            type="text"
            v-model="goalTitle"
            class="form-control bg"
            id="inputGoalName"
            aria-describedby="GoalName"
            placeholder="Goal title..."
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="goalMessage"
            class="form-control bg"
            id="inputGoalMessage"
            aria-describedby="GoalMessage"
            placeholder="Why are you working towards this goal..."
          />
        </div>
        <button
          type="button"
          @click="newGoal"
          class="btn"
          style="font-size: 13px; font-weight:600; width:250px;"
        >
          Submit
        </button>
      </form>
    </div>
    <div class="wrapper">
      <header>
        Add new goal<addIcon v-on:click="addGoal" class="addIcon" />
      </header>
    </div>
  </div>
</template>

<script>
import addIcon from "../assets/Icons/add-icon.svg";
import { db } from "@/firebase";
import firebase from "@/firebase";
export default {
  data() {
    return {
      task: null,
      tasks: ["Practice Vue", "Practice JavaScript", "Practice CSS"],
      submited: false,
      goalSetup: false,
      goalTitle: "",
      goalMessage: "",
    };
  },
  props: ["info"],
  name: "Goal",
  methods: {
    addGoal() {
      this.goalSetup = true;
    },
    submitGoal() {
      this.submited = !this.submited;
      this.goalSetup = !this.goalSetup;
    },
    newGoal() {
      this.goalSetup = !this.goalSetup;
      const user = firebase.auth().currentUser;
      const dataBase = db
        .collection("users")
        .doc(user.uid)
        .collection("goals")
        .doc(this.goalTitle);
      dataBase.set({
        name: this.goalTitle,
        goalMsg: this.goalMessage,
        completed: false,
        date: Date.now(),
      });
    },
  },
  computed: {},
  components: {
    addIcon,
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.goal {
  min-height: 100px;
  background-color: #39c75a;
  max-width: 1000px;
  border-radius: 25px;
  margin: auto;
  color: #fff;
  padding: 25px;
  display: flex;
  margin-bottom: 45px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.goal-form {
  margin: auto;
  max-width: 300px;
  display: flex;
  justify-content: center;
}

.goal-form form {
  margin: auto;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 55px;
}

.goal-form input {
  margin-left: 0;
  border-bottom: 1px solid #39c75a;
}

.btn {
  margin: auto !important;
  margin-top: 25px !important;
  height: 35px;
}

.to-do-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow-x: scroll !important;
  margin-bottom: 25px;
}

.to-do-item {
  margin-right: 15px !important;
  min-width: 370px;
}

.goal h5 {
  margin-bottom: 25px;
}

input {
  margin: 25px;
  border: none;
}

.wrapper {
  margin: 0 auto 50px;
  max-width: 300px;
  width: 100%;
  background-color: #39c75a;
  color: #fff;
  padding: 20px;
  border-radius: 35px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
}

.wrapper header {
  font-size: 15px;
  margin-left: 15px;
  display: flex;
  justify-content: space-between;
}

.inputField {
  display: flex;
  height: 35px;
  width: 100%;
  margin: 20px 0;
  border-bottom: 2px solid #39c75a;
  padding: 25px;
  border-radius: 20px;
}

.inputField input {
  width: 90%;
  height: 100%;
  padding: 5px 10px;
  caret-color: #39c75a;
  color: #fff !important;
  font-size: 15px;
  font-weight: 900;
  border-bottom: 1px solid #39c75a !important;
}

*:focus {
  outline: none;
}

::placeholder {
  color: #fff !important;
  font-size: 14px;
}

.todoList li {
  margin-top: 30px;
  margin-left: 18px;
}

.button {
  font-size: 15px;
  cursor: pointer;
  padding: 9px 17px;
  border-radius: 25px;
  margin: auto;
  color: #fff;
  background-color: #141518;
  display: flex;
  justify-content: center;
}

.footer .pending {
  margin-top: 5px;
}

.addIcon {
  margin-top: 3px;
  margin-right: 5px;
  cursor: pointer;
  pointer-events: auto;
  width: 10px;
}

.cancelIcon {
  float: right;
  margin-right: 8px;
  cursor: pointer;
}
</style>
