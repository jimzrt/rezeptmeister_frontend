<template>
  <div
    class="searchResult"
    style="overflow: auto; max-height: 90vh"
    v-if="search != ''"
  >
    <template
      v-if="
        !loading &&
          ingredients.length == 0 &&
          tags.length == 0 &&
          recipes.length == 0
      "
    >
      <q-item class="list-complete-item">
        <q-item-section no-wrap>
          <div class="row">
            <div class="col-8">
              <h6 class="resultHeading">
                <span>Die Eingabe "{{ search }}" liefert kein Ergebnis!</span>
              </h6>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </template>
    <template v-else>
      <q-list bordered separator padding>
        <q-item-label
          v-if="loading || ingredients.length > 0"
          class="heading"
          header
          >Zutaten</q-item-label
        >

        <template v-if="!loading">
          <div style="max-height:300px;overflow-y: scroll">
            <template v-if="ingredients.length > 0">
              <q-item
                clickable
                v-ripple
                v-for="(ingredient, index) in ingredients"
                :key="ingredient.slug"
                class="list-complete-item"
                :active="selectedIndex == index"
                active-class="bg-blue-1"
                @click="addToSearch('ingredient', ingredient)"
              >
                <q-item-section avatar>
                  <q-avatar circle size="40px">
                    <q-img :src="api + ingredient.pictureUrl" />
                  </q-avatar>
                </q-item-section>
                <q-item-section no-wrap>
                  <div class="row">
                    <div class="col-8">
                      <h6 class="resultHeading">
                        <span v-html="makeBold(ingredient.name)"></span>
                      </h6>
                    </div>
                  </div>
                </q-item-section>

                <q-item-section side>
                  <q-spinner-dots
                    color="primary"
                    size="40px"
                    v-if="ingredient.recipeCount == undefined"
                  />
                  <q-chip v-else>
                    <q-avatar
                      color="primary"
                      text-color="white"
                      font-size="14px"
                      >{{ ingredient.recipeCount }}</q-avatar
                    >
                    Rezepte
                  </q-chip>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                class="list-complete-item"
                :active="selectedIndex == 0"
                active-class="bg-blue-1"
                @click="
                  addToSearch('ingredient', {
                    id: search,
                    name: '*' + search + '*',
                    exclude: false,
                    wildcard: true
                  })
                "
              >
                <q-item-section avatar>
                  <q-avatar circle size="40px">
                    <q-img :src="api + '/images/wildcard.png'" />
                  </q-avatar>
                </q-item-section>
                <q-item-section no-wrap>
                  <div class="row">
                    <div class="col-8">
                      <h6 class="resultHeading">
                        <span
                          v-html="
                            'Alle Zutaten die \'' +
                              makeBold(this.search) +
                              '\' enthalten'
                          "
                        ></span>
                      </h6>
                    </div>
                  </div>
                </q-item-section>

                <!-- TODO: count with added filter -->
                <q-item-section side>
                  <q-spinner-dots
                    color="primary"
                    size="40px"
                    v-if="specialRecipeCount == -1"
                  />
                  <q-chip v-else>
                    <q-avatar
                      color="primary"
                      text-color="white"
                      font-size="14px"
                      >{{ specialRecipeCount }}</q-avatar
                    >
                    Rezepte
                  </q-chip>
                </q-item-section>
              </q-item>
            </template>
          </div>
        </template>
        <template v-else>
          <q-item
            style="max-width: 400px"
            v-for="index in 7"
            :key="index + 'I'"
          >
            <q-item-section avatar>
              <q-skeleton size="40px" type="QAvatar" />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" width="65%" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <q-item-label v-if="loading || tags.length > 0" header class="heading"
          >Kategorien</q-item-label
        >
        <q-item v-if="loading || tags.length > 0">
          <q-item-section>
            <div v-if="tags.length > 0">
              <q-chip
                clickable
                @click="addToSearch('tag', tag)"
                color="primary"
                text-color="white"
                v-for="tag in tags"
                :key="tag.id"
              >
                <span v-html="makeBold(tag.name)"></span>
              </q-chip>
            </div>
            <div v-else-if="this.loading">
              <q-skeleton
                type="QChip"
                v-for="index in 7"
                :key="index + 'T'"
                style="display: inline-flex; margin-right: 10px"
              />
            </div>
          </q-item-section>
        </q-item>

        <q-item-label
          v-if="loading || recipes.length > 0"
          header
          class="heading"
          >Rezepte</q-item-label
        >

        <template v-if="recipes.length > 0">
          <q-item
            clickable
            v-ripple
            v-for="recipe in recipes"
            :key="recipe.seoTitle"
            class="list-complete-item"
            :to="{
              name: 'recipe',
              params: { recipeSeoTitle: recipe.seoTitle, recipe: recipe }
            }"
          >
            <q-item-section avatar>
              <q-avatar circle size="40px">
                <q-img :src="recipe | backendPictureUrl" :ratio="1" />
              </q-avatar>
            </q-item-section>
            <q-item-section no-wrap>
              <h6 class="resultHeading">
                <span v-html="makeBold(recipe.title)"></span>
              </h6>
            </q-item-section>
          </q-item>
        </template>
        <template v-else-if="this.loading">
          <q-item
            style="max-width: 400px"
            v-for="index in 3"
            :key="index + 'R'"
          >
            <q-item-section avatar>
              <q-skeleton size="40px" type="QAvatar" />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" width="65%" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </template>
  </div>
</template>

<script>
import CancelToken from "axios/lib/cancel/CancelToken";
import SearchFilterMixin from "../mixins/SearchFilterMixin.js";

export default {
  name: "SearchResultList",
  props: {
    search: {
      type: String,
      required: true
    },
    searchFilter: {
      type: Object,
      required: true
    }
  },
  mixins: [SearchFilterMixin],
  data() {
    return {
      selectedIndex: -1,
      ingredients: [],
      recipes: [],
      tags: [],
      loading: false,
      cancelToken: CancelToken.source(),
      promises: [],
      api: process.env.API,
      specialRecipeCount: -1
    };
  },
  computed: {
    searchFilterEmpty() {
      return this.deepCheck(this.value);
    },
    flatFilter() {
      return this.flatten(this.searchFilter);
    }
  },
  filters: {
    backendPictureUrl(recipe) {
      return process.env.API + "/images/recipe/" + recipe.seoTitle + "_big.jpg"; //url.split("/").slice(3).join("/");
    }
  },

  methods: {
    makeBold(text) {
      if (!text) return "";

      //find index and length of searchString in text
      const textSmall = text.toLowerCase();
      const searchInput = this.search.toLowerCase();
      const index = textSmall.indexOf(searchInput);

      let result = "";
      result += text.substring(0, index);
      result +=
        "<span class='text-weight-bolder' style='text-decoration: underline'>" +
        text.substring(index, index + searchInput.length) +
        "</span>";
      result += text.substring(index + searchInput.length, text.length);

      return result;
    },
    addToSearch(type, value) {
      this.$emit("onAddToSearch", type, value);
    },

    selectNext() {
      this.selectedIndex++;
    },
    selectPrev() {
      this.selectedIndex--;
    },
    async loadData(name) {
      this.cancelToken.cancel();
      let values = await Promise.all(this.promises);
      for (let value of values) {
        if (Array.isArray(value)) {
          await Promise.all(value);
        }
      }

      this.cancelToken = CancelToken.source();
      this.selectedIndex = -1;
      this.ingredients = [];
      this.recipes = [];
      this.tags = [];
      this.promises = [];
      if (name == "") {
        return;
      }
      this.loading = true;

      let ingredientRequestIdx = this.promises.length;
      this.promises[ingredientRequestIdx] = this.$axios
        .post("/ingredient/" + name, this.flatFilter, {
          cancelToken: this.cancelToken.token
        })
        .then(response => {
          let innerPromises = [];
          this.ingredients = response.data;
          for (let i = 0; i < this.ingredients.length; i++) {
            innerPromises[innerPromises.length] = this.$axios
              .post(
                "/recipe/count/id/" + this.ingredients[i].id,
                this.flatFilter,
                {
                  cancelToken: this.cancelToken.token
                }
              )
              // .then(innerResponse => {
              //   this.ingredients[i].recipeCount = innerResponse.data;
              //   this.$set(this.ingredients, i, this.ingredients[i]);
              // })
              .catch(() => {
                //nothing to do
              });
          }
          if (this.search) {
            innerPromises[innerPromises.length] = this.$axios
              .post("/recipe/count/name/" + this.search, this.flatFilter, {
                cancelToken: this.cancelToken.token
              })
              .then(innerResponse => {
                this.specialRecipeCount = innerResponse.data;
              })
              .catch(() => {
                //nothing to do
              });
          }

          return innerPromises;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem"
          });
        });

      this.promises[this.promises.length] = this.$axios
        .get("/recipe", {
          cancelToken: this.cancelToken.token,
          params: {
            name: name,
            count: 3
          }
        })
        .then(response => {
          this.recipes = response.data;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem"
          });
        });

      this.promises[this.promises.length] = this.$axios
        .get("/tag", {
          params: {
            cancelToken: this.cancelToken.token,
            name: name,
            count: 5
          }
        })
        .then(response => {
          this.tags = response.data;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem"
          });
        });

      // test sleep
      // this.promises[this.promises.length] = new Promise(resolve => setTimeout(resolve, 3000));

      Promise.all(this.promises).then(values => {
        this.loading = false;
      });
    }
  },
  mounted: function() {
    this.loadData(this.search);
  },
  watch: {
    "$props.search": {
      handler: function(val, oldVal) {
        this.specialRecipeCount = -1;
        this.loadData(this.search);
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.list-complete-item {
  padding: 0px;
  transition: all 0.5s ease;
}

.list-complete-enter-from,
.list-complete-leave-to {
  opacity: 0;
}

.list-complete-leave-active {
  position: absolute;
}
</style>
<style lang="sass" scoped>
.resultHeading
  font-size: calc(14px + (18 - 14) * ((100vw - 300px) / (1600 - 300)))
  margin: 0px
  overflow: hidden
  text-overflow: ellipsis
.heading
  font-weight: bold
  letter-spacing: 3px
.q-item__section--avatar
  position: relative
  padding-right: 0px
.searchResult
  background-color: var(--q-color-background)
</style>
