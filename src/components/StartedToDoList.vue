<template>
  <div v-if="!submited" class="wrapper feedCardToDO">
    <div class="header">
      <header>{{ info }} to-do</header>
      <cancelIcon class="cancelIconStyle" @click="cancel" />
    </div>
    <div class="inputField" v-on:keyup.enter="addTask">
      <input v-model="task" type="text" placeholder="Task name..." />
      <addIcon v-on:click="addTask" class="addIcon" />
    </div>
    <transition-group tag="ul" name="list2" appear class="todoList">
      <li v-for="(item, index) in cTasks" :key="item.taskName">
        {{ item.taskName }}
        <cancelIcon v-on:click="removeTask(index)" class="cancelIcon" />
      </li>
    </transition-group>
    <div v-if="tasks.length > 0" class="footer">
      <span v-on:click="submitToDoList" class="button">Submit</span>
    </div>
  </div>
</template>

<script>
import addIcon from "../assets/Icons/add-icon.svg";
import cancelIcon from "../assets/Icons/cancel-Icon.svg";
import { db } from "@/firebase";
import firebase from "@/firebase";
import moment from "moment";
export default {
  data() {
    return {
      task: null,
      tasks: [],
      submited: false,
    };
  },
  props: ["info", "goalName"],
  name: "ToDoList",
  methods: {
    addTask() {
      if (this.task.length > 0) {
        this.tasks.push({ taskName: this.task, completed: false });
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
      this.submited = !this.submited;
    },
    cancel() {
      console.log("cancel");
      this.submited = false;
      if (this.info == "Daily") {
        this.$parent.startDailyToDo();
      } else if (this.info == "Weekly") {
        this.$parent.startWeeklyToDo();
      } else if (this.info == "Monthly") {
        this.$parent.startMonthlyToDo();
      }
    },
    checkTask(index) {
      console.log("checkTask", index);
    },
    submitToDoList() {
      if (this.tasks.length > 0) {
        console.log("submitToDoListBegin");
        // Get current user
        const user = firebase.auth().currentUser;
        // Access daily to-do collection for a specific goal
        const database = db
          .collection("users")
          .doc(user.uid)
          .collection("goals")
          .doc(this.goalName)
          .collection(`${this.info}ToDos`)
          .doc();

        // submit to-do list to user/goal firestore collection
        database.set({
          Tasks: this.tasks,
          Date: Date.now(),
          Completed: false,
        });
        this.submitTasks();
      } else {
        console.log("To-Do list has no tasks!");
      }
      this.submited = true;
      if (this.info == "Daily") {
        this.$parent.startDailyToDo();
        this.$parent.LoadDailyToDoLists();
        this.submitLatestDailySubmitTime();
      } else if (this.info == "Weekly") {
        this.$parent.startWeeklyToDo();
        this.$parent.LoadWeeklyToDoLists();
        this.submitLatestWeeklySubmitTime();
      } else if (this.info == "Monthly") {
        this.$parent.startMonthlyToDo();
        this.$parent.LoadMonthlyToDoLists();
        this.submitLatestMonthlySubmitTime();
      }
    },
    submitLatestDailySubmitTime() {
      const user = firebase.auth().currentUser;
      // Access collection for a specific goal
      db.collection("users")
        .doc(user.uid)
        .collection("goals")
        .doc(this.goalName)
        .update({
          LatestDailyToDoDate: Date.now(),
        });
    },
    submitLatestWeeklySubmitTime() {
      const user = firebase.auth().currentUser;
      // Access collection for a specific goal
      db.collection("users")
        .doc(user.uid)
        .collection("goals")
        .doc(this.goalName)
        .update({
          LatestWeeklyToDoDate: Date.now(),
        });
    },
    submitLatestMonthlySubmitTime() {
      const user = firebase.auth().currentUser;
      // Access collection for a specific goal
      db.collection("users")
        .doc(user.uid)
        .collection("goals")
        .doc(this.goalName)
        .update({
          LatestMonthlyToDoDate: Date.now(),
        });
    },
  },
  computed: {
    cTasks() {
      return this.tasks;
    },
    postedFromNow() {
      return moment(this.info.Date).fromNow();
    },
  },
  components: {
    addIcon,
    cancelIcon,
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
  min-width: 370px;
  width: 100%;
  background-color: #141518 !important;
  color: #fff;
  padding: 35px !important;
  border-radius: 35px;
  box-shadow: 4px 4px 35px 0px black;
}

@media screen and (max-width: 600px) {
  .wrapper {
    min-width: 250px !important;
    padding: 25px !important;
    min-height: 0px;

    header {
      font-size: 13px !important;
    }
  }
  .todoList {
    font-size: 12px;
  }

  .inputField input {
    font-size: 10px !important;
  }

  .todoList li {
    margin-top: 20px !important;
    list-style: none;
  }

  .todoList li:before {
    content: "·";
    font-size: 40px !important;
    vertical-align: left;
    line-height: 5px;
    float: left;
    margin-right: 10px;
    margin-top: 7px !important;
  }

  .cancelIcon {
    width: 6px !important;
    margin-bottom: 1px;
  }

  ::placeholder {
    font-size: 11px !important;
  }

  .button {
    padding: 4px 9px !important;
    font-size: 11px !important;
  }

  .addIcon {
    margin-top: 10px !important;
    margin-right: 4px !important;
    width: 7px !important;
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
  margin-right: 0px;
  float: right;
  cursor: pointer;
  fill: #fff;
  background-color: #141518;
  width: 9px;
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

.cancelIconStyle {
  width: 6px !important;
  right: 0px;
  margin-bottom: 25px;
  margin-right: 4px;
  cursor: pointer;
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

.list2-move {
  transition: all 0.3s ease;
}
</style>
