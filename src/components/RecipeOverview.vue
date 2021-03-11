<template>
  <q-layout>
    <q-header class="text-grey-1 q-py-xs edekaBar" height-hint="65">
      <q-toolbar>
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
              : 'margin-top: 20px;padding: 150px 1%;'
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
              <div style="margin-bottom:15px;">
                <div class="text-h4 text-left" style="margin-bottom:15px">
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

                <div class="row  emulated-flex-gap">
                  <q-markup-table
                    v-for="(
                      ingredientGroup, index
                    ) in currentRecipe.ingredientGroups"
                    :key="index"
                    separator="cell"
                    class=""
                    style="margin-top: 15px; margin-bottom: 15px: "
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
                <div class="row">
                  <div
                    class="column items-center q-pa-md"
                    v-for="nutrition in nutritions"
                    :key="nutrition.prop"
                  >
                    <q-knob
                      :min="0"
                      :max="nutrition.max"
                      :value="currentRecipe.nutrition[nutrition.prop]"
                      readonly
                      show-value
                      size="110px"
                      :thickness="0.1"
                      color="teal"
                      track-color="grey-3"
                      font-size="16px"
                    >
                      <div class="column items-center">
                        <div class="">
                          {{ currentRecipe.nutrition[nutrition.prop]
                          }}{{ nutrition.unit }}
                        </div>
                        <div class="">
                          {{
                            Math.round(
                              currentRecipe.nutrition[nutrition.prop] /
                                nutrition.factor
                            )
                          }}%
                        </div>
                      </div>
                    </q-knob>
                    <div class="text-subtitle2">
                      {{ nutrition.label }}
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
        (d) =>
          !d.startsWith("Entdecken Sie auch") &&
          !d.startsWith("Tolle Rezepte") &&
          !d.startsWith("Tipp") &&
          !d.startsWith("Probieren Sie auch") &&
          !d.startsWith("Lust auf") &&
          !d.startsWith("Möchten Sie noch") &&
          !d.startsWith("Lecker") &&
          !d.includes("Entdecken Sie")
      );
    },
  },
  mounted: function () {
    if (this.recipe) {
      this.currentRecipe = this.recipe;
      this.servingSize = this.recipe.defaultServingSize;
    }
    this.loadData();
  },

  filters: {
    backendPictureUrl(recipe) {
      return process.env.API + "/images/recipe/" + recipe.seoTitle + "_big.jpg"; //url.split("/").slice(3).join("/");
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
    },
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
            seoTitle: this.recipeSeoTitle,
          },
        })
        .then((response) => {
          this.currentRecipe = response.data;
          this.servingSize = response.data.defaultServingSize;
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
          this.loaded = true;
        });

      this.mounted = true;
    },
  },
  data() {
    return {
      pVisible: true,
      mounted: false,
      currentRecipe: null,
      api: process.env.API,
      loaded: false,
      servingSize: 0,
      nutritions: [
        { prop: "kj", unit: "kj", label: "Energie", factor: 84, max: 8400 },
        {
          prop: "kcal",
          unit: "kcal",
          label: "Kalorien",
          factor: 20,
          max: 2000,
        },
        {
          prop: "carbohydrates",
          unit: "g",
          label: "Kohlenhydrate",
          factor: 2.6,
          max: 260,
        },
        { prop: "fat", unit: "%", label: "Fett", factor: 0.7, max: 70 },
        { prop: "protein", unit: "g", label: "Proteine", factor: 0.5, max: 50 },
      ],
    };
  },
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
    animation: fade 250ms 1 both;
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
<style scoped>
.emulated-flex-gap {
  --gap: 15px;
  display: inline-flex;
  flex-wrap: wrap;
  margin: calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap));
  width: calc(100% + var(--gap));
}

.emulated-flex-gap > * {
  margin: var(--gap) 0 0 var(--gap);
}
</style>
