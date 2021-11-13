<template>
  <div class="home-wrapper">
    <div class="home">
      <router-view />
    </div>
  </div>
</template>

<script>
import store from "@/store";
export default {
  name: "Home",
  components: {},
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

<style lang="scss">
.home {
  background-color: #39c75a;
}
</style>
