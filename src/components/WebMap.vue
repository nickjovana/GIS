<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate class="progress"></v-progress-linear>
    <div id='viewDiv'>
      <v-btn @click="openRightPanel()" style=" z-index:1000; position: absolute; top: 15px; left: 60px;">Widgets</v-btn> 
    </div>
  </div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
  name: 'WebMap',
  data () {
    return {
      map: null,
      view: null,
      loading: true
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
  mounted () {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(['esri/Map','esri/views/MapView',  "esri/widgets/Locate","esri/widgets/ScaleBar"], { css: true }).then(
      ([ArcGISMap, MapView, Locate, ScaleBar]) => {
        this.loading = true
        this.map = new ArcGISMap({
          basemap: 'topo',
          ground: 'world-elevation'
        })
        this.$store.dispatch('changeMap', this.map)
        this.addDataOnMap()
        this.view = new MapView({
          map:this.map,
          container: "viewDiv",
          center: [-117.1540,32.6938],
          zoom: 14
          })
        const locateWidget = new Locate({
            view: this.view
         })
        const scaleBar = new ScaleBar({
                view: this.view,
                unit: "dual"
              })
        this.view.ui.add(scaleBar, {
          position: "bottom-left"
        })
        this.view.ui.add(locateWidget, "top-left");
        this.$store.dispatch('storeMapView', this.view)
        const vm = this
        this.view.watch('updating', function (evt) {
              if (evt === true) {
                vm.loading = true
              } else {
                vm.loading = false
              }
            })
      })
  },
  methods: {
    addDataOnMap () {
      loadModules(['esri/layers/MapImageLayer', 'esri/layers/FeatureLayer', 'esri/layers/ImageryLayer', 'esri/layers/SceneLayer'],
        { css: true }).then(([MapImageLayer, FeatureLayer]) => {
                const serviceArray = [
                  {urlLink:'https://gissd.sandag.org/rdw/rest/services/Transportation/GTFS_Transit/MapServer', sublayers: [], title: 'Transit'},
                  {urlLink:'https://sampleserver6.arcgisonline.com/arcgis/rest/services/StoryMaps/StoryMapPlaces1/MapServer', sublayers: [], title: 'Fun place'}
                ]
                for (const serv of serviceArray) {
                  let service = null
                  if (serv.sublayers.length === 0) {
                    service = new MapImageLayer({
                      url: serv.urlLink,
                      visible: true,
                      title: serv.title
                    }) 
                  } else {
                    service = new MapImageLayer({
                      url: serv.urlLink,
                      visible: true,
                      sublayers: serv.sublayers,
                      title: serv.title
                    }) 
                  }
                  const dJson = {
                    id: service.id,
                    service: service,
                    url: serv.urlLink
                  }
                  this.$store.dispatch('addDynamic', dJson)
                  this.map.add(service)
                }
                const featureLayerUrl = 'https://gissd.sandag.org/rdw/rest/services/Census/MSA_SRA/MapServer/0'
                const featureLayer = new FeatureLayer({
                  url:  featureLayerUrl,
                  title: 'Region'
                })
                 const fJson = {
                    id: featureLayer.id,
                    service: featureLayer,
                    url: featureLayerUrl
                  }
                this.$store.dispatch('addFeature', fJson)
                this.map.add(featureLayer)
              })
    },
    openRightPanel(){
      const openSettingsTmp = this.openSettings
      this.$store.dispatch('changeOpenSettings', !openSettingsTmp)
      // this.$emit('clicked', this.openWidgets)
    },
  beforeDestroy () {
    if (this.view) {
      this.view.container = null
    }
  }
  }
}
</script>

<style scoped>
#viewDiv {
  height: 100%;
  width: 100%;
}
div {
 padding: 0;
 height: 100%;
}
.progress {
  position: absolute;
  top: 0;
  z-index: 1000;
}
</style>