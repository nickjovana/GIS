const state = {
  feature: [],
  dynamic: [],
  image: [],
  scene: [],
  featureJson: [],
  dynamicJson: [],
  imageJson: [],
  sceneJson: [],
  sublayersWrapperArray: []
}

const getters = {
  getFeature (state) {
    return state.feature
  },
  getDynamic (state) {
    return state.dynamic
  }
}

const mutations = {
  setFeature (state, feature) {
    state.feature.push(feature)
  },
  setDynamic (state, dynamic) {
    state.dynamic.push(dynamic)
  }
}

const actions = {
  addFeature ({ commit }, userObject) {
    commit('setFeature', userObject)
  },
  addDynamic ({ commit }, userObject) {
    commit('setDynamic', userObject)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
