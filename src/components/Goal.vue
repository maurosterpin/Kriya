<template>
  <div>
    <div v-if="!submited">
      <form>
        <input
          class="inputField"
          type="text"
          id="goalDescription"
          name="description"
          placeholder="Goal name..."
        />

        <input
          class="inputField"
          type="text"
          id="goalReason"
          name="theWhy"
          placeholder="The why..."
        />

        <span v-on:click="submitTasks" class="button"><p>Submit</p></span>
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
  background-color: #39c75a;
  padding: 45px;
  border-radius: 35px;
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
  background-color: #39c75a;
  color: #fff;
  padding: 20px;
  border-radius: 35px;
  box-shadow: 4px 4px 35px 0px black;
}

.wrapper header {
  font-size: 20px;
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
