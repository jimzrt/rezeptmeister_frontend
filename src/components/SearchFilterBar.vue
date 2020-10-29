<template>
  <q-page-sticky expand position="top">
    <q-toolbar class="YL__sticky bg-white">
      <div
        class="q-gutter-xs"
        v-for="searchKey in nonEmptyFilter"
        :key="searchKey"
      >
        {{ searchKey | canonicalName }}:
        <q-chip
          removable
          span
          v-for="item in value[searchKey]"
          :key="item.id"
          @remove="log(searchKey, item)"
          color="primary"
          text-color="white"
          icon="cake"
          >{{ item.name }}</q-chip
        >
      </div>
    </q-toolbar>
  </q-page-sticky>
</template>

<script>
import { clone, remove } from "lodash";

export default {
  name: "SearchFilterBar",
  props: ["value"],
  computed: {
      nonEmptyFilter() {
          return Object.keys(this.value).sort().filter((key)=>this.value[key].length >0);
      }
  },
  filters: {
    canonicalName(name) {
      switch (name) {
        case "ingredient":
          return "Zutaten";
        case "recipe":
          return "Rezepte";
        case "tag":
          return "Kategorien";
        default:
          return name;
      }
    },
  },
  methods: {
    log(key, item) {
      this.dataCopy = _.clone(this.value);
      _.remove(this.dataCopy[key], item);
      this.updateData();
    },
    updateData() {
      this.$emit("input", this.dataCopy);
    },
  },
  data() {
    return {
      dataCopy: {},
    };
  },
};
</script>

<style lang="sass" scoped>
.YL
  &__sticky
    padding: 10px
    min-height: 49px
    border-bottom: 1px solid rgba(0,0,0,0.12)
    flex-direction: column
    align-items: baseline
</style>
