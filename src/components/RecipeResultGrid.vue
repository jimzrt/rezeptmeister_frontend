<template>
  <div>
    <transition name="list">
      <div
        class="q-pa-md row items-center flex-center q-gutter-md"
        style="margin-bottom: 80px"
        v-if="currentRecipes.content && currentRecipes.content.length > 0"
      >
        <q-card
          class="my-card"
          v-for="recipe in currentRecipes.content"
          :key="recipe.id"
        >
          <q-img :src="'http://localhost:8080' + recipe.pictureUrl" />

          <q-card-section>
            <q-btn
              fab
              size="xs"
              color="blue-grey-3"
              :label="recipe.difficulty | germanDifficulty"
              icon="stars"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%)"
            />
            <div class="row no-wrap items-center">
              <div class="text-h6 my-font col ellipsis">{{ recipe.title }}</div>
              <div
                class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
              >
                <q-icon name="place" />
                250 ft
              </div>
            </div>
            <div class="text-subtitle2">by Edeka</div>
          </q-card-section>
          <q-separator />
          <q-card-section horizontal>
            <q-card-section class="text-body2">
              {{ recipe.description }}
            </q-card-section>

            <q-separator vertical />

            <q-card-section class="col-4">
              <div v-for="tag in recipe.tags.slice(0, 5)" :key="tag.id">
                {{ tag.name }}
              </div>
            </q-card-section>
          </q-card-section>
          <q-separator />
          <q-card-section horizontal>
            <q-card-section class="text-body2">
              {{ recipe.ingredients.map((i) => i.name).join(", ") }}
            </q-card-section>
          </q-card-section>
          <!-- <q-card-section class="q-pt-none text-body2">
            {{ recipe.description }}
          </q-card-section> -->
        </q-card>
      </div>
      <div
        v-else-if="!searchFilterEmpty && !loading"
        style="display: flex; align-items: center; justify-content: center"
      >
        <h4>Keine Rezepte gefunden :(</h4>
      </div>
    </transition>

    <template v-if="currentRecipes.content">
      <q-page-sticky expand position="bottom" style="background: white">
        <div class="q-pa-md flex flex-center">
          <q-pagination
            :direction-links="true"
            :value="currentPage"
            :max="currentRecipes.totalPages"
            :max-pages="6"
            :boundary-numbers="true"
            @input="changePage"
          >
          </q-pagination>
        </div>
      </q-page-sticky>
    </template>
  </div>
</template>

<script>
import { clone, remove, pick } from "lodash";

export default {
  name: "RecipeResultGrid",
  props: ["value"],

  computed: {
    nonEmptyFilter() {
      return Object.keys(this.value)
        .sort()
        .filter((key) => this.value[key].length > 0);
    },
    searchFilterEmpty() {
      for (const key of Object.keys(this.value)) {
        if (this.value[key].length > 0) {
          return false;
        }
      }
      return true;
    },
  },
  filters: {
        germanDifficulty(name) {
      switch (name) {
        case "EASY":
          return "Einfach";
        case "MEDIUM":
          return "Medium";
        case "HARD":
          return "Schwer";
        default:
          return name;
      }
    },
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
    changePage(value) {
      console.log(value);
      if (this.currentPage == value) {
        return;
      }
      this.currentPage = value;
      this.loadData();
    },
    log(key, item) {
      this.dataCopy = _.clone(this.value);
      _.remove(this.dataCopy[key], item);
      this.updateData();
    },
    updateData() {
      this.$emit("input", this.dataCopy);
    },
    loadData() {
      //filter ids
      this.loading = true;
      let searchFilter = {};
      Object.keys(this.value).forEach((key) => {
        searchFilter[key] = this.value[key].map((value) => value.id);
      });

      searchFilter["page"] = this.currentPage - 1;
      searchFilter["count"] = this.resultCount;

      console.log(searchFilter);
      this.currentRecipes = [];
      this.$axios
        .post("http://localhost:8080/recipe/search", searchFilter)
        .then((response) => {
          this.currentRecipes = response.data;
          console.log(response.data);
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        })
        .then(() => {
          this.loading = false;
        });
    },
  },
  data() {
    return {
      loading: false,
      dataCopy: {},
      currentRecipes: [],
      currentPage: 1,
      resultCount: 12,
      lorem:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    };
  },
  watch: {
    "$props.value": {
      handler: function (val, oldVal) {
        console.log("watch Searchfilter", oldVal, val);
        if (this.searchFilterEmpty) {
          this.currentRecipes = [];
          this.currentPage = 1;
          return;
        }
        this.loadData();
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 400px
</style>
