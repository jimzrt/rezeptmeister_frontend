import Vue from 'vue'
import axios from 'axios'
import { cacheAdapterEnhancer } from 'axios-extensions';

Vue.prototype.$axios = axios.create({
	baseURL: 'http://localhost:8080',
	proxy: 'http://localhost:8080',
	//headers: { 'Cache-Control': 'no-cache' },
	// cache will be enabled by default
	adapter: cacheAdapterEnhancer(axios.defaults.adapter)
});