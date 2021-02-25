<template>
  <!-- bg-grey-1 -->
  <q-layout view="hHh Lpr lff" class="">
    <q-ajax-bar position="bottom" color="primary" size="10px" />
    <q-page-container>
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

          <div
            v-bind:style="
              $q.screen.gt.sm
                ? ''
                : searchFocus || !searchFilterEmpty
                ? 'left:80px;right:10px'
                : 'left:10px;right:10px'
            "
            class="toolio"
            v-bind:class="{ inactive: !searchFocus && searchFilterEmpty }"
          >
            <!-- v-bind:style="(searchFocus || !searchFilterEmpty) ? 'position:relative': 'position:absolute' " -->

            <q-input
              ref="searchBar"
              class="YL__toolbar-input"
              dense
              standout="bg-primary"
              v-model="searchInput"
              placeholder="Zutat oder Gericht"
              bottom-slots
              debounce="200"
              v-bind:class="{ active: searchFocus || !searchFilterEmpty }"
              @keyup.down="selectNextSuggestion"
              @keyup.up="selectPrevSuggestion"
            >
              <template v-slot:prepend>
                <q-icon
                  v-if="searchInput === ''"
                  name="search"
                  class="justify-center"
                />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="searchInput = ''"
                />
              </template>
              <template v-slot:hint>
                <transition name="slide-fade">
                  <SearchResultList
                    ref="searchResult"
                    :search="searchInput"
                    :searchFilter="searchFilter"
                    @onAddToSearch="addToSearch"
                    @onClearSearch="
                      searchInput = '';
                      searchFocus = false;
                    "
                    v-show="searchFocus"
                  />
                </transition>
              </template>
            </q-input>
          </div>

          <!-- <q-space />

          <div class="q-gutter-sm row items-center no-wrap">
            <q-btn round dense flat icon="favorite">
              <q-badge color="red" text-color="white" floating> 2 </q-badge>
              <q-tooltip>Merkliste</q-tooltip>
            </q-btn>
          </div> -->

          <template v-if="$q.screen.gt.sm">
            <q-space />

            <q-toggle
              :value="$q.dark.isActive"
              @input="$q.dark.toggle()"
              label="Dark Mode"
            />
          </template>
        </q-toolbar>
      </q-header>

      <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
      :width="240"
      persistent
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item v-for="link in links1" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item v-for="link in links2" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md q-mb-xs" />

          <q-item-label header class="text-weight-bold text-uppercase">
            More from Youtube
          </q-item-label>

          <q-item v-for="link in links3" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item v-for="link in links4" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md q-mb-lg" />

          <div class="q-px-md text-grey-9">
            <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
              <a
                v-for="button in buttons1"
                :key="button.text"
                class="YL__drawer-footer-link"
                href="javascript:void(0)"
              >
                {{ button.text }}
              </a>
            </div>
          </div>
          <div class="q-py-md q-px-md text-grey-9">
            <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
              <a
                v-for="button in buttons2"
                :key="button.text"
                class="YL__drawer-footer-link"
                href="javascript:void(0)"
              >
                {{ button.text }}
              </a>
            </div>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer> -->

      <!-- active filters -->

      <RecipeResultGrid v-model="searchFilter" @onAddToSearch="addToSearch" />
      <!-- v-bind:style="{ 'margin-top': searchFilterEmpty ? '15px' : '80px' }" -->
      <!-- <router-view /> -->
      <SearchFilterBar
        v-model="searchFilter"
        v-if="!searchFilterEmpty"
        @onAddToSearch="addToSearch"
        @onRemoveFromSearch="removeFromSearch"
        @onClearSearch="searchFilter = {}"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import SearchResultList from "../components/SearchResultList.vue";
import SearchFilterBar from "../components/SearchFilterBar.vue";
import RecipeResultGrid from "../components/RecipeResultGrid.vue";

import { some, isArray, every, includes } from "lodash";

const stringOptions = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];

export default {
  name: "RecipeSearch",
  components: {
    RecipeResultGrid,
    SearchResultList,
    SearchFilterBar
  },
  data() {
    return {
      model: null,
      searchFocus: false,
      filterOptions: stringOptions,
      leftDrawerOpen: true,
      searchInput: "",
      selected: "",
      searchFilter: {},
      api: process.env.API
    };
  },
  // watch: {
  //   searchFilter: function (newVal, oldVal) {
  //     console.log("value changed from " + oldVal + " to " + newVal);
  //   },
  // },
  created() {
    document.addEventListener("click", this.onClickAnywhere);
  },
  destroyed() {
    document.removeEventListener("click", this.onClickAnywhere);
  },

  computed: {
    searchFilterEmpty() {
      let deepCheck = function(filter) {
        if (_.isArray(filter)) {
          return _.every(filter.map(value => deepCheck(value)));
        }
        if (_.isPlainObject(filter)) {
          return _.every(Object.values(filter).map(value => deepCheck(value)));
        }
        return filter == 0 || filter == "" || filter == undefined;
      };
      return deepCheck(this.searchFilter);
    }
  },
  methods: {
    addToSearch(type, value, single = false, exclude = false) {
      console.log(exclude ? "exclude" : "add", type, value);
      this.searchInput = "";

      if (single) {
        this.$set(this.searchFilter, type, value);
        return;
      }

      if (exclude) {
        // if (!("exclude" in this.searchFilter)) {
        //   this.$set(this.searchFilter, "exclude", {});
        // }
        if (!(type in this.searchFilter)) {
          return;
          //this.$set(this.searchFilter, type, []);
        }

        const index = this.searchFilter[type].findIndex(
          val => val.id === value.id
        );
        if (index == -1) {
          return;
        }
        if ("exclude" in this.searchFilter[type][index]) {
          value["exclude"] = !value["exclude"];
          this.$set(this.searchFilter[type], index, value);
        } else {
          this.$set(this.searchFilter[type], index, {
            ...value,
            exclude: true
          });
        }

        return;
        // _.find(this.searchFilter[type], value){
        //   this.removeFromSearch(type, value);
        //   this.addToSearch(type, value);
        //   return;
        // }

        // this.removeFromSearch(type, value);
        // this.searchFilter["exclude"][type].push(value);
        // return;
      }

      if (!(type in this.searchFilter)) {
        // make it a set
        // this.searchFilter[type] = [];
        this.$set(this.searchFilter, type, []);
      } else {
        if (_.some(this.searchFilter[type], value)) {
          return;
        }
      }
      console.log("VALUE", value);
      this.searchFilter[type].push(value);
      //this.$set(this.searchFilter, type, this.searchFilter[type]);
      //console.log(this.searchFilter);
    },
    removeFromSearch(type, value) {
      console.log("remove", type, value);

      if (
        type in this.searchFilter &&
        (_.some(this.searchFilter[type], value) ||
          _.includes(this.searchFilter[type], value))
      ) {
        console.log(value, "is to be removed!");
        this.searchFilter[type].splice(
          this.searchFilter[type].indexOf(value),
          1
        );
      } else if (
        "exclude" in this.searchFilter &&
        type in this.searchFilter["exclude"] &&
        _.some(this.searchFilter["exclude"][type], value)
      ) {
        console.log(value, "is to be unremoved!");
        this.searchFilter["exclude"][type].splice(
          this.searchFilter["exclude"][type].indexOf(value),
          1
        );
      }

      // this.searchInput = "";

      // if(type == "recipe"){
      //   //todo
      //   return;
      // }

      // if (!(type in this.searchFilter)) {
      //   // make it a set
      //   // this.searchFilter[type] = [];
      //   this.$set(this.searchFilter, type, []);
      // } else {
      //   if (_.some(this.searchFilter[type], value)) {
      //     console("inside")
      //     return;
      //   }
      // }
      // this.searchFilter[type].push(value);
      //this.$set(this.searchFilter, type, this.searchFilter[type]);
      //console.log(this.searchFilter);
    },
    // todo: loosely couple trigger via prop instead of using refs
    selectNextSuggestion: function() {
      this.$refs.searchResult.selectNext();
    },
    selectPrevSuggestion: function() {
      this.$refs.searchResult.selectPrev();
    },
    onClickAnywhere(event) {
      event.preventDefault();
      // check if clicked outside of search bar
      const el = this.$refs.searchBar.$el;
      if (el == event.target || el.contains(event.target)) {
        //console.log("INSIDE");
        this.searchFocus = true;
      } else {
        //console.log("OUTSIDE");
        this.searchFocus = false;
      }
    }
  }
};
</script>
<style scoped>
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
<style lang="sass">
.toolio
  height: 45px
  min-width: 200px
  left: 260px
  right: 150px
  position: absolute
  transition: all 0.5s ease
  max-width: 800px

.inactive
  left: 150px
  max-width: 100%
  transition: all 0.5s ease

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
.q-field--standout .q-field__control
  background: $grey-5
.q-field__bottom
  z-index: 9999
.q-field--with-bottom
  padding-bottom: 0px
.q-field--dense
  position: relative

  top: 120px
  height: 80px
  transition: all 0.5s ease

  .q-field__control,.q-field__prepend

    height: 80px
    transition: all 0.5s ease
    border-radius: 28px

.q-field.active

  top: 0px
  height: 40px
  .q-field__control,.q-field__prepend
    height: 40px
    border-radius: 0px
.YL
  &__toolbar-input
    min-width: 200px
    width: 100%
    .q-field__bottom
      padding: 0px
  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>
