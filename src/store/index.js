import Vue from 'vue'
import Vuex from 'vuex'
import layers from './modules/layers.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    map: null,
    mapView: null,
    openSettings: false,
    identifyActive: true
  },
  getters: {
    getMap (state) {
      return state.map
    },
    getMapView: state => {
      return state.mapView
    },
    getOpenSettings: state => {
      return state.openSettings
    },
    getIdentifyActive: state => {
      return state.identifyActive
    }
  },
  mutations: {
    setMap (state, map) {
      state.map = map
    },
    setMapView: (state, mapView) => {
      state.mapView = mapView
    },
    setOpenSettings: (state, os) => {
      state.openSettings = os
    },
    setIdentifyActive: (state, ia) => {
      state.identifyActive = ia
    }
  },
  actions: {
    changeMap ({ commit }, map) {
      commit('setMap', map)
    },
    storeMapView: ({ commit }, mapView) => {
      commit('setMapView', mapView)
    },
    changeOpenSettings: ({ commit }, os) => {
      commit('setOpenSettings', os)
    },
    changeIdentifyActive: ({ commit }, ia) => {
      commit('setIdentifyActive', ia)
    }
  },
  modules: {
    layers
  }
})
