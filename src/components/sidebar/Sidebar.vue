<template>
  <div>
    <div class="sidebar" :style="{ width: sidebarWidth }"></div>
    <div class="collapse-icon" @click="toggleSidebar">
      <doubleArrow
        class="doubleArrow"
        :class="{ 'rotate-180': !collapsed }"
        :style="{ 'margin-left': doubleArrowMarginLeft }"
      />
    </div>
  </div>
</template>

<script>
import doubleArrow from "../../assets/Icons/double-arrow-right.svg";
export default {
  name: "Sidebar",
  data() {
    return {
      collapsed: true,
      SIDEBAR_WIDTH: 230,
      SIDEBAR_WIDTH_COLLAPSED: 0,
      MARGIN_LEFT: 185,
      MARGIN_LEFT_COLLAPSED: 0,
    };
  },
  methods: {
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    },
  },
  computed: {
    sidebarWidth() {
      return `${
        this.collapsed ? this.SIDEBAR_WIDTH_COLLAPSED : this.SIDEBAR_WIDTH
      }px`;
    },
    doubleArrowMarginLeft() {
      return `${
        this.collapsed ? this.MARGIN_LEFT_COLLAPSED : this.MARGIN_LEFT
      }px`;
    },
  },
  components: {
    doubleArrow,
  },
};
</script>

<style scoped>
.sidebar {
  color: #fff;
  background-color: #39c75a;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.3);

  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;

  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
}

.doubleArrow {
  fill: #fff;
  width: 38px;
  padding: 0.75em;
  margin-bottom: 5px;
  position: fixed;
  bottom: 0;
  z-index: 2;
  display: flex;
  transition: 0.4s ease;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: 0.4s ease;
}
</style>
