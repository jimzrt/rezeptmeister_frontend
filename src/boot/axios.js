import Vue from "vue";
import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";

Vue.prototype.$axios = axios.create({
  baseURL: "/api",
  adapter: cacheAdapterEnhancer(axios.defaults.adapter)
});
