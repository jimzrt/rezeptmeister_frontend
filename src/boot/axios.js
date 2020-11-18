import Vue from 'vue'
import axios from 'axios'
import { cacheAdapterEnhancer } from 'axios-extensions';

Vue.prototype.$axios = axios.create({
	baseURL: process.env.API,
	adapter: cacheAdapterEnhancer(axios.defaults.adapter)
});