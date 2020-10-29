<template>
  <div class="searchResult">
    <template v-if="this.search == ''"> </template>
    <template v-else>
      <q-list bordered separator padding>
        <q-item-label class="heading" header>Zutaten</q-item-label>

        <!-- <transition-group
        name="list-complete"
        tag="div"
        class="q-list q-list--separator"
      > -->
        <template v-if="ingredients.length > 0">
          <q-item
            clickable
            v-ripple
            v-for="(ingredient, index) in ingredients"
            :key="ingredient.slug"
            class="list-complete-item"
            :active="selectedIndex == index"
            active-class="bg-blue-1"
             @click="addToSearch('ingredient', {id: ingredient.id, name: ingredient.name})"
          >
            <q-item-section avatar>
              <q-avatar circle size="60px">
                <q-img :src="'http://localhost:8080' + ingredient.pictureUrl" />
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
                size="60px"
                v-if="ingredient.recipeCount == undefined"
              />
              <q-chip v-else>
                <q-avatar color="primary" text-color="white" font-size="14px">{{
                  ingredient.recipeCount
                }}</q-avatar>
                Rezept{{ ingredient.recipeCount != 1 ? "e" : "" }}
              </q-chip>
            </q-item-section>
          </q-item>
        </template>
        <template v-else-if="this.loading">
          <q-item
            style="max-width: 400px"
            v-for="index in 7"
            :key="index + 'I'"
          >
            <q-item-section avatar>
              <q-skeleton size="60px" type="QAvatar" />
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

        <q-item-label header class="heading">Rezepte</q-item-label>

        <template v-if="recipes.length > 0">
          <q-item
            clickable
            v-ripple
            v-for="recipe in recipes"
            :key="recipe.seoTitle"
            class="list-complete-item"
             @click="addToSearch('recipe', {id: recipe.id, name: recipe.title})"
          >
            <q-item-section avatar>
              <q-avatar circle size="60px">
                <q-img :src="'http://localhost:8080' + recipe.pictureUrl" />
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
              <q-skeleton size="60px" type="QAvatar" />
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

        <q-item-label header class="heading">Kategorien</q-item-label>
        <q-item>
          <q-item-section>
            <div v-if="tags.length > 0">
              <q-chip
                clickable
                @click="addToSearch('tag', {id: tag.id, name: tag.name})"
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
        <!-- </transition-group> -->
      </q-list>
    </template>
  </div>
</template>

<script>
import CancelToken from "axios/lib/cancel/CancelToken";

export default {
  name: "SearchResultList",
  props: {
    search: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedIndex: -1,
      ingredients: [],
      recipes: [],
      tags: [],
      loading: false,
      cancelToken: CancelToken.source(),
      promises: [],
    };
  },
  filters: {},

  methods: {
    makeBold(text) {
      if (!text) return "";

      //find index and length of searchString in text
      const textSmall = text.toLowerCase();
      const searchInput = this.search.toLowerCase();
      const index = textSmall.indexOf(searchInput);

      let result = "";
      for (let idx = 0; idx < text.length; idx++) {
        if (idx >= index && idx < index + searchInput.length) {
          result +=
            "<span class='text-weight-bolder' style='text-decoration: underline'>" +
            text[idx] +
            "</span>";
        } else {
          result += text[idx];
        }
      }

      return result;
    },
    addToSearch(type, value){
      this.$emit("onAddToSearch", type, value);
    },

    selectNext() {
      this.selectedIndex++;
      console.log(this.selectedIndex);
    },
    selectPrev() {
      this.selectedIndex--;
      console.log(this.selectedIndex);
    },
    async loadData(name) {
      this.cancelToken.cancel();
      //await Promise.all(this.promises);
      let values = await Promise.all(this.promises);
      console.log("ending2");
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
      //const CancelToken = axios.CancelToken;
      this.loading = true;
      console.log("starting");

      let ingredientRequestIdx = this.promises.length;
      this.promises[ingredientRequestIdx] = this.$axios
        .get("http://localhost:8080/ingredient", {
          cancelToken: this.cancelToken.token,
          params: {
            name: name,
            count: 7,
          },
        })
        .then((response) => {
          let innerPromises = [];
          this.ingredients = response.data;
          for (let i = 0; i < this.ingredients.length; i++) {
            //response.data[i].recipeCount = -1;
            //this.ingredients.push(response.data[i]);
            innerPromises[innerPromises.length] = this.$axios
              .get("http://localhost:8080/recipe/count", {
                cancelToken: this.cancelToken.token,
                params: { ingredientId: this.ingredients[i].id },
              })
              .then((innerResponse) => {
                this.ingredients[i].recipeCount = innerResponse.data;
                //this.ingredients.push(response.data[i]); //.recipeCount = response.data;
                this.$set(this.ingredients, i, this.ingredients[i]);
              })
              .catch(() => {
                //nothing to do
                console.log("aborted");
              });
          }
          return innerPromises;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });

      this.promises[this.promises.length] = this.$axios
        .get("http://localhost:8080/recipe", {
          cancelToken: this.cancelToken.token,
          params: {
            name: name,
            count: 3,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.recipes = response.data;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });

      this.promises[this.promises.length] = this.$axios
        .get("http://localhost:8080/tag", {
          params: {
            cancelToken: this.cancelToken.token,
            name: name,
            count: 7,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.tags = response.data;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });

      // test sleep
      // this.promises[this.promises.length] = new Promise(resolve => setTimeout(resolve, 3000));

      Promise.all(this.promises).then((values) => {
        this.loading = false;
        console.log("ending");
      });
    },
  },
  mounted: function () {
    // `this` points to the vm instance
    console.log("mounted");
    console.log(this.search);
    this.loadData(this.search);
  },
  watch: {
    "$props.search": {
      handler: function (val, oldVal) {
        console.log("watch", oldVal, val);

        this.loadData(this.search);
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.list-complete-item {
  transition: all 0.5s ease;
  /* display: inline-block; */
  /*margin-right: 10px; */
}

.list-complete-enter-from,
.list-complete-leave-to {
  opacity: 0;
  /* transform: scale(0, 0); */
}

.list-complete-leave-active {
  position: absolute;
}
</style>
<style lang="sass" scoped>
.resultHeading
  font-size: calc(12px + (18 - 12) * ((100vw - 300px) / (1600 - 300)))
  margin: 0px
  overflow: hidden;
  text-overflow: ellipsis;
.heading
  font-weight: bold
  letter-spacing: 3px

.q-item__section--avatar
  left: -45px
  position: relative
  padding-right: 0px

.searchResult
  background-color: rgba(255, 255, 255, 1)
</style>
