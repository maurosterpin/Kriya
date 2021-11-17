<template>
  <div class="wrapper feedCardToDO">
    <div class="header">
      <header>Daily to-do</header>
      <p v-if="submited">just now</p>
    </div>
    <div v-if="!submited" class="inputField">
      <input v-model="task" type="text" placeholder="Task name..." />
      <addIcon v-on:click="addTask" class="addIcon" />
    </div>
    <ul class="todoList">
      <li v-for="(item, index) in cTasks" :key="index">
        {{ item }}
        <cancelIcon
          v-if="!submited"
          v-on:click="removeTask(index)"
          class="cancelIcon"
        />
        <checkMarkIcon
          v-else
          v-on:click="checkTask(index)"
          class="checkMarkIcon"
        />
      </li>
    </ul>
    <div class="footer">
      <span v-if="!submited" v-on:click="submitTasks" class="button"
        >Submit</span
      >
    </div>
  </div>
</template>

<script>
import addIcon from "../assets/Icons/add-icon.svg";
import cancelIcon from "../assets/Icons/cancel-Icon.svg";
import checkMarkIcon from "../assets/Icons/check-mark.svg";
export default {
  data() {
    return {
      task: null,
      tasks: ["Practice Vue", "Practice JavaScript", "Practice CSS"],
      submited: false,
    };
  },
  name: "ToDoList",
  methods: {
    addTask() {
      if (this.task != null) {
        this.tasks.push(this.task);
        console.log(this.tasks);
        this.task = null;
      } else {
        console.log("The field is empty!");
      }
    },
    removeTask(index) {
      this.tasks.splice(index, 1);
      console.log("Task removed!");
    },
    submitTasks() {
      console.log("submitTasks");
      this.submited = true;
    },
    checkTask(index) {
      console.log("checkTask", index);
    },
  },
  computed: {
    cTasks() {
      return this.tasks;
    },
  },
  components: {
    addIcon,
    cancelIcon,
    checkMarkIcon,
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.wrapper {
  margin: 15px auto;
  max-width: 370px;
  min-height: 320px;
  width: 100%;
  background-color: #141518 !important;
  color: #fff;
  padding: 35px !important;
  border-radius: 35px;
  box-shadow: 4px 4px 35px 0px black;
}

@media screen and (max-width: 380px) {
  .wrapper {
    max-width: 250px;
    padding: 25px !important;
    min-height: 0px;

    header {
      font-size: 18px !important;
    }
  }
  .addIcon {
    margin-top: 10px !important;
    margin-right: 0px !important;
    width: 8px !important;
    cursor: pointer;
    fill: #fff;
    background-color: #141518;
  }

  .inputField input {
    width: 85% !important;
  }
}

.wrapper .header {
  display: flex;
  justify-content: space-between;
}

.wrapper .header header {
  font-size: 20px;
  margin-bottom: 15px;
}

.wrapper .header p {
  margin-top: 5px;
}

.wrapper .inputField {
  width: 100%;
  border-bottom: 2px solid #39c75a;
}

.inputField input {
  width: 90%;
  height: 100%;
  border: none;
  background-color: #141518;
  padding: 5px 10px;
  caret-color: #39c75a;
  color: #fff !important;
  font-size: 14px;
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
  list-style: none;
}

.todoList li:before {
  content: "·";
  font-size: 65px;
  vertical-align: left;
  line-height: 5px;
  float: left;
  margin-right: 10px;
  margin-top: 4px;
}

.wrapper .footer {
  position: relative;
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: center;
}

.button {
  position: absolute;
  outline: none;
  font-size: 15px;
  cursor: pointer;
  padding: 9px 17px;
  float: right;
  margin-top: 13px;
  background-color: #39c75a;
  border-radius: 35px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
}

.footer .pending {
  margin-top: 5px;
}

.addIcon {
  margin-top: 12px;
  margin-right: 5px;
  float: right;
  cursor: pointer;
  fill: #fff;
  background-color: #141518;
  width: 10px;
}

.cancelIcon {
  margin-left: 20px;
  margin-top: 7px;
  cursor: pointer;
  width: 8px;
}

.checkMarkIcon {
  float: right;
  margin-right: 6px;
  cursor: pointer;
}
</style>
