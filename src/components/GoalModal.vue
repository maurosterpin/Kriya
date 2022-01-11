<template>
  <div class="modalBackground">
    <div class="modalContainer">
      <cancelIcon
        class="cancelIconStyle"
        @click="$parent.GoalCompletePressed"
      />
      <h5>Are you sure?</h5>
      <p>
        You won't be able to create to-do lists for this goal anymore if you
        declare it as completed!
      </p>
      <div class="modalYes" @click="$parent.GoalComplete">Yes!</div>
    </div>
  </div>
</template>

<script>
import cancelIcon from "../assets/Icons/cancel-Icon.svg";
export default {
  name: "GoalModal",
  components: {
    cancelIcon,
  },
};
</script>

<style scoped>
.modalBackground {
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  z-index: 199;
  position: absolute;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  bottom: 0px;
}

.modalContainer {
  /* margin-top: 50%; */
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: #db0c2f;
  padding: 25px;
  border-radius: 25px;
  color: #fff;
  max-width: 400px;
  text-align: center;
  align-items: center;
  z-index: 200;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.7);
}

.modalYes {
  padding: 10px;
  background-color: #39c75a;
  width: 65px;
  margin: auto;
  border-radius: 50px;
  position: absolute;
  margin-top: 94px;
  z-index: 205;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.modalYes:hover {
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 1);
}

.cancelIconStyle {
  width: 6px !important;
  right: 25px;
  cursor: pointer;
  position: absolute;
}

@media screen and (max-width: 1000px) {
  .modalYes {
    margin-top: 115px;
  }
}
</style>
