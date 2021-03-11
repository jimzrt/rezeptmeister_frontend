<template>
  <div>
    <q-banner
      class="top-banner-pagination"
      style="margin-top: 55px"
      v-if="currentRecipes && currentRecipes.length > 0"
    >
      <div style="display: flex; flex-grow: 1; align-items: center">
        <div>{{ totalElements }} Rezepte gefunden</div>
        <q-space />
        <q-select
          :value="resultCount"
          :options="resultsPerPageOptions"
          @input="resultPerPageChanged"
          label="Rezepte pro Seite"
          style="width: 150px"
        />
      </div>
    </q-banner>
    <div>
      <div
        class="q-pa-l row items-center flex-center q-gutter-xl"
        style="margin-bottom: 30px; padding-top: 40px"
        v-if="currentRecipes.length > 0"
      >
        <q-intersection
          style="min-height: 768px; width: 400px"
          v-for="(recipe, index) in currentRecipes"
          :key="recipe.id"
          transition="fade"
          :disable="intersectionDisabled"
        >
          <RecipeCard
            :recipe="recipe"
            :index="index"
            @onAddToSearch="addToSearch"
          />
        </q-intersection>
        <div v-for="i in currentPlaceholders" :key="i + '_ph'">
          <q-card style="max-width: 400px; height: 785px">
            <q-item style="height: 54px">
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" style="width: 150px" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="346px" square />

            <q-card-actions style="height: 88px">
              <q-skeleton type="text" style="width: 150px" />
              <q-space />
              <q-skeleton type="QBtn" />
            </q-card-actions>
            <q-separator />
            <q-skeleton type="text" v-for="i in 10" :key="i + '_sk'" />
          </q-card>
        </div>
      </div>

      <div
        v-else-if="!searchFilterEmpty && !loading"
        style="display: flex; align-items: center; justify-content: center"
        class="absolute-center"
      >
        <h4>Keine Rezepte gefunden :(</h4>
      </div>
    </div>

    <template v-if="currentRecipes.length > 0">
      <div class="q-pa-md flex flex-center">
        <q-pagination
          :direction-links="true"
          :value="currentPage"
          :max="totalPages"
          :max-pages="6"
          :boundary-numbers="true"
          @input="changePage"
          color="accent"
        >
        </q-pagination>
      </div>
    </template>
  </div>
</template>

<script>
import SearchFilterMixin from "../mixins/SearchFilterMixin.js";
import RecipeCard from "../components/RecipeCard.vue";

export default {
  name: "RecipeResultGrid",
  props: ["value"],
  components: { RecipeCard },
  mixins: [SearchFilterMixin],
  computed: {
    searchFilterEmpty() {
      return this.deepCheck(this.value);
    },
    flatFilter() {
      return this.flatten(this.value);
    }
  },
  filters: {
    backendPictureUrl(recipe) {
      return process.env.API + "/images/recipe/" + recipe.seoTitle + "_big.jpg"; //url.split("/").slice(3).join("/");
    },
    truncate(label) {
      if (label.length <= 13) {
        return label;
      }
      return label.substring(0, 10) + "...";
    },
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
    }
  },
  activated() {
    this.intersectionDisabled = false;
  },
  deactivated() {
    this.intersectionDisabled = true;
  },
  methods: {
    expandCard(recipeId) {
      let index = this.expandedCards.indexOf(recipeId);
      if (index == -1) {
        this.expandedCards.push(recipeId);
      } else {
        this.expandedCards.splice(index, 1);
      }
    },
    openRecipe(recipe, index) {
      this.$router.push({
        name: "recipe",
        params: {
          recipeSeoTitle: recipe.seoTitle,
          recipe: recipe,
          index: index
        }
      });
    },
    addToSearch(type, value) {
      this.$emit("onAddToSearch", type, value);
    },
    styleIngredients(ingredients) {
      return ingredients
        .map(i => {
          if (
            this.value["ingredient"] &&
            this.value["ingredient"].some(element => element.id === i.id)
          ) {
            return "<span class='text-weight-bold'>" + i.name + "</span>";
          }
          return i.name;
        })
        .join(", ");
    },
    resultPerPageChanged(value) {
      this.currentPage = 1;
      this.resultCount = value;
      this.loadData();
    },
    changePage(value) {
      if (this.currentPage == value) {
        return;
      }
      this.currentPage = value;
      this.loadData();
    },
    updateData() {
      this.$emit("input", this.dataCopy);
    },
    async loadData() {
      // this.cancelToken = {};
      // const localNonce = this.cancelToken;

      if (this.loadPromise != null) await this.loadPromise;
      //filter ids
      this.loading = true;
      window.scrollTo(0, 0);
      this.currentPlaceholders = 0;
      await this.$nextTick();
      this.$q.loading.show({
        delay: 0 // ms
      });

      let searchFilter = this.flatFilter;

      searchFilter["page"] = this.currentPage - 1;
      searchFilter["count"] = this.resultCount;

      this.currentRecipes = [];
      this.loadPromise = this.$axios
        .post("/recipe/search", searchFilter)
        .then(async response => {
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
          //Todo make better yo
          //this.currentPlaceholders = response.data.content.length;
          this.currentRecipes = Object.freeze(response.data.content);
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem"
          });
        })
        .then(() => {
          this.$q.loading.hide();
          this.loading = false;
          this.currentPlaceholders = 0;
        });
    }
  },
  data() {
    return {
      intersectionDisabled: false,
      loading: false,
      api: process.env.API,
      dataCopy: {},
      currentRecipes: [],
      currentPlaceholders: 0,
      currentPage: 1,
      resultCount: 12,
      totalElements: 0,
      totalPages: 0,
      expandedCards: [],
      resultsPerPageOptions: [12, 24, 36, 48, 96, 192],
      // cancelToken: {},
      loadPromise: null
    };
  },

  watch: {
    "$props.value": {
      handler: function(val, oldVal) {
        if (this.searchFilterEmpty) {
          this.currentRecipes = [];
          this.currentPage = 1;
          return;
        }
        this.currentPage = 1;
        this.loadData();
      },
      deep: true
    }
  }
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
<style lang="sass">
.clipped
  overflow: hidden
.active
  z-index: 1
.pagination-bar
  background-color: var(--q-color-background)
.top-banner-pagination
  background-color: var(--q-color-background)
.q-skeleton--anim-wave, .q-skeleton--anim-blink, .q-skeleton--anim-pop
  z-index: 0
</style>
