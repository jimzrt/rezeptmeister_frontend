<template>
    <keep-alive exclude="RecipeOverview">
      <router-view />
    </keep-alive>
</template>

<script>

export default {
  name: "MyLayout",
  components: {
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
  methods: {
  },
  mounted() {

  },
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
