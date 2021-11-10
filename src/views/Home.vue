<template>
  <div class="app-wrapper">
    <div class="app">
      <Goal />
      <ToDoList />
      <router-view />
    </div>
  </div>
</template>

<script>
import ToDoList from "../components/ToDoList.vue";
import Goal from "../components/Goal.vue";
import store from "@/store";
export default {
  name: "Home",
  components: {
    ToDoList,
    Goal,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    console.log("STORE", store.logged);
  },
  methods: {},
  watch: {},
};
</script>

<style lang="scss"></style>
