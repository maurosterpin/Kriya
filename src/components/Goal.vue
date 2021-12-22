<template>
  <div>
    <div class="goal" :class="{ 'new-width': !goalCountOver1 }">
      <h5>{{ info.goalTitle }}</h5>

      <div v-if="this.daily.length > 0" class="to-do-wrapper">
        <div
          v-if="!DailyToDoStarted && $router.currentRoute.path == '/profile'"
          @click="startDailyToDo"
          class="addNewToDoListBtn"
        >
          <addIcon v-if="!info.completed" class="addIconBtn" />
        </div>
        <div v-if="DailyToDoStarted">
          <StartedToDoList info="Daily" :goalName="info.goalTitle" />
        </div>
        <ToDoList
          class="to-do-item"
          v-for="todo in daily"
          :key="todo.name"
          :info="todo"
          listType="Daily"
          :passedID="todo.docID"
          :goalName="info.goalTitle"
        />
      </div>
      <div v-else-if="DailyToDoStarted">
        <StartedToDoList info="Daily" :goalName="info.goalTitle" />
      </div>
      <div
        v-else-if="$router.currentRoute.path == '/profile' && !info.completed"
        class="addToDo"
        @click="startDailyToDo"
      >
        <h6>Add Daily To-Do</h6>
        <addIcon class="addIcon" />
      </div>

      <div v-if="this.weekly.length > 0" class="to-do-wrapper">
        <div
          v-if="!WeeklyToDoStarted && $router.currentRoute.path == '/profile'"
          @click="startWeeklyToDo"
          class="addNewToDoListBtn"
        >
          <addIcon v-if="!info.completed" class="addIconBtn" />
        </div>
        <div v-if="WeeklyToDoStarted">
          <StartedToDoList info="Weekly" :goalName="info.goalTitle" />
        </div>
        <ToDoList
          class="to-do-item"
          v-for="todo in weekly"
          :key="todo.name"
          :info="todo"
          listType="Weekly"
          :passedID="todo.docID"
          :goalName="info.goalTitle"
        />
      </div>
      <div v-else-if="WeeklyToDoStarted">
        <StartedToDoList info="Weekly" :goalName="info.goalTitle" />
      </div>
      <div
        v-else-if="$router.currentRoute.path == '/profile' && !info.completed"
        class="addToDo"
        @click="startWeeklyToDo"
      >
        <h6>Add Weekly To-Do</h6>
        <addIcon class="addIcon" />
      </div>

      <div v-if="this.monthly.length > 0" class="to-do-wrapper">
        <div
          v-if="!MonthlyToDoStarted && $router.currentRoute.path == '/profile'"
          @click="startMonthlyToDo"
          class="addNewToDoListBtn"
        >
          <addIcon v-if="!info.completed" class="addIconBtn" />
        </div>
        <div v-if="MonthlyToDoStarted">
          <StartedToDoList info="Monthly" :goalName="info.goalTitle" />
        </div>
        <ToDoList
          class="to-do-item"
          v-for="todo in monthly"
          :key="todo.name"
          :info="todo"
          listType="Monthly"
          :passedID="todo.docID"
          :goalName="info.goalTitle"
        />
      </div>
      <div v-else-if="MonthlyToDoStarted">
        <StartedToDoList info="Monthly" :goalName="info.goalTitle" />
      </div>
      <div
        v-else-if="$router.currentRoute.path == '/profile' && !info.completed"
        class="addToDo"
        @click="startMonthlyToDo"
      >
        <h6>Add Monthly To-Do</h6>
        <addIcon class="addIcon" />
      </div>
      <div
        v-if="!info.completed && this.currentUserID === info.goalUID"
        class="goalFinished"
        @click="GoalComplete"
      >
        <checkMarkIcon class="goalFinishedIcon" />
      </div>

      <div v-else class="completed">Completed</div>
    </div>
  </div>
</template>

<script>
import addIcon from "../assets/Icons/add-icon.svg";
import ToDoList from "./ToDoList.vue";
import StartedToDoList from "./StartedToDoList.vue";
import { db } from "@/firebase";
import firebase from "@/firebase";
import checkMarkIcon from "../assets/Icons/check-mark.svg";
export default {
  data() {
    return {
      task: null,
      tasks: ["Practice Vue", "Practice JavaScript", "Practice CSS"],
      goalSetup: false,
      goalTitle: "",
      goalMessage: "",
      daily: [],
      weekly: [],
      monthly: [],
      goalCountOver1: false,
      DailyToDoStarted: false,
      WeeklyToDoStarted: false,
      MonthlyToDoStarted: false,
      LatestDailyDate: null,
      LatestWeeklyDate: null,
      LatestMonthlyDate: null,
      currentUserID: "",
    };
  },
  mounted() {
    this.currentUserID = firebase.auth().currentUser.uid;
    this.LoadDailyToDoLists();
    this.LoadWeeklyToDoLists();
    this.LoadMonthlyToDoLists();
    //this.checkGoalCount();
    console.log("GOAL COUNTER", this.goalCountOver1, this.daily.length);
  },
  props: ["info"],
  name: "Goal",
  methods: {
    checkGoalCount() {
      if (
        this.daily.length > 1 ||
        this.weekly.length > 1 ||
        this.monthly.length > 1
      ) {
        this.goalCountOver1 = true;
      }
    },
    startDailyToDo() {
      if (
        this.LatestDailyDate <= Date.now() - 60 * 60 * 24 * 1000 ||
        this.LatestDailyDate == undefined
      ) {
        this.DailyToDoStarted = !this.DailyToDoStarted;
        console.log("Started Daily");
      } else {
        alert("You can start only one daily To-Do every 24 hours");
      }
    },
    startWeeklyToDo() {
      if (
        this.LatestWeeklyDate <= Date.now() - 60 * 60 * 24 * 1000 * 7 ||
        this.LatestWeeklyDate == undefined
      ) {
        this.WeeklyToDoStarted = !this.WeeklyToDoStarted;
        console.log("Started Weekly");
      } else {
        alert("You can start only one weekly To-Do every 7 days");
      }
    },
    startMonthlyToDo() {
      if (
        this.LatestMonthlyDate <= Date.now() - 60 * 60 * 24 * 1000 * 30 ||
        this.LatestMonthlyDate == undefined
      ) {
        this.MonthlyToDoStarted = !this.MonthlyToDoStarted;
        console.log("Started Monthly");
      } else {
        alert("You can start only one monthly To-Do every 30 days");
      }
    },
    LoadDailyToDoLists() {
      this.getLatestDailyToDoDate();
      console.log("LoadDailyToDoListsBegin");
      // Get current user
      const user = firebase.auth().currentUser;
      // Access daily to-do collection for a specific goal
      if (this.$router.currentRoute.path == "/profile") {
        const database = db
          .collection("users")
          .doc(user.uid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .collection("DailyToDos");

        // get to-do lists from user/goal firestore collection
        database
          .orderBy("Date", "desc")
          .get()
          .then((query) => {
            this.daily = [];
            query.forEach((doc) => {
              const data = doc.data();
              this.daily.push({
                Tasks: data.Tasks,
                Date: data.Date,
                Completed: data.Completed,
                docID: doc.id,
              });
            });
            this.checkGoalCount();
          });
      } else {
        const database = db
          .collection("users")
          .doc(this.$route.params.profileUid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .collection("DailyToDos");

        // get to-do lists from user/goal firestore collection
        database
          .orderBy("Date", "desc")
          .get()
          .then((query) => {
            this.daily = [];
            query.forEach((doc) => {
              const data = doc.data();
              this.daily.push({
                Tasks: data.Tasks,
                Date: data.Date,
                Completed: data.Completed,
                docID: doc.id,
              });
            });
            this.checkGoalCount();
          });
      }
    },
    LoadWeeklyToDoLists() {
      this.getLatestWeeklyToDoDate();
      console.log("LoadWeeklyToDoListsBegin");
      // Get current user
      const user = firebase.auth().currentUser;
      // Access daily to-do collection for a specific goal
      if (this.$router.currentRoute.path == "/profile") {
        const database = db
          .collection("users")
          .doc(user.uid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .collection("WeeklyToDos");

        // get to-do lists from user/goal firestore collection
        database
          .orderBy("Date", "desc")
          .get()
          .then((query) => {
            this.weekly = [];
            query.forEach((doc) => {
              const data = doc.data();
              this.weekly.push({
                Tasks: data.Tasks,
                Date: data.Date,
                Completed: data.Completed,
                docID: doc.id,
              });
            });
            this.checkGoalCount();
          });
      } else {
        const database = db
          .collection("users")
          .doc(this.$route.params.profileUid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .collection("WeeklyToDos");

        // get to-do lists from user/goal firestore collection
        database
          .orderBy("Date", "desc")
          .get()
          .then((query) => {
            this.weekly = [];
            query.forEach((doc) => {
              const data = doc.data();
              this.weekly.push({
                Tasks: data.Tasks,
                Date: data.Date,
                Completed: data.Completed,
                docID: doc.id,
              });
            });
            this.checkGoalCount();
          });
      }
    },
    LoadMonthlyToDoLists() {
      this.getLatestMonthlyToDoDate();
      console.log("LoadMonthlyToDoListsBegin");
      // Get current user
      const user = firebase.auth().currentUser;
      // Access daily to-do collection for a specific goal
      if (this.$router.currentRoute.path == "/profile") {
        const database = db
          .collection("users")
          .doc(user.uid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .collection("MonthlyToDos");

        // get to-do lists from user/goal firestore collection
        database
          .orderBy("Date", "desc")
          .get()
          .then((query) => {
            this.monthly = [];
            query.forEach((doc) => {
              const data = doc.data();
              this.monthly.push({
                Tasks: data.Tasks,
                Date: data.Date,
                Completed: data.Completed,
                docID: doc.id,
              });
            });
            this.checkGoalCount();
          });
      } else {
        const database = db
          .collection("users")
          .doc(this.$route.params.profileUid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .collection("MonthlyToDos");

        // get to-do lists from user/goal firestore collection
        database
          .orderBy("Date", "desc")
          .get()
          .then((query) => {
            this.monthly = [];
            query.forEach((doc) => {
              const data = doc.data();
              this.monthly.push({
                Tasks: data.Tasks,
                Date: data.Date,
                Completed: data.Completed,
                docID: doc.id,
              });
            });
            this.checkGoalCount();
          });
      }
    },
    getLatestDailyToDoDate() {
      if (this.$router.currentRoute.path == "/profile") {
        // Get current user
        const user = firebase.auth().currentUser;
        // Access tasks
        db.collection("users")
          .doc(user.uid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .get()
          .then((doc) => {
            if (doc.exists) {
              this.LatestDailyDate = doc.data().LatestDailyToDoDate;
            } else {
              console.log("LatestDailyToDoDate doesn't exist!");
            }
          });
      } else {
        db.collection("users")
          .doc(this.$route.params.profileUid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .get()
          .then((doc) => {
            if (doc.exists) {
              this.LatestDailyDate = doc.data().LatestDailyToDoDate;
            } else {
              console.log("LatestDailyToDoDate doesn't exist!");
            }
          });
      }
    },
    getLatestWeeklyToDoDate() {
      if (this.$router.currentRoute.path == "/profile") {
        // Get current user
        const user = firebase.auth().currentUser;
        // Access tasks
        db.collection("users")
          .doc(user.uid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .get()
          .then((doc) => {
            if (doc.exists) {
              this.LatestWeeklyDate = doc.data().LatestWeeklyToDoDate;
              console.log("Latest Weekly Date!!!: ", this.LatestWeeklyDate);
            } else {
              console.log("LatestWeeklyToDoDate doesn't exist!");
            }
          });
      } else {
        db.collection("users")
          .doc(this.$route.params.profileUid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .get()
          .then((doc) => {
            if (doc.exists) {
              this.LatestWeeklyDate = doc.data().LatestWeeklyToDoDate;
              console.log("Latest Weekly Date!!!: ", this.LatestWeeklyDate);
            } else {
              console.log("LatestWeeklyToDoDate doesn't exist!");
            }
          });
      }
    },
    getLatestMonthlyToDoDate() {
      if (this.$router.currentRoute.path == "/profile") {
        // Get current user
        const user = firebase.auth().currentUser;
        // Access tasks
        db.collection("users")
          .doc(user.uid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .get()
          .then((doc) => {
            if (doc.exists) {
              this.LatestMonthlyDate = doc.data().LatestMonthlyToDoDate;
            } else {
              console.log("LatestMonthlyToDoDate doesn't exist!");
            }
          });
      } else {
        db.collection("users")
          .doc(this.$route.params.profileUid)
          .collection("goals")
          .doc(this.info.goalTitle)
          .get()
          .then((doc) => {
            if (doc.exists) {
              this.LatestMonthlyDate = doc.data().LatestMonthlyToDoDate;
            } else {
              console.log("LatestMonthlyToDoDate doesn't exist!");
            }
          });
      }
    },
    GoalComplete() {
      // Get current user
      const user = firebase.auth().currentUser;
      console.log("Goal complete");

      // Update goal completed state
      db.collection("users")
        .doc(user.uid)
        .collection("goals")
        .doc(this.info.goalID)
        .update({ completed: true })
        .then(() => {
          this.postCompletedGoal();
        });
    },
    postCompletedGoal() {
      const user = firebase.auth().currentUser;
      db.collection("posts").add({
        UID: user.uid,
        GoalName: this.info.goalTitle,
        CompletionDate: Date.now(),
      });
    },
  },
  computed: {},
  components: {
    addIcon,
    ToDoList,
    StartedToDoList,
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
  position: relative;
}

@media screen and (max-width: 400px) {
  .goal {
    padding: 15px;
  }
}

.goalFinished {
  padding: 25px;
  background: #141518;
  width: 50px;
  height: 50px;
  position: absolute;
  /* margin-left: 385px; */
  border-radius: 100px;
  /* margin-top: 655px; */
  right: 15px;
  bottom: 15px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.7);
  cursor: pointer;
}

.goalFinishedIcon {
  position: absolute;
  left: 15px;
  top: 16px;
}

.completed {
  padding: 12px 20px;
  position: relative;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.8);
  border-radius: 100px;
  margin: auto;
  background-color: #141518;
}

.new-width {
  width: 450px !important;
}

.goal h5 {
  margin: auto;
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
  overflow-x: auto !important;
  margin-top: 5px;
  padding-top: 10px;
  border-bottom: 15px solid #39c75a;
  position: relative;
}

.addToDo {
  width: 250px;
  background-color: #141518;
  border-radius: 50px;
  padding: 25px;
  display: flex;
  flex-direction: row;
  margin-bottom: 35px !important;
  justify-content: space-between;
  margin: auto;
}

.addIcon {
  width: 15px;
}

.addIconBtn {
  position: absolute;
  width: 30px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 50px;
  background-color: #39c75a;
  cursor: pointer;
  margin-left: 10px;
}

.addIconBtn:hover {
  width: 31px;
  transition: 0.2s;
}

.to-do-item {
  margin-top: 5px !important;
  margin-right: 0px !important;
  margin-left: 15px !important;
  min-width: 370px;
  margin-bottom: 25px !important;
}

@media screen and (max-width: 380px) {
  .to-do-item {
    min-width: 250px;
  }
  .goal h5 {
    margin-top: 10px;
    font-size: 15px;
  }

  .goal {
    padding: 0px 2px;
    margin-right: 10px;
    margin-left: 10px;
  }
  .goalFinishedIcon {
    position: absolute;
    left: 9px;
    top: 6px;
    width: 13px;
  }
  .goalFinished {
    padding: 15px;
    width: 12px;
    height: 12px;
    right: 10px;
    bottom: 5px;
  }

  .to-do-wrapper {
    display: flex;
    flex-direction: row;
    overflow-x: auto !important;
    margin-top: 0px;
    padding-top: 10px;
    border-bottom: 15px solid #39c75a;
    position: relative;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
  }

  /* .to-do-wrapper::-webkit-scrollbar {
    height: 0px;
  } */
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
