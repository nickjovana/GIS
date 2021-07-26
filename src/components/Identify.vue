<template>
 <v-dialog id="dialog" :style="{left: leftPosition + 'px', top: topPosition + 'px' }" scrollable v-if="!shrinkToXS && results.length !== 0" v-model="dialogOpen" no-click-animation hide-overlay persistent>
    <v-card color="secondary info--text" style="max-width:300px; max-height:300px; position: fixed;" :style="{left: leftPosition + 'px', top: topPosition + 'px' }" >
      <v-system-bar color="primary accent--text">
        <span > Quick info </span>
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog()">mdi-close</v-icon>
      </v-system-bar>
      <v-card-text  style="height: 150px;" color="info" v-if="isFeature(results[page-1])">
        <v-row>
          <v-col  cols="10" sm="10" style="padding: 2px;">
            <h4 style="padding:10px;">{{results[page-1].layer.title}}</h4>
          </v-col>
          <v-col  cols="1" sm="1" style="padding: 4px;">
            <v-icon style="margin-left:20px; padding-top:10px;" @click="zoomTo(results[page-1])">mdi-magnify-plus-cursor</v-icon>
          </v-col>
        </v-row>
        <div v-for="(value, key, index) in results[page-1].attributes" :key="index"><h5> {{key}}: {{value}}</h5></div>
    </v-card-text>
    <v-card-text  style="height: 150px;" color="info" v-else>
      <v-row>
        <v-col  cols="9" sm="9" style="padding: 2px;">
          <h4 style="padding:10px;">{{results[page-1].layerName}}</h4>
        </v-col>
        <v-col  cols="1" sm="1" style="padding: 4px;">
          <v-icon v-if="results[page-1].feature.geometry.type === 'point'" style="margin-left:20px; padding-top:10px;" @click="goToGoogleView(results[page-1].feature)">mdi-alpha-g-circle-outline</v-icon>
        </v-col>
        <v-col  cols="1" sm="1" style="padding: 4px;">
          <v-icon  style="margin-left:20px; padding-top:10px;" @click="zoomTo(results[page-1])">mdi-magnify-plus-cursor</v-icon>
        </v-col>
      </v-row>
      <div v-for="(value, key, index) in results[page-1].feature.attributes" :key="index"><h5 v-if="value !== null && value!== '' &&  value!== 'Null'"> {{key}}: {{value}}</h5></div>
    </v-card-text>
    <v-card-actions  style="height:35px; margin:1px; padding:1px; width:330px;">
      <v-pagination color="primary accent--text" circle v-model="page" :length="results.length" :total-visible="5"></v-pagination>
    </v-card-actions>
  </v-card>
 </v-dialog>
 <v-bottom-sheet scrollable v-else-if="shrinkToXS && results.length !== 0" v-model="dialogOpen" no-click-animation hide-overlay persistent class="info--text secondary">
    <v-card >
    <v-system-bar color="primary accent--text">
      <span > Quick info </span>
      <v-spacer></v-spacer>
      <v-icon @click="closeDialog()">mdi-close</v-icon>
    </v-system-bar>
    <v-card-text  style="height: 150px;" color="info" v-if="isFeature(results[page-1])">
      <v-row>
        <v-col  cols="10" sm="10" style="padding: 2px;">
           <h4 style="padding:10px;">{{results[page-1].layer.title}}</h4>
        </v-col>
        <v-col  cols="1" sm="1" style="padding: 4px;">
          <v-icon style="margin-left:20px; " @click="zoomTo(results[page-1])">mdi-magnify-plus-cursor</v-icon>
        </v-col>
      </v-row>
    <div v-for="(value, key, index) in results[page-1].attributes" :key="index"><h5> {{key}}: {{value}}</h5></div>
    </v-card-text>
    <v-card-text  style="height: 150px;" color="info" v-else>
      <v-row>
        <v-col  cols="9" sm="9" style="padding: 2px;">
          <h3 style="padding:10px;">{{results[page-1].layerName}}</h3>
        </v-col>
         <v-col  cols="1" sm="1" style="padding: 4px;">
          <v-icon v-if="results[page-1].feature.geometry.type === 'point'" style="margin-left:20px; padding-top:10px;" @click="goToGoogleView(results[page-1].feature)">mdi-alpha-g-circle-outline</v-icon>
        </v-col>
        <v-col  cols="1" sm="1" style="padding: 4px;">
          <v-icon style="margin-left:20px; padding-top:10px;" @click="zoomTo(results[page-1])">mdi-magnify-plus-cursor</v-icon>
        </v-col>
      </v-row>
      <div v-for="(value, key, index) in results[page-1].feature.attributes" :key="index"><h5 v-if="value !== null && value!== '' &&  value!== 'Null'"> {{key}}: {{value}}</h5></div>
    </v-card-text>
    <v-card-actions  style="margin:1px; padding:1px; width:330px;">
      <v-pagination color="primary accent--text" circle v-model="page" :length="results.length" :total-visible="5"></v-pagination>
    </v-card-actions>
    </v-card>
 </v-bottom-sheet>
</template>

<script>
import { loadModules } from 'esri-loader'
export default {
  name: 'Tool4',
  props: {
    distance: Number
  },
  data () {
    return {
      dynamicLayers: [],
      featureLayers: [],
      configJson: null,
      resultsArray: [],
      init: true,
      page: 0,
      leftPosition: 0,
      topPosition: 0,
      getResult: false,
      counter: 0,
      counterAsync: 0,
      innerHeight: 0,
      innerWidth: 0,
      layerToRemove: null,
      service: [],
      onclick: null
    }
  },
  created () {
    this.dynamicLayers = this.$store.getters.getDynamic
    this.featureLayers = this.$store.getters.getFeature
  },
  watch: {
    snackbar: function () {
      // Emit this information to the parents component
      this.$emit('identifySnackbar', this.snackbar)
    },
    page (newVal) {
      const vm = this
      if (newVal === 0) {
        vm.map.remove(vm.layerToRemove)
      }
      if (newVal !== 0) {
        if (vm.layerToRemove !== null) {
          vm.map.remove(vm.layerToRemove)
        }
        if (vm.isFeature(vm.results[vm.page - 1])) {
          this.setGeometrySymbol(vm.results[vm.page - 1].geometry)
        } else {
          this.setGeometrySymbol(vm.results[vm.page - 1].feature.geometry)
        }
      }
    },
    activeIdentify (newVal) {
      if (newVal) {
        this.clickRegister()
      } else {
        this.clickUnregister()
      }
    }
  },
  mounted () {
    this.clickRegister()
  },
  computed: {
    shrinkToXS () {
      return this.$vuetify.breakpoint.xsOnly
    },
    mapView () {
      return this.$store.getters.getMapView
    },
    map () {
      return this.$store.getters.getMap
    },
    results () {
      return this.resultsArray
    },
    dialogOpen () {
      return this.getResult
    },
    snackbar () {
      return (this.init === false) && (this.counter === this.counterAsync) && (this.dialogOpen === false)
    },
    activeIdentify () {
      return this.$store.getters.getIdentifyActive
    }
    /* getResult () {
      return `${this.getFeatureResult}|${this.getDynamicResult}`
    } */
  },
  methods: {
    clickRegister () {
      const vm = this
      this.onclick = this.mapView.on('click', function (event) {
        vm.initialization(event)
        for (const dl of vm.dynamicLayers) {
            vm.dynamicIdentify(dl.url, dl, event)
          }
        for (const fl of vm.featureLayers) {
            vm.featureQuery(fl, event)
          }
        })
    },
    clickUnregister () {
      if (this.onclick !== null) {
        this.onclick.remove()
        this.onclick = null
      }
    },
    goToGoogleView(point) {
        const url = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint="+ point.geometry.latitude +","+ point.geometry.longitude +"";       
        window.open(url, '_blank')                
    },
    setGeometrySymbol (geometry) {
      const vm = this
      loadModules(['esri/Color', 'esri/symbols/SimpleLineSymbol', 'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleMarkerSymbol', 'esri/Graphic', 'esri/layers/GraphicsLayer'], { css: true }).then(
        ([Color, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, GraphicsLayer]) => {
          let sms = null
          const color = new Color([0, 255, 0, 0.7])
          if (geometry.type === 'point') {
            const sls = new SimpleLineSymbol({ style: 'solid', color: color, width: 4 })
            sms = new SimpleMarkerSymbol({ style: 'circle', size: 10, outline: sls, color: color })
          } else if (geometry.type === 'polygon') {
            const sls = new SimpleLineSymbol({ style: 'solid', color: color, width: 4 })
            sms = new SimpleFillSymbol({ style: 'solid', outline: sls, color: color })
          } else if (geometry.type === 'polyline') {
            sms = new SimpleLineSymbol({ style: 'solid', color: color, width: 4 })
          }
          const graphics = new Graphic({ geometry: geometry, symbol: sms })
          const layer = new GraphicsLayer({ graphics: graphics })
          vm.layerToRemove = layer
          vm.map.add(layer)
        })
    },
    initialization (event) {
      this.innerWidth = window.innerWidth
      this.innerHeight = window.innerWidth
      this.setPosition(window.innerWidth, window.innerHeight, event.native.clientX, event.native.clientY)
      this.init = true
      this.getResult = false
      this.counter = 0
      this.counterAsync = 0
      this.page = 0
      this.resultsArray = []
    },
    dynamicIdentify (om, dl, event) {
      const vm = this
      loadModules(['esri/geometry/geometryEngine', 'esri/tasks/IdentifyTask', 'esri/tasks/support/IdentifyParameters', 'esri/tasks/support/ImageServiceIdentifyParameters', 'esri/Graphic', 'esri/layers/FeatureLayer', 'esri/tasks/support/Query'], { css: true }).then(
        ([geometryEngine, IdentifyTask, IdentifyParameters]) => {
          const identifyTask = new IdentifyTask(om)
          const params = new IdentifyParameters()
          console.log(dl.service)
          const visibleLayers = dl.service.allSublayers.items.filter(obj => {
            return obj.visible === true
          })
          const visibleLayersIds = []
          for (const obj of visibleLayers) {
            visibleLayersIds.push(obj.id)
          }
          params.layerIds = visibleLayersIds
          this.counter++
          params.tolerance = 200
          console.log(this.distance)
          const polygon = geometryEngine.buffer(event.mapPoint, this.distance, 'meters')
          params.layerOption = 'visible'
          params.geometry = polygon
          params.returnGeometry = true
          // params.geometry = event.mapPoint
            params.mapExtent = vm.mapView.extent
            params.width = vm.mapView.width
            params.height = vm.mapView.height
      
          identifyTask.execute(params).then(function (response) {
            const results = response.results
            for (const result of response.results) {
              vm.resultsArray.push(result)
            }
            if (vm.resultsArray.length !== 0) {
              vm.page = 1
              vm.getResult = true
            }
            vm.counterAsync++
            vm.init = false
            console.log(results)
          })
        })
    },
    featureQuery (fl, event) {
      const vm = this
      loadModules(['esri/geometry/geometryEngine', 'esri/geometry/support/geodesicUtils', 'esri/geometry/Point'], { css: true }).then(
        ([geometryEngine]) => {
          const meters = vm.distance
          const polygon = geometryEngine.buffer(event.mapPoint, meters, 'meters')
          vm.counter++
          fl.service.queryFeatures({
            geometry: polygon,
            spatialRelationship: 'intersects',
            returnGeometry: true,
            returnQueryGeometry: true,
            outFields: ['*'],
            returnZ: false
          }).then(function (featureSet) {
            for (const result of featureSet.features) {
              vm.resultsArray.push(result)
            }
            if (vm.resultsArray.length !== 0) {
              vm.page = 1
              vm.getResult = true
            }
            vm.counterAsync++
            vm.init = false
            console.log(featureSet.features)
          }).catch(error => {
            vm.counterAsync++
            console.log(error)
          })
        })
    },
    zoomTo (result) {
      const view = this.mapView
      let geometry = null
      if (this.isFeature(result)) {
        geometry = result.geometry
      } else {
        geometry = result.feature.geometry
      } 
      view.goTo({
        center: geometry
      }).catch(function (error) {
        console.log(error)
      })
    },
    setPosition (windowWidth, windowHeight, clickLeft, clickTop) {
      if (windowWidth / 2 > clickLeft && windowHeight / 2 > clickTop) {
        this.leftPosition = clickLeft
        this.topPosition = clickTop
      } else if (windowWidth / 2 < clickLeft && windowHeight / 2 > clickTop) {
        this.leftPosition = clickLeft - 300
        this.topPosition = clickTop
      } else if (windowWidth / 2 > clickLeft && windowHeight / 2 < clickTop) {
        this.leftPosition = clickLeft
        this.topPosition = clickTop - 300
      } else {
        this.leftPosition = clickLeft - 300
        this.topPosition = clickTop - 300
      }
    },
    isFeature (result) {
      if (result !== undefined) {
        if (result.layerName !== undefined) {
          return false
        } else {
          if (result.geometry === null) {
            return false
          } else {
            return true
          }
        }
      } else {
        return false
      }
    },
    closeDialog () {
      this.getResult = false
      this.init = true
      this.resultsArray = []
      this.page = 0
    }
  }
}
</script>

<style>
.absolutePosition {
    position: absolute;
}
#dialog {
    max-width: 0px;
    overflow-x: hidden;
    max-height: 300px !important;
    position: absolute;
}
.v-dialog {
  box-shadow: none !important;
}
</style>
