<template>
  <v-app style="overflow-y:hidden;">
    <v-main>
      <Identify :distance="distance"  @identifySnackbar="setSnackbar" v-if="identifyActive()"/>
      <WebMap></WebMap>
      <v-snackbar v-model="snackbar" timeout="1000"> Nо result</v-snackbar>
      <v-navigation-drawer width="400" style="z-index: 50000" v-if="openSettings" color="secondary" right fixed permanent>
        <Settings @distanceSent="getDistance"></Settings>
       </v-navigation-drawer>
    </v-main>
  </v-app>
</template>

<script>

import WebMap from '../src/components/WebMap'
import Identify from '../src/components/Identify'
import Settings from '../src/components/Settings'

export default {
  name: 'Home',
  components: {
    WebMap, Identify, Settings
  },

  data () {
    return {
      snackbar: false,
      // openSettings: false,
      dialog: true,
      distance: 5,
      activeIdentify: false
    }
  },
  computed: {
    dynamicLayer () {
      return this.$store.getters.getDynamic
    },
    openSettings () {
      return this.$store.getters.getOpenSettings
    }
  },
  methods: {
    getDistance (value) {
      this.distance = value
    },
    setSnackbar (params) {
      this.snackbar = params
    },
    identifyActive () {
     if (this.dynamicLayer.length !== 0) {
       return true
     } else {
       return false
     }
    }
  }
};
</script>

<style>
html,body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
}
#app {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
header {
  height: 64px  !important;
}
.leftRightCss{
  top: 64px !important;
  width: 64px !important;
}
.leftCssPanel{
 left: 64px  !important;
 height: calc(100% - 64px) !important;
}
.rightCssPanel{
 right: 64px  !important;
 height: calc(100% - 64px) !important;
}
.cssPanel{
 top: 64px  !important;
}
.footerCssPanel{
 height: calc(100% - 120px) !important;
}
.results{
  position:absolute;
  bottom: 0px;
}
.fullscreen {
  left: 0px !important;
  right: 0px !important;
  z-index: 10000000;
}
</style>
