<template>
  <div class="wrapper feedCardToDO" :style="{ 'background-color': info.Color }">
    <div class="header">
      <header>{{ listType }} to-do</header>
      <p>
        {{ postedFromNow }}
      </p>
      <cancelIcon
        v-if="!goalCompleted && !onFeed && goalUID === currentUID"
        class="cancelIconStyle"
        @click="cancel"
      />
    </div>
    <ul class="todoList">
      <li
        v-for="(item, index) in info.Tasks"
        :key="index"
        :class="{ 'task-completed': item.completed }"
      >
        {{ item.taskName }}

        <checkMarkIcon
          v-if="!item.completed && goalUID === currentUID"
          v-on:click="checkTask(index)"
          class="checkMarkIcon"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import checkMarkIcon from "../assets/Icons/check-mark.svg";
import cancelIcon from "../assets/Icons/cancel-Icon.svg";
import moment from "moment";
import { db } from "@/firebase";
import firebase from "@/firebase";
export default {
  data() {
    return {
      task: null,
      tasks: [],
      submited: false,
      completed: null,
      currentUID: null,
    };
  },
  props: [
    "info",
    "listType",
    "passedID",
    "goalName",
    "goalUID",
    "goalCompleted",
    "onFeed",
  ],
  name: "ToDoList",
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUID = firebase.auth().currentUser.uid;
      }
    });
    this.getTasks();
  },
  methods: {
    cancel() {
      // Get current user
      const user = firebase.auth().currentUser;
      console.log("cancel");
      // Delete to-do list
      db.collection("users")
        .doc(user.uid)
        .collection("goals")
        .doc(this.goalName)
        .collection(`${this.listType}ToDos`)
        .doc(this.info.docID)
        .delete()
        .then(() => {
          this.$parent.$parent.LoadDailyToDoLists();
          this.$parent.$parent.LoadWeeklyToDoLists();
          this.$parent.$parent.LoadMonthlyToDoLists();
        });
    },
    addTask() {
      if (this.task != null) {
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
      this.submited = true;
    },
    checkTask(index) {
      console.log("checkTask", index);
      this.getTasks();
      setTimeout(() => {
        this.tasks[index].completed = true;
        this.updateTasks();
      }, 150);
    },
    getTasks() {
      console.log("getTasks");
      // Get current user
      const user = firebase.auth().currentUser;
      // Access tasks
      db.collection("users")
        .doc(user.uid)
        .collection("goals")
        .doc(this.goalName)
        .collection(`${this.listType}ToDos`)
        .doc(this.info.docID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Getting tasks from firestore");
            this.tasks = doc.data().Tasks;
            this.completed = doc.data().Completed;
            this.date = doc.data().Date;
          } else {
            console.log("To-do list document doesn't exist");
          }
        })
        .then(() => {
          console.log("Finished");
          if (this.completed == false) {
            this.checkIfToDoCompleted();
          }
        });
    },

    updateTasks() {
      console.log("updateTasks");
      // Get current user
      const user = firebase.auth().currentUser;
      // Access tasks
      db.collection("users")
        .doc(user.uid)
        .collection("goals")
        .doc(this.goalName)
        .collection(`${this.listType}ToDos`)
        .doc(this.info.docID)
        .update({
          Tasks: this.tasks,
          Completed: this.completed,
        })
        .then(() => {
          this.getTasks();
          if (this.listType == "Daily") {
            this.$parent.$parent.LoadDailyToDoLists();
          } else if (this.listType == "Weekly") {
            this.$parent.$parent.LoadWeeklyToDoLists();
          } else if (this.listType == "Monthly") {
            this.$parent.$parent.LoadMonthlyToDoLists();
          }
        });
    },
    checkIfToDoCompleted() {
      console.log("checkIfToDoCompleted Started");
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].completed == false) {
          return;
        }
      }
      this.completed = true;
      console.log("ToDoCompleted, starting updateTasks", this.completed);
      this.updateTasks();
      this.postCompletedToDo();
    },
    postCompletedToDo() {
      // Get current user
      const user = firebase.auth().currentUser;
      console.log("postCompletedToDo");
      db.collection("posts")
        .doc()
        .set({
          Tasks: this.tasks,
          Completed: this.completed,
          ListType: this.listType,
          Date: this.date,
          CompletionDate: Date.now(),
          UID: user.uid,
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
    checkMarkIcon,
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

.cancelIconStyle {
  width: 6px !important;
  right: 0px;
  margin-bottom: 25px;
  margin-right: 4px;
  cursor: pointer;
}

.wrapper {
  margin: 15px auto;
  max-width: 370px;
  width: 100%;
  background-color: #141518 !important;
  color: #fff;
  padding: 35px !important;
  border-radius: 35px;
  box-shadow: 4px 4px 35px 0px black;
  transition: all 0.3s ease;
}

.wrapper:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 1);
}

@media screen and (max-width: 1000px) {
  .wrapper {
    /* max-width: 210px; */
    padding: 25px !important;
    min-height: 0px;
    font-size: 11px;

    header {
      font-size: 13px !important;
    }

    .header p {
      margin-top: 2px !important;
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

  .checkMarkIcon {
    width: 13px !important;
    margin-bottom: 10px !important;
  }

  .todoList li:before {
    content: "·";
    font-size: 40px !important;
    line-height: 5px;
    float: left;
    margin-right: 10px;
    margin-top: 4px;
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

.task-completed {
  text-decoration: line-through;
}

.todoList li {
  margin-top: 30px;
  list-style: none;
}

.todoList li:first-child {
  margin-top: 12px;
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
