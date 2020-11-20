<template>
       <Flipped
          :flip-id="index + '_1'"
          scale
          translate
        >
  <div>
    <q-card
      class="my-card"
      v-bind:style="expanded ? '' : 'height: 750px;overflow: hidden;'"
    >
      <Flipped :flip-id="index + ''" scale translate>
        <q-img
          :src="recipe | backendPictureUrl"
          @click="openRecipe()"
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
              {{ recipe.preperationTimeInSeconds | formatDate }}
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
          v-bind:style="expanded ? '' : 'height:177px;overflow:hidden'"
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
      :icon="expanded ? 'expand_less' : 'expand_more'"
      @click="expanded = !expanded"
    />
  </div>
  </Flipped>
</template>
<script>
import { Flipped } from "vue-flip-toolkit";

export default {
  name: "RecipeCard",
  props: ["recipe", "index"],
  components: { Flipped },
  mixins: [],
  computed: {},
  filters: {
    backendPictureUrl(recipe) {
      return process.env.API + "/images/recipe/" + recipe.seoTitle + "_big.jpg"; //url.split("/").slice(3).join("/");
    },
    formatDate(seconds) {
      return new Date(seconds * 1000).toISOString().substr(11, 8);
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
    openRecipe() {
      // let img = new Image();

      // img.onload = () => {
      //   console.log("img loaded");
      //this.currentIndex = recipe.id;
      this.$router.push({
        name: "recipe",
        params: {
          recipeSeoTitle: this.recipe.seoTitle,
          recipe: this.recipe,
          index: this.index,
        },
      });
      // };

      // img.src = recipe.pictureUrlBig;
    },
    addToSearch(type, value) {
      this.$emit("onAddToSearch", type, value);
    },
  },
  data() {
    return {
      loading: false,
      api: process.env.API,
      expanded: false,
    };
  },
  //   watch: {
  //     "$props.value": {
  //       handler: function (val, oldVal) {

  //         if (this.searchFilterEmpty) {
  //           console.log("Searchfitler Empty");
  //           this.currentRecipes = [];
  //           this.currentPage = 1;
  //           return;
  //         }
  //         this.currentPage = 1;
  //         this.loadData();
  //       },
  //       deep: true,
  //     },
  //   },
};
</script>

<style lang="sass">
.my-card
  width: 400px
  transition: all 0.5s
.clipped
  overflow: hidden
.active
  z-index: 1
.expand-button .q-btn__content
  color:white!important
</style>
