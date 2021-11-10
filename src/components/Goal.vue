<template>
  <div>
    <div v-if="submited">
      <form>
        <label for="goalDescription"><h3>Goal description</h3></label>
        <input
          class="inputField"
          type="text"
          id="goalDescription"
          name="description"
          placeholder="Description.."
        />

        <label for="goalReason"
          ><h4>Why are you working towards this goal?</h4></label
        >
        <input
          class="inputField"
          type="text"
          id="goalReason"
          name="theWhy"
          placeholder="This is a reminder.."
        />

        <span v-on:click="submitTasks" class="button">Submit</span>
      </form>
    </div>
    <div class="wrapper">
      <header>
        Start a new goal!<addIcon v-on:click="addGoal" class="addIcon" />
      </header>
    </div>
  </div>
</template>

<script>
import addIcon from "../assets/Icons/add-icon.svg";
//import cancelIcon from "../assets/Icons/cancel-Icon.svg";
//import checkMarkIcon from "../assets/Icons/check-mark.svg";
export default {
  data() {
    return {
      task: null,
      tasks: ["Practice Vue", "Practice JavaScript", "Practice CSS"],
      submited: false,
    };
  },
  name: "Goal",
  methods: {
    addGoal() {
      this.submited = !this.submited;
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

form {
  margin: 55px auto;
  max-width: 350px;

  background-color: #141518;
  padding: 45px;
  border-radius: 8px;
  color: #39c75a;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 35px 0px black;
}

input {
  margin: 25px;
  border: none;
}

.wrapper {
  margin: 120px auto;
  max-width: 370px;
  width: 100%;
  background-color: #141518;
  color: #39c75a;
  padding: 25px;
  border-radius: 7px;
  font-weight: 900;
  box-shadow: 4px 4px 35px 0px black;
}

.wrapper header {
  font-weight: 900;
  font-size: 25px;
}

.inputField {
  display: flex;
  height: 35px;
  width: 100%;
  margin: 50px 0;
  border-bottom: 2px solid #39c75a;
}

.inputField input {
  width: 90%;
  height: 100%;
  border: none;
  background-color: #141518;
  padding: 5px 10px;
  caret-color: #39c75a;
  color: #39c75a;
  font-size: 15px;
  font-weight: 900;
  border-bottom: 1px solid #39c75a;
}

*:focus {
  outline: none;
}

::placeholder {
  color: #39c75a;
  font-size: 15px;
  font-weight: 900;
}

.todoList li {
  margin-top: 30px;
  margin-left: 18px;
}

.wrapper .footer {
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: space-between;
}

.button {
  border: none;
  outline: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 10px;
  float: right;
  border: 2px solid #39c75a;
  border-radius: 5px;
  width: 75px;
  margin: auto;
}

.button:hover {
  color: #141518;
  background-color: #39c75a;
  transition: 0.5s;
}

.footer .pending {
  margin-top: 5px;
}

.addIcon {
  margin-top: 7px;
  float: right;
  cursor: pointer;
  background-color: #141518;
  border-radius: 50%;
  opacity: 1;
  pointer-events: auto;
}

.addIcon:hover {
  background-color: #39c75a;

  transition: 0.5s;
  fill: black;
}

.cancelIcon {
  float: right;
  margin-right: 8px;
  cursor: pointer;
}
</style>
