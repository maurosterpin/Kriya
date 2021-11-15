<template>
  <div class="wrapper2">
    <div class="wrapper-add"><addIcon class="add-icon" /></div>
  </div>
</template>

<script>
import addIcon from "../assets/Icons/add-icon.svg";
export default {
  name: "AddToDoListDesktop",
  components: {
    addIcon,
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.wrapper2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 320px;
  width: 350px;
}

.wrapper-add {
  margin: 15px auto;
  width: 100%;
  height: 100%;
  background-color: #ffffff49 !important;
  color: #fff;
  border-radius: 35px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.add-icon {
  width: 25px;
}
</style>
