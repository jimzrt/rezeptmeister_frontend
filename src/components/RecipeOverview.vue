<template>
  <q-layout>
    <q-header class="text-grey-1 q-py-xs edekaBar" height-hint="65">
      <q-toolbar>
        <!-- <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
            icon="menu"
          /> -->

        <q-btn flat no-caps no-wrap padding="0px 5px 0px 10px">
          <img :src="api + '/images/logo.png'" height="50px" />
          <q-toolbar-title
            shrink
            class="text-weight-bold my-font"
            style="padding-right: 20px"
            v-if="$q.screen.gt.sm"
          >
            RezeptMeister
          </q-toolbar-title>
        </q-btn>

        <template v-if="$q.screen.gt.sm">
          <q-space />

          <q-toggle
            :value="$q.dark.isActive"
            @input="$q.dark.toggle()"
            label="Dark Mode"
          /> </template></q-toolbar
    ></q-header>
    <q-page-sticky class="toolbar" expand position="top">
      <q-toolbar class="shadow-1">
        <q-btn
          stretch
          flat
          icon="arrow_back_ios"
          label="Zur Übersicht"
          @click="$router.go(-1)"
        />
      </q-toolbar>
    </q-page-sticky>
    <q-page-container>
      <div style="" class="content" v-if="currentRecipe">
        <div class="img" style="">
          <img
            :src="api + '/images/recipe/' + currentRecipe.seoTitle + '_big.jpg'"
          />

          <!-- <div class="overlay"></div> -->
        </div>
        <div
          class="post"
          v-bind:style="
            $q.screen.gt.sm
              ? 'margin-top: 200px;padding: 200px 15%;'
              : 'margin-top: 20px;padding: 150px 5%;'
          "
          style=""
        >
          <q-card
            v-bind:class="$q.screen.gt.sm ? 'q-pa-xl' : ''"
            style="min-height: calc(100vh - 700px); margin-top: 30px"
          >
            <q-card-section>
              <div class="text-h2 my-font resultHeading">
                {{ currentRecipe.title }}
              </div>
              <div class="text-h6">{{ currentRecipe.description }}</div>
              <div class="text-subtitle2">by Edeka</div>
            </q-card-section>

            <q-card-section v-if="loaded" class="fade-card">
              <div class="q-pa-md">
                <div class="text-h4 text-left">
                  Zutaten für
                  <q-btn
                    round
                    color="primary"
                    icon="remove"
                    @click="decrementServingSize"
                  />
                  {{ servingSize }}
                  <q-btn
                    round
                    color="primary"
                    icon="add"
                    @click="incrementServingSize"
                  />
                  Portionen
                </div>

                <div class="row q-pa-md">
                  <q-markup-table
                    v-for="(ingredientGroup,
                    index) in currentRecipe.ingredientGroups"
                    :key="index"
                    separator="cell"
                    class="col"
                    style="min-width: 300px; padding: 10px; margin: 20px"
                  >
                    <thead v-if="ingredientGroup.name">
                      <tr>
                        <th colspan="2">
                          <div class="text-h5 text-left">
                            {{ ingredientGroup.name }}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="[ingredient, amount] of Object.entries(
                          ingredientGroup.amounts
                        )"
                        :key="ingredient.id"
                      >
                        <td>
                          <template v-if="amount.quantity != 0">
                            {{
                              Math.round(
                                amount.quantity *
                                  (servingSize /
                                    currentRecipe.defaultServingSize) *
                                  100 +
                                  Number.EPSILON
                              ) / 100
                            }}
                            {{ amount.unit.name }}
                          </template>
                        </td>

                        <td>{{ ingredient }}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </div>
              <div class="text-h4 text-left">
                Nährwerte pro Portion
                <div class="row q-pa-md">
                  <!-- <div v-for="i in 6" :key="i" class="q-pa-md"> -->
                  <div class="col">
                    <div class="row justify-center">
                      <q-knob
                        :min="0"
                        :max="8400"
                        :value="currentRecipe.nutrition.kj"
                        readonly
                        show-value
                        size="110px"
                        :thickness="0.1"
                        color="teal"
                        track-color="grey-3"
                        font-size="16px"
                      >
                        <div>
                          <div class="row justify-center">
                            {{ currentRecipe.nutrition.kj }}kj
                          </div>
                          <div class="row justify-center">
                            {{ Math.round(currentRecipe.nutrition.kj / 84) }}%
                          </div>
                        </div>
                      </q-knob>
                    </div>
                    <div class="row justify-center" style="font-size: 14px">
                      Energie
                    </div>
                  </div>
                  <div class="col">
                    <div class="row justify-center">
                      <q-knob
                        :min="0"
                        :max="2000"
                        :value="currentRecipe.nutrition.kcal"
                        readonly
                        show-value
                        size="110px"
                        :thickness="0.1"
                        color="teal"
                        track-color="grey-3"
                        font-size="16px"
                      >
                        <div>
                          <div class="row justify-center">
                            {{ currentRecipe.nutrition.kcal }}kcal
                          </div>
                          <div class="row justify-center">
                            {{ Math.round(currentRecipe.nutrition.kcal / 20) }}%
                          </div>
                        </div>
                      </q-knob>
                    </div>
                    <div class="row justify-center" style="font-size: 14px">
                      Kalorien
                    </div>
                  </div>
                  <div class="col">
                    <div class="row justify-center">
                      <q-knob
                        :min="0"
                        :max="260"
                        :value="currentRecipe.nutrition.carbohydrates"
                        readonly
                        show-value
                        size="110px"
                        :thickness="0.1"
                        color="teal"
                        track-color="grey-3"
                        font-size="16px"
                      >
                        <div>
                          <div class="row justify-center">
                            {{ currentRecipe.nutrition.carbohydrates }}g
                          </div>
                          <div class="row justify-center">
                            {{
                              Math.round(
                                currentRecipe.nutrition.carbohydrates / 2.6
                              )
                            }}%
                          </div>
                        </div>
                      </q-knob>
                    </div>
                    <div class="row justify-center" style="font-size: 14px">
                      Kohlenhydrate
                    </div>
                  </div>
                  <div class="col">
                    <div class="row justify-center">
                      <q-knob
                        :min="0"
                        :max="70"
                        :value="currentRecipe.nutrition.fat"
                        readonly
                        show-value
                        size="110px"
                        :thickness="0.1"
                        color="teal"
                        track-color="grey-3"
                        font-size="16px"
                      >
                        <div>
                          <div class="row justify-center">
                            {{ currentRecipe.nutrition.fat }}g
                          </div>
                          <div class="row justify-center">
                            {{ Math.round(currentRecipe.nutrition.fat / 0.7) }}%
                          </div>
                        </div>
                      </q-knob>
                    </div>
                    <div class="row justify-center" style="font-size: 14px">
                      Fett
                    </div>
                  </div>
                  <div class="col">
                    <div class="row justify-center">
                      <q-knob
                        :min="0"
                        :max="50"
                        :value="currentRecipe.nutrition.protein"
                        readonly
                        show-value
                        size="110px"
                        :thickness="0.1"
                        color="teal"
                        track-color="grey-3"
                        font-size="16px"
                      >
                        <div>
                          <div class="row justify-center">
                            {{ currentRecipe.nutrition.protein }}g
                          </div>
                          <div class="row justify-center">
                            {{
                              Math.round(currentRecipe.nutrition.protein / 0.5)
                            }}%
                          </div>
                        </div>
                      </q-knob>
                    </div>
                    <div class="row justify-center" style="font-size: 14px">
                      Protein
                    </div>
                  </div>
                </div>
              </div>

              <q-timeline color="secondary" :layout="layout">
                <q-timeline-entry heading>
                  Schritt für Schritt
                </q-timeline-entry>

                <q-timeline-entry
                  v-for="(direction, index) in filteredDirections"
                  :key="index"
                  :title="'Schritt ' + (index + 1)"
                  :side="index % 2 == 0 ? 'left' : 'right'"
                >
                  <div>
                    {{ direction }}
                  </div>
                </q-timeline-entry>
              </q-timeline>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "RecipeOverview",
  props: ["recipeSeoTitle", "recipe", "index"],
  components: {},
  computed: {
    layout() {
      return this.$q.screen.lt.sm
        ? "dense"
        : this.$q.screen.lt.md
        ? "comfortable"
        : "loose";
    },
    filteredDirections() {
      return this.currentRecipe.directions.filter(
        d =>
          !d.startsWith("Entdecken Sie auch") &&
          !d.startsWith("Tolle Rezepte") &&
          !d.startsWith("Tipp") &&
          !d.startsWith("Probieren Sie auch") &&
          !d.startsWith("Lust auf") &&
          !d.startsWith("Möchten Sie noch") &&
          !d.includes("Entdecken Sie")
      );
    }
  },
  mounted: function() {
    // `this` points to the vm instance
    console.log("here");

    if (this.recipe) {
      this.currentRecipe = this.recipe;
      this.servingSize = this.recipe.defaultServingSize;
    }
    //if (!this.currentRecipe)
    this.loadData();
  },
  //   deactivated () {
  //     console.log('About has been deactivated')
  //     this.recipe=null;
  // },
  filters: {
    backendPictureUrl(recipe) {
      return process.env.API + "/images/recipe/" + recipe.seoTitle + "_big.jpg"; //url.split("/").slice(3).join("/");
    },
    // cachedPictureUrl(url) {
    //   //return url
    //   return process.env.API + "/e_images/" + url.split("/").slice(3).join("/");
    // },
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
  methods: {
    decrementServingSize() {
      if (this.servingSize == 1) return;
      this.servingSize--;
    },
    incrementServingSize() {
      this.servingSize++;
    },
    loadData() {
      //filter ids
      this.loading = true;

      this.$axios
        .get("/recipe/seo", {
          params: {
            seoTitle: this.recipeSeoTitle
          }
        })
        .then(response => {
          this.currentRecipe = response.data;
          this.servingSize = response.data.defaultServingSize;
          //this.recipeImageUrl = this.currentRecipe.pictureUrlBig;
          //console.log(response.data);
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
          this.loading = false;
          this.loaded = true;
        });

      this.mounted = true;
    }
  },
  data() {
    return {
      pVisible: true,
      mounted: false,
      currentRecipe: null,
      api: process.env.API,
      loaded: false,
      servingSize: 0
    };
  }
  //   watch: {
  //     "$props.value": {
  //       handler: function (val, oldVal) {
  //         console.log("watch Searchfilter", oldVal, val);
  //         if (this.searchFilterEmpty) {
  //           this.currentRecipes = [];
  //           this.currentPage = 1;
  //           return;
  //         }
  //         this.loadData();
  //       },
  //       deep: true,
  //     },
  //   },
};
</script>
<style lang="sass" scoped>
.toolbar
  background-color: var(--q-color-background)
  z-index: 1000

.edekaBar
  background: #343638 url("/images/background-dark.jpg")
  background-position-x: 0%
  background-position-y: 0%
  background-repeat: repeat
  background-size: auto
  background-position: 0 0
  background-repeat: repeat
  background-size: 400px 400px
  border-bottom: 2px solid #000
</style>
<style lang="scss" scoped>
.shadow-title {
  text-shadow: 3px 3px 4px #777;
}
.img {
  margin-top: 110px;
  width: 100%;
  position: absolute;
  top: 0;
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0)
  );
  img {
    width: 100%;
    height: 60vh;
    object-fit: cover;
  }
}
.post {
  position: relative;

  h1 {
    display: inline;
  }
  .fade-card {
    animation: fade 0.4s ease 250ms 1 both;
    opacity: 0;
    @keyframes fade {
      from {
        opacity: 0;
        transform: translate(0, 20px);
      }
      75% {
        transform: none;
      }
      to {
        opacity: 1;
      }
    }
  }
}
</style>
<style lang="sass" scoped>
.resultHeading
  margin-bottom: 10px
  word-break: break-all
</style>
