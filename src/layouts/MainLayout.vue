<template>
  <Flipper :flip-key="key" spring="">
    <keep-alive exclude="RecipeOverview">
      <router-view />
    </keep-alive>
  </Flipper>
</template>

<script>
import { Flipper } from "vue-flip-toolkit";

export default {
  name: "MyLayout",
  components: {
    Flipper,
  },
  data() {
    return {};
  },

  beforeDestroy() {},
  computed: {
    key() {
      return this.$route.path;
    },
  },
  methods: {},
};
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
<style lang="sass"></style>
