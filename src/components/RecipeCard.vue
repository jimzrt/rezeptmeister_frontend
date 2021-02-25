<template>
  <div>
    <q-card class="my-card">
      <q-img
        :src="recipe | backendPictureUrl"
        @click="openRecipe()"
        :class="[isShowing ? imageScaleClass : '', bkClass]"
        :ratio="1"
      >
        <div class="absolute-top text-subtitle2">
          {{ recipe.difficulty | germanDifficulty }}
        </div>
      </q-img>

      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="text-h6 my-font col ellipsis">
            {{ recipe.title }}
          </div>
          <div
            class="col-auto text-grey text-caption q-pt-md column no-wrap items-center"
          >
            <!-- <q-icon name="place" /> -->
            <div>{{ recipe.calories }} kcal</div>
            <div>
              {{ recipe.totalTimeInSeconds | formatDate }}
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
        <q-card-section
          class="text-body2 shadowy"
          :style="expanded ? '' : 'height: 90px;overflow: hidden;'"
        >
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
</template>
<script>
const delay = ms => new Promise(res => setTimeout(res, ms));

export default {
  name: "RecipeCard",
  props: ["recipe", "index"],
  components: {},
  mixins: [],
  computed: {},
  filters: {
    backendPictureUrl(recipe) {
      return process.env.API + "/images/recipe/" + recipe.seoTitle + "_big.jpg"; //url.split("/").slice(3).join("/");
    },
    formatDate(seconds) {
      let formatedDate = "";
      var h = Math.floor(seconds / 3600);
      if (h > 0) {
        formatedDate += h + " Std ";
      }
      var m = Math.floor((seconds % 3600) / 60);
      if (m > 0) {
        formatedDate += m + " Min";
      }
      return formatedDate;
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
    async openRecipe() {
      this.isShowing = true;

      // wait for animation
      await delay(80);

      this.$router.push({
        name: "recipe",
        params: {
          recipeSeoTitle: this.recipe.seoTitle,
          recipe: this.recipe,
          index: this.index
        }
      });
    },
    addToSearch(type, value) {
      this.$emit("onAddToSearch", type, value);
    }
  },
  data() {
    return {
      bkClass: "bk",
      imageScaleClass: "imageScale",
      isShowing: false,
      loading: false,
      api: process.env.API,
      expanded: false
    };
  },
  activated() {
    this.isShowing = false;
  }
};
</script>
<style>
.bk {
  transition: all 0.1s ease-in;
}

.imageScale {
  z-index: 3;
  transform: scale(3);
  opacity: 0.5;
  overflow: hidden;
}

.body--dark .expand-button .material-icons {
  color: white;
}
.body--light .expand-button .material-icons {
  color: #404040;
}
.shadowy {
  width: 100%;
}
.shadowy:before {
  content: "";
  box-shadow: 0px -10px 20px var(--q-color-background) inset;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
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
</style>
