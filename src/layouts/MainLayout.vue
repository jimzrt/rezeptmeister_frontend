<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-ajax-bar position="bottom" color="primary" size="10px" />
    <q-header class="text-grey-1 q-py-xs edekaBar" height-hint="58">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <q-btn
          flat
          no-caps
          no-wrap
          padding="0px 5px 0px 10px"
          v-if="$q.screen.gt.sm"
        >
          <img src="http://localhost:8080/images/logo.png" height="50px" />
          <q-toolbar-title shrink class="text-weight-bold">
            RezeptMeister
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <div
          style="position: relative; height: 45px; min-width: 200px; width: 75%"
        >
          <q-input
            ref="searchBar"
            class="YL__toolbar-input"
            dense
            standout="bg-primary"
            v-model="searchInput"
            placeholder="Zutat oder Gericht"
            bottom-slots
            debounce="200"
            bg-color="grey-5"
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

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat icon="favorite">
            <q-badge color="red" text-color="white" floating> 2 </q-badge>
            <q-tooltip>Merkliste</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
      :width="240"
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
    </q-drawer>

    <!-- active filters -->
    <q-page-sticky expand position="top" v-if="!searchFilterEmpty">
      <q-toolbar class="YL__sticky bg-white q-px-xl">
        Zutaten: {{ this.searchFilter }}
        <q-space />
      </q-toolbar>
    </q-page-sticky>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import SearchResultList from "../components/SearchResultList.vue";
import { isEmpty } from "lodash";

const stringOptions = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];

export default {
  name: "MyLayout",
  components: {
    SearchResultList,
  },
  data() {
    return {
      model: null,
      searchFocus: false,
      filterOptions: stringOptions,
      leftDrawerOpen: false,
      searchInput: "",
      selected: "",
      searchFilter: {},
      links1: [
        { icon: "home", text: "Home" },
        { icon: "whatshot", text: "Trending" },
        { icon: "subscriptions", text: "Subscriptions" },
      ],
      links2: [
        { icon: "folder", text: "Library" },
        { icon: "restore", text: "History" },
        { icon: "watch_later", text: "Watch later" },
        { icon: "thumb_up_alt", text: "Liked videos" },
      ],
      links3: [
        { icon: "local_movies", text: "Movies & Shows" },
        { icon: "videogame_asset", text: "Gaming" },
        { icon: "live_tv", text: "Live" },
      ],
      links4: [
        { icon: "settings", text: "Settings" },
        { icon: "flag", text: "Report history" },
        { icon: "help", text: "Help" },
        { icon: "feedback", text: "Send feedback" },
      ],
      buttons1: [
        { text: "About" },
        { text: "Press" },
        { text: "Copyright" },
        { text: "Contact us" },
        { text: "Creators" },
        { text: "Advertise" },
        { text: "Developers" },
      ],
      buttons2: [
        { text: "Terms" },
        { text: "Privacy" },
        { text: "Policy & Safety" },
        { text: "Test new features" },
      ],
    };
  },

  mounted() {
    document.addEventListener("click", this.onClickAnywhere);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.onClickAnywhere);
  },
  computed: {
    searchFilterEmpty() {
      return _.isEmpty(this.searchFilter);
    },
  },
  methods: {
    addToSearch(type, value) {
      console.log("add", type, value);
      this.searchInput = "";
      if (!(type in this.searchFilter)) {
        // make it a set
        this.$set(this.searchFilter, type, new Set());
      }
      this.searchFilter[type].add(value);

      console.log(this.searchFilter);
      console.log(this.searchFilterEmpty);
      console.log(_.isEmpty(this.searchFilter));
    },
    // todo: loosely couple trigger via prop instead of using refs
    selectNextSuggestion: function () {
      this.$refs.searchResult.selectNext();
    },
    selectPrevSuggestion: function () {
      this.$refs.searchResult.selectPrev();
    },
    onClickAnywhere(event) {
      const el = this.$refs.searchBar.$el;
      if (el == event.target || el.contains(event.target)) {
        console.log("INSIDE");
        this.searchFocus = true;
      } else {
        console.log("OUTSIDE");
        this.searchFocus = false;
      }
    },
  },
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
.edekaBar
  background: #343638 url("http://localhost:8080/images/background-dark.jpg")
  background-position-x: 0%
  background-position-y: 0%
  background-repeat: repeat
  background-size: auto
  background-position: 0 0
  background-repeat: repeat
  background-size: 400px 400px
  border-bottom: 2px solid #000
.q-field__bottom
  z-index: 9999;
.q-field--with-bottom
  padding-bottom: 0px
.q-field--dense
  position: absolute
  top: 120px
  height: 80px
  max-width: 100%
  transition: all 0.5s ease
  .q-field__control,.q-field__prepend
    height: 80px
    transition: all 0.5s ease
    border-radius: 28px
.q-field.active
  position: absolute
  top: 0px
  height: 40px
  max-width: 800px
  .q-field__control,.q-field__prepend
    height: 40px
    border-radius: 0px
.YL
  &__toolbar-input
    min-width: 200px
    width: 100%
    .q-field__bottom
      padding: 0px;
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
  &__sticky
    min-height: 49px
    border-bottom: 1px solid rgba(0,0,0,0.12)
  &__sticky-help
    border: 1px solid #ccc
    padding-left: 8px
    padding-right: 8px
  &__sticky-settings
    padding-left: 17px
    padding-right: 17px
    border: 1px solid #ccc
</style>
