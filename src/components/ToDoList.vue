<template>
  <div class="wrapper">
    <header>Daily tasks</header>
    <div class="inputField">
      <input v-model="task" type="text" placeholder="Add a new daily task" />
      <addIcon class="addIcon" />
    </div>
    <ul class="todoList">
      <li>Practice Vue<cancelIcon class="cancelIcon" /></li>
      <li>Practice JavaScript<cancelIcon class="cancelIcon" /></li>
      <li>Practice CSS<cancelIcon class="cancelIcon" /></li>
    </ul>
    <div class="footer">
      <span class="pending">You have 3 pending tasks</span>
      <span class="button">Submit</span>
    </div>
  </div>
</template>

<script>
import addIcon from "../assets/Icons/add-icon.svg";
import cancelIcon from "../assets/Icons/cancel-Icon.svg";
export default {
  name: "ToDoList",
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
  margin-bottom: 15px;
}

.wrapper .inputField {
  display: flex;
  height: 35px;
  width: 100%;
  margin: 10px 0;
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

.footer .button {
  border: none;
  outline: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 10px;
  float: right;
  border: 2px solid #39c75a;
  border-radius: 5px;
}

.footer .button:hover {
  color: #141518;
  background-color: #39c75a;
  transition: 0.5s;
}

.footer .pending {
  margin-top: 5px;
}

.addIcon {
  margin-top: 3px;
  float: right;
  cursor: pointer;
  background-color: #141518;
  border-radius: 50%;
  opacity: 0.5;
  pointer-events: none;
}

.addIcon:active {
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
