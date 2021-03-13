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

      <q-card-section @click="openRecipe()">
        <div class="row justify-around no-wrap">
          <div
            class="text-h6 my-font flex items-center"
            style="height: 60px; word-wrap: anywhere"
          >
            {{ recipe.title }}
          </div>
          <div
            class="text-grey text-caption column items-center justify-center"
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
      <q-card-section horizontal @click="openRecipe()">
        <div class="text-body2 q-pa-md" style="align-items: center">
          {{ recipe.description }}
        </div>
      </q-card-section>
      <q-separator horizontal />
      <q-card-section horizontal>
        <div
          class="q-pa-md"
          style="text-align: center"
          :class="expanded ? '' : 'shadowy'"
          :style="expanded ? '' : 'max-height:100px;overflow:hidden'"
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
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section horizontal>
        <div
          class="q-pa-md"
          style="text-align: center"
          :class="expanded ? '' : 'shadowy'"
          :style="expanded ? '' : 'max-height: 100px;overflow: hidden;'"
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
            style="height: auto"
          >
            {{ ingredient.name }}
          </q-chip>
        </div>
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
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
    },
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
          index: this.index,
        },
      });
    },
    addToSearch(type, value) {
      this.$emit("onAddToSearch", type, value);
    },
  },
  data() {
    return {
      bkClass: "bk",
      imageScaleClass: "imageScale",
      isShowing: false,
      loading: false,
      api: process.env.API,
      expanded: false,
    };
  },
  activated() {
    this.isShowing = false;
  },
};
</script>
<style>
.q-chip__content {
  white-space: normal;
}

.bk {
  transition: all 0.2s ease-in;
}

.imageScale {
  z-index: 3;
  transform: scale(4);
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
  transition: all 0.5s
  border-radius: 24px 24px 0px 0px
.clipped
  overflow: hidden
.active
  z-index: 1
.expand-button
  border-radius: 0px 0px 24px 24px
</style>
