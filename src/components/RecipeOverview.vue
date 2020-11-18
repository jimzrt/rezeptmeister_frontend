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
          <Flipped :flip-id="recipeSeoTitle" scale translate>
            <img :src="api + '/images/recipe/' + recipeSeoTitle + '_big.jpg'" />
          </Flipped>

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
          <Flipped :flip-id="recipeSeoTitle + '_1'" scale translate>
            <q-card
              v-bind:class="$q.screen.gt.sm ? 'q-pa-xl' : ''"
              style="min-height: calc(100vh - 700px); margin-top: 30px"
            >
              <q-card-section>
                <Flipped :flip-id="recipeSeoTitle + '_2'" scale translate>
                  <div class="text-h2 my-font resultHeading">
                    {{ currentRecipe.title }}
                  </div>
                </Flipped>
                <div class="text-h6">{{ currentRecipe.description }}</div>
                <div class="text-subtitle2">by Edeka</div>
              </q-card-section>

              <q-card-section v-if="loaded" class="fade-card">
                <div class="q-pa-md">
                  <div class="row q-pa-md">
                    <div class="col-12 col-md-12">
                      <div class="text-h4 text-left">Zutaten</div>
                      <q-markup-table
                        v-for="(ingredientGroup,
                        index) in currentRecipe.ingredientGroups"
                        :key="index"
                        separator="cell"
                        class="col"
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
                                {{ amount.quantity }} {{ amount.unit.name }}
                              </template>
                            </td>

                            <td>{{ ingredient }}</td>
                          </tr>
                        </tbody>
                      </q-markup-table>
                    </div>
                    <!-- <div class="col-12 col-md-6">
                      <q-knob
                        :min="5"
                        :max="10"
                        :value="6"
                        readonly
                        show-value
                        size="130px"
                        :thickness="0.1"
                        color="primary"
                        track-color="grey-3"
                        font-size="18px"
                      >
                        <div style="flex-flow: column">
                          <div>348kcal</div>
                          <div>24%</div>
                        </div>
                      </q-knob>
                    </div> -->
                  </div>
                </div>
              </q-card-section>
              <q-card-section v-if="loaded" class="fade-card">
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
          </Flipped>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { Flipped } from "vue-flip-toolkit";

export default {
  name: "RecipeOverview",
  props: ["recipeSeoTitle", "recipe"],
  components: { Flipped },
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
          !d.includes("Entdecken Sie")
      );
    },
  },
  mounted: function () {
    // `this` points to the vm instance
    console.log("here");

    if (this.recipe) this.currentRecipe = this.recipe;
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
    },
  },
  methods: {
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
          //this.recipeImageUrl = this.currentRecipe.pictureUrlBig;
          //console.log(response.data);
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
    };
  },
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
    max-height: 60vh;
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
