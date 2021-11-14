<template>
  <div>
    <div v-if="submited" class="goal">
      <h5>Become full-stack dev</h5>
      <ToDoList />
      <ToDoList />
      <ToDoList />
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
import ToDoList from "../components/ToDoList.vue";
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
    ToDoList,
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
  max-width: 400px;
  border-radius: 25px;
  margin: auto;
  color: #fff;
  padding: 25px;
  display: flex;
  justify-content: center;
  margin-bottom: 45px;
  flex-direction: column;
  align-items: center;
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
  max-width: 370px;
  width: 100%;
  background-color: #39c75a;
  color: #fff;
  padding: 20px;
  border-radius: 35px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
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
