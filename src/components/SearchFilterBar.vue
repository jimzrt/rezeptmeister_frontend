<template>
  <div>
    <q-page-sticky
      expand
      position="top"
      style="transform: translate(0px, 60px);z-index:10"
    >
      <q-toolbar class="toolbar shadow-1" style="white-space: nowrap">
        <div
          ref="searchFilterBar"
          style="display: flex; flex-grow: 1; align-items: center"
        >
          <q-btn
            flat
            @click="drawer = !drawer"
            icon="filter_alt"
            v-if="isOverflowing"
            label="Filter"
            style="height: 56px"
          />
          <template v-else>
            <div
              class=""
              v-for="(searchKey, index) in nonEmptyFilter"
              :key="searchKey"
            >
              <template v-if="index > 0"
                ><q-separator vertical
              /></template>
              <template>
                <q-btn stretch flat :label="searchKey | canonicalName" />
                <q-chip
                  square
                  removable
                  clickable
                  v-for="item in value[searchKey]"
                  :key="item.id"
                  @click="addToSearch(searchKey, item, false, true)"
                  @remove="removeFromSearch(searchKey, item)"
                  :color="
                    'exclude' in item && item['exclude']
                      ? 'red'
                      : searchKey == 'ingredient'
                      ? 'primary'
                      : 'secondary'
                  "
                  text-color="white"
                  >{{ item.name }}
                  <q-toggle
                    :value="!('exclude' in item) || !item['exclude']"
                    @input="addToSearch(searchKey, item, false, true)"
                    checked-icon="add"
                    color="white"
                    icon-color="black"
                    unchecked-icon="remove"
                  />
                </q-chip>
              </template>
            </div>
            <q-select
              style="padding-left: 10px; min-width: 220px"
              filled
              stretch
              :options="options"
              label="Schwierigkeit"
              multiple
              emit-value
              :value="model"
              @input="difficultyChanged"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label v-html="scope.opt"></q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle
                      :value="model"
                      @input="difficultyChanged"
                      :val="scope.opt"
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn-dropdown flat filled stretch no-caps>
              <template v-slot:label>
                <div
                  class="row items-center no-wrap"
                  v-bind:style="
                    standard > 0
                      ? ''
                      : $q.dark.isActive
                      ? 'color: rgba(255,255,255,0.7);'
                      : 'color: rgba(0, 0, 0, 0.6);'
                  "
                >
                  <q-icon left name="local_fire_department" />
                  <div class="text-center">
                    {{
                      "Max Kcal" + (standard > 0 ? " (" + standard + ")" : "")
                    }}
                  </div>
                </div>
              </template>
              <div class="q-pa-md">
                <q-slider
                  style="min-width: 280px; margin-top: 10px"
                  :value="standard"
                  @change="caloriesChanged"
                  :min="0"
                  :max="maxCalories"
                  label-always
                />
              </div>
            </q-btn-dropdown>
            <q-btn-dropdown flat filled stretch no-caps>
              <template v-slot:label>
                <div
                  class="row items-center no-wrap"
                  v-bind:style="
                    totalTime > 0
                      ? ''
                      : $q.dark.isActive
                      ? 'color: rgba(255,255,255,0.7);'
                      : 'color: rgba(0, 0, 0, 0.6);'
                  "
                >
                  <q-icon left name="schedule" />
                  <div class="text-center">
                    Max Zubereitungszeit
                    <template v-if="totalTime > 0"
                      >({{ totalTime | formatDate }})</template
                    >
                  </div>
                </div>
              </template>
              <div class="q-pa-md">
                <!-- todo: get max totalTime -->
                <q-slider
                  style="min-width: 280px; margin-top: 10px"
                  :value="totalTime"
                  :min="0"
                  :max="maxtotalTime"
                  :step="300"
                  label-always
                  :label-value="totalTimeLabel | formatDate"
                  @change="totalTimeChanged"
                  @input="val => (totalTimeLabel = val)"
                  snap
                />
              </div>
            </q-btn-dropdown>
          </template>
          <q-space />
          <q-btn
            stretch
            flat
            icon="clear"
            label="Filter löschen"
            @click="$emit('onClearSearch')"
          />
        </div>
      </q-toolbar>
    </q-page-sticky>
    <q-drawer
      v-if="isOverflowing"
      v-model="drawer"
      :width="300"
      overlay
      bordered
    >
      <q-scroll-area class="fit">
        <template>
          <div
            class=""
            v-for="(searchKey, index) in nonEmptyFilter"
            :key="searchKey"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 6px;
            "
          >
            <template v-if="index > 0"
              ><q-separator
            /></template>
            <template>
              <q-btn stretch flat :label="searchKey | canonicalName" />
              <q-chip
                square
                removable
                clickable
                v-for="item in value[searchKey]"
                :key="item.id"
                @click="addToSearch(searchKey, item, false, true)"
                @remove="removeFromSearch(searchKey, item)"
                :color="searchKey == 'ingredient' ? 'primary' : 'secondary'"
                text-color="white"
                >{{ item.name }}</q-chip
              >
              <template v-if="value['exclude']">
                <q-chip
                  square
                  removable
                  clickable
                  v-for="item in value['exclude'][searchKey]"
                  :key="item.id"
                  @click="addToSearch(searchKey, item, false, true)"
                  @remove="removeFromSearch(searchKey, item)"
                  color="red"
                  text-color="white"
                  >{{ item.name }}</q-chip
                >
              </template>
            </template>
          </div>
          <q-select
            filled
            stretch
            :options="options"
            label="Schwierigkeit"
            multiple
            emit-value
            :value="model"
            @input="difficultyChanged"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label v-html="scope.opt"></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    :value="model"
                    @input="difficultyChanged"
                    :val="scope.opt"
                  />
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-btn-dropdown flat filled stretch no-caps class="full-width">
            <template v-slot:label>
              <div
                class="row items-center no-wrap full-width"
                v-bind:style="
                  standard > 0
                    ? ''
                    : $q.dark.isActive
                    ? 'color: rgba(255,255,255,0.7);'
                    : 'color: rgba(0, 0, 0, 0.6);'
                "
              >
                <q-icon left name="local_fire_department" />
                <div class="text-center">
                  {{ "Max Kcal" + (standard > 0 ? " (" + standard + ")" : "") }}
                </div>
              </div>
            </template>
            <div class="q-pa-md">
              <q-slider
                style="min-width: 280px; margin-top: 10px"
                :value="standard"
                @change="caloriesChanged"
                :min="0"
                :max="maxCalories"
                label-always
              />
            </div>
          </q-btn-dropdown>
          <q-btn-dropdown flat filled stretch no-caps class="full-width">
            <template v-slot:label>
              <div
                class="row items-center no-wrap full-width"
                v-bind:style="
                  totalTime > 0
                    ? ''
                    : $q.dark.isActive
                    ? 'color: rgba(255,255,255,0.7);'
                    : 'color: rgba(0, 0, 0, 0.6);'
                "
              >
                <q-icon left name="schedule" />
                <div class="text-center">
                  Max Zubereitungszeit
                  <template v-if="totalTime > 0"
                    >({{ totalTime | formatDate }})</template
                  >
                </div>
              </div>
            </template>
            <div class="q-pa-md">
              <!-- todo: get max totalTime -->
              <q-slider
                style="min-width: 280px; margin-top: 10px"
                :value="totalTime"
                :min="0"
                :max="maxtotalTime"
                :step="300"
                label-always
                :label-value="totalTimeLabel | formatDate"
                @change="totalTimeChanged"
                @input="
                  val => {
                    totalTimeLabel = val;
                  }
                "
                snap
              />
            </div>
          </q-btn-dropdown>
        </template>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>

<script>
import { clone, remove, difference } from "lodash";

export default {
  name: "SearchFilterBar",
  props: ["value"],
  mounted() {
    this.mounted = true;
    this.checkOverflow();
  },
  activated() {
    this.checkOverflow();
  },
  created() {
    window.addEventListener("resize", this.checkOverflow);
    document.addEventListener("click", this.onClickAnywhere);
  },

  destroyed() {
    window.removeEventListener("resize", this.checkOverflow);
    document.removeEventListener("click", this.onClickAnywhere);
  },
  computed: {
    nonEmptyFilter() {
      let a = Object.keys(this.value)
        .sort()
        .filter(
          key =>
            key != "difficulty" &&
            key != "calories" &&
            key != "exclude" &&
            (this.value[key].length > 0 ||
              (this.value["exclude"] &&
                key in this.value["exclude"] &&
                this.value["exclude"][key].length > 0))
        );
      return a;
    }
  },
  filters: {
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
      if (formatedDate.length == 0) {
        formatedDate = "0";
      }
      return formatedDate;
    },
    canonicalName(name) {
      switch (name) {
        case "ingredient":
          return "Zutaten";
        case "recipe":
          return "Rezepte";
        case "tag":
          return "Kategorien";
        default:
          return name;
      }
    }
  },
  methods: {
    onClickAnywhere(event) {
      // check if clicked outside of search bar
      if (!this.drawer) {
        return;
      }

      if (event.target.classList.contains("q-drawer__backdrop")) {
        this.drawer = false;
      }
    },
    checkOverflow() {
      this.isOverflowing = false;
      this.$nextTick(() => {
        if (!this.$refs.searchFilterBar) return;
        this.isOverflowing =
          this.$refs.searchFilterBar.offsetWidth > window.innerWidth;
      });
    },
    englishDifficulty(name) {
      switch (name) {
        case "Einfach":
          return "EASY";
        case "Medium":
          return "MEDIUM";
        case "Schwer":
          return "HARD";
        default:
          return name;
      }
    },
    totalTimeChanged(event) {
      this.totalTime = event;
      this.addToSearch("totalTime", this.totalTime, true);
    },
    caloriesChanged(event) {
      this.standard = event;
      this.addToSearch("calories", this.standard, true);
    },
    difficultyChanged(event) {
      event = event.sort();
      if (this.model.length > event.length) {
        //deleted
        this.$emit(
          "onRemoveFromSearch",
          "difficulty",
          this.englishDifficulty(_.difference(this.model, event)[0])
        );
      } else {
        //added
        this.$emit(
          "onAddToSearch",
          "difficulty",
          this.englishDifficulty(_.difference(event, this.model)[0])
        );
      }
      this.model = event;
    },
    addToSearch(type, value, single = false, exclude = false) {
      this.$emit("onAddToSearch", type, value, single, exclude);
    },
    removeFromSearch(type, value) {
      this.$emit("onRemoveFromSearch", type, value);
    },
    log(key, item) {
      this.dataCopy = _.clone(this.value);
      _.remove(this.dataCopy[key], item);
      this.updateData();
    },
    updateData() {
      this.$emit("input", this.dataCopy);
    }
  },
  data() {
    return {
      mounted: false,
      dataCopy: {},
      maxCalories: 1000,
      maxtotalTime: 10800,
      model: [],
      standard: 0,
      totalTime: 0,
      totalTimeLabel: 0,
      options: ["Einfach", "Medium", "Schwer"],
      isOverflowing: false,
      drawer: false,
      third: true
    };
  },
  watch: {
    "$props.value": {
      handler: function(val, oldVal) {
        this.checkOverflow();
      },
      deep: true
    }
  }
};
</script>

<style lang="sass">
.q-field--filled.q-field--dark .q-field__control, .q-field--filled.q-field--dark .q-field__control::before, .q-field--filled .q-field__control
  background: initial

.toolbar
  background-color: var(--q-color-background)
  z-index: 10
.YL
  &__sticky
    padding: 10px
    min-height: 49px
    border-bottom: 1px solid rgba(0,0,0,0.12)
    flex-direction: row
    // align-items: baseline
</style>
