<template>
  <div>
 <q-banner class="top-banner-pagination" style="margin-top:55px" v-if="currentRecipes.content && currentRecipes.content.length > 0">
   <div
        style="display: flex; flex-grow: 1; align-items: center"
      >
      <div>
      {{currentRecipes.totalElements}} Rezepte gefunden
      </div>
       <q-space />
        <q-select :value="resultCount" :options="resultsPerPageOptions" @input="resultPerPageChanged" label="Rezepte pro Seite" style="width: 150px"/>
   </div>
    </q-banner>
    <transition name="list">
      <div
        class="q-pa-l row items-center flex-center q-gutter-xl"
        style="margin-bottom: 80px;padding-top:40px"
        v-if="currentRecipes.content && currentRecipes.content.length > 0"
      >
        <Flipped
          :flip-id="index + '_1'"
          scale
          translate
          v-for="(recipe, index) in currentRecipes.content"
          :key="recipe.id"
        >
          <div>
            <q-card
              class="my-card"
              v-bind:style="
                expandedCards.includes(recipe.id)
                  ? ''
                  : 'height: 750px;overflow: hidden;'
              "
            >
              <Flipped :flip-id="index + ''" scale translate>
                <q-img
                  :src="recipe | backendPictureUrl"
                  @click="openRecipe(recipe, index)"
                  :ratio="1"
                >
                  <div class="absolute-top text-subtitle2">
                    {{ recipe.difficulty | germanDifficulty }}
                  </div>
                </q-img>
              </Flipped>

              <q-card-section>
                <div class="row no-wrap items-center">
                  <Flipped :flip-id="index + '_2'" scale translate>
                    <div class="text-h6 my-font col ellipsis">
                      {{ recipe.title }}
                    </div>
                  </Flipped>
                  <div
                    class="col-auto text-grey text-caption q-pt-md column no-wrap items-center"
                  >
                    <!-- <q-icon name="place" /> -->
                    <div>{{ recipe.calories }} kcal</div>
                    <div>
                      {{
                        new Date(recipe.preperationTimeInSeconds * 1000)
                          .toISOString()
                          .substr(11, 8)
                      }}
                    </div>
                  </div>
                </div>
                <!-- <div class="text-subtitle2">by Edeka</div> -->
              </q-card-section>
              <q-separator />
              <q-card-section horizontal>
                <q-card-section
                  class="text-body2"
                  style="
                    align-items: center;
                    display: flex;
                    text-align: center;
                    text-align: justify;
                  "
                >
                  {{ recipe.description }}
                </q-card-section>

                <q-separator style="flex-shrink: 0" vertical />

                <q-card-section
                  class="col-4 text-caption"
                  style="text-align: center"
                  v-bind:style="
                    expandedCards.includes(recipe.id)
                      ? ''
                      : 'height:177px;overflow:hidden'
                  "
                >
                  <q-chip
                    dense
                    square
                    v-for="tag in recipe.tags"
                    clickable
                    class="clipped"
                    @click="addToSearch('tag', tag)"
                    :key="tag.id"
                    color="secondary"
                    text-color="white"
                  >
                    {{ tag.name }}
                  </q-chip>
                </q-card-section>
              </q-card-section>
              <q-separator />
              <q-card-section horizontal>
                <q-card-section class="text-body2">
                  <q-chip
                    dense
                    square
                    v-for="ingredient in recipe.ingredients"
                    :key="ingredient.id"
                    clickable
                    @click="addToSearch('ingredient', ingredient)"
                    color="primary"
                    text-color="white"
                  >
                    {{ ingredient.name }}
                  </q-chip>
                  <!-- <span v-html="styleIngredients(recipe.ingredients)"></span> -->
                </q-card-section>
              </q-card-section>
            </q-card>
            <q-btn
              color="info"
              class="full-width expand-button"
              :icon="
                expandedCards.includes(recipe.id)
                  ? 'expand_less'
                  : 'expand_more'
              "
              @click="expandCard(recipe.id)"
            />
          </div>
        </Flipped>
      </div>
      <div
        v-else-if="!searchFilterEmpty && !loading"
        style="display: flex; align-items: center; justify-content: center"
        class="absolute-center"
      >
        <h4>Keine Rezepte gefunden :(</h4>
      </div>
    </transition>

    <template v-if="currentRecipes.content && currentRecipes.content.length > 0">
      <q-page-sticky expand position="bottom" class="pagination-bar">
        <div class="q-pa-md flex flex-center">
          <q-pagination
            :direction-links="true"
            :value="currentPage"
            :max="currentRecipes.totalPages"
            :max-pages="6"
            :boundary-numbers="true"
            @input="changePage"
            color="accent"
          >
          </q-pagination>
        </div>
      </q-page-sticky>
    </template>
  </div>
</template>

<script>
import { clone, remove, pick, isPlainObject, isArray, every } from "lodash";
import { Flipped } from "vue-flip-toolkit";
import SearchFilterMixin from "../mixins/SearchFilterMixin.js"


export default {
  name: "RecipeResultGrid",
  props: ["value"],
  components: { Flipped },
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
  methods: {
    // recipeTags(recipe) {
    //   if (this.expandedCards.has(recipe.id)) {
    //     return recipe.tags;
    //   }
    //   return recipe.tags.slice(0, 5);
    // },
    expandCard(recipeId) {
      //console.log(this.$refs.test);
      let index = this.expandedCards.indexOf(recipeId);
      if (index == -1) {
        this.expandedCards.push(recipeId);
      } else {
        this.expandedCards.splice(index, 1);
      }
      // if (this.expandedCards.includes(recipeId)) {
      //   this.expandedCards.delete(recipeId);
      // } else {
      //   this.expandedCards.add(recipeId);
      // }
      // console.log([...this.expandedCards].join(" "));
    },
    openRecipe(recipe, index) {
      // let img = new Image();

      // img.onload = () => {
      //   console.log("img loaded");
      //this.currentIndex = recipe.id;
      this.$router.push({
        name: "recipe",
        params: { recipeSeoTitle: recipe.seoTitle, recipe: recipe, index: index },
      });
      // };

      // img.src = recipe.pictureUrlBig;
    },
    addToSearch(type, value) {
      this.$emit("onAddToSearch", type, value);
    },
    styleIngredients(ingredients) {
      return ingredients
        .map((i) => {
          if (
            this.value["ingredient"] &&
            this.value["ingredient"].some((element) => element.id === i.id)
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
      //console.log(value);
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
      this.$q.loading.show({
        delay: 0, // ms
      });
      console.log("construct searchFilter from", this.value);
      
      /**
       * func a(element) {
       *    isArray: return [a(value) for value in element]
       *    isObject: if id in element -> return element.id
       *              else -> return {key:a(value) for key,value in element}
       *    else return element
       *             
       * } 
       * 
       * 
       * 
       */

      // let flatten = function(element){
      //   if(_.isArray(element)){
      //     return element.map((el) => flatten(el));
      //   }
      //   if(_.isPlainObject(element)){
      //     if("id" in element){
      //       return element.id;
      //     }
      //     let ret = {};
      //     Object.entries(element).forEach(([key, value]) => ret[key]=flatten(value));
      //     return ret;
      //   }
      //   return element;
      // }
      //this.currentRecipes = [];
     // this.$nextTick(()=>{

        
        let searchFilter = this.flatFilter;



      searchFilter["page"] = this.currentPage - 1;
      searchFilter["count"] = this.resultCount;

      // const currentPath = this.$router.currentRoute.path;
      // this.$router.push({ path: currentPath, query: searchFilter });

      //console.log(searchFilter);
      // this.currentRecipes = [];
      window.scrollTo(0, 0);
      this.$axios
        .post("/recipe/search", searchFilter)
        .then((response) => {
          this.currentRecipes = response.data;
          this.totalElements = response.data.totalElements;
         // console.log(response.data);
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
          this.$q.loading.hide();
          this.loading = false;
        });
   // });
    },
  },
  data() {
    return {
      loading: false,
      api: process.env.API,
      dataCopy: {},
      currentRecipes: [],
      currentPage: 1,
      resultCount: 12,
      totalElements: 0,
      expandedCards: [],
      resultsPerPageOptions: [12,24,36,48, 96, 192]
    };
  },
  watch: {
    "$props.value": {
      handler: function (val, oldVal) {
        
        if (this.searchFilterEmpty) {
          console.log("Searchfitler Empty");
          this.currentRecipes = [];
          this.currentPage = 1;
          return;
        }
        this.currentPage = 1;
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
<style lang="sass">
.my-card
  width: 400px
  transition: all 0.5s
.clipped
  overflow: hidden
.active
  z-index: 1
.pagination-bar
  background-color: var(--q-color-background)
.expand-button .q-btn__content
  color:white!important
.top-banner-pagination
  background-color: var(--q-color-background)
</style>
