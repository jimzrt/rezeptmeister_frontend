<template>
  <q-page-sticky expand position="top" style="transform: translate(0px, 60px)">
    <q-toolbar class="bg-grey-3 shadow-1 ">
      <div class="" v-for="(searchKey, index) in nonEmptyFilter" :key="searchKey">
        <template v-if="index > 0"><q-separator vertical /></template>
        <q-btn stretch flat :label="searchKey | canonicalName" />
        <q-chip
        dense
        square
          removable
          v-for="item in value[searchKey]"
          :key="item.id"
          @remove="log(searchKey, item)"
          color="primary"
          text-color="white"
          >{{ item.name }}</q-chip
        >
      </div>
    </q-toolbar>

    <!-- 
    <q-toolbar class="YL__sticky bg-white">
      <div
        class="q-gutter-xs"
        v-for="(searchKey,index) in nonEmptyFilter"
        :key="searchKey"
      >
      <div>
      <template v-if="index>0"><q-separator size="16px" spaced inset vertical />123</template>
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
        ></div>
      </div>
    </q-toolbar> -->
  </q-page-sticky>
</template>

<script>
import { clone, remove } from "lodash";

export default {
  name: "SearchFilterBar",
  props: ["value"],
  computed: {
    nonEmptyFilter() {
      return Object.keys(this.value)
        .sort()
        .filter((key) => this.value[key].length > 0);
    },
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
    flex-direction: row
    // align-items: baseline
</style>
