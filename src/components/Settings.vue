<template>
  <v-container
    class="info--text secondary pa-0"
    ref="container"
    style="overflow-y: auto, z-index: 50000"
  >
    <div>
      <v-row class="px-3" justify="center" align-content="center" align="center">
        <v-col align-self="center" class="text-left">
          <h2>Widgets</h2>
        </v-col>
        <v-col class="text-right">
          <v-btn icon color="info" @click="close()" style="margin-bottom: 2px;">
            <v-icon dark>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </div>
    <v-expansion-panels multiple>
     <v-expansion-panel>
       <v-expansion-panel-header>
       Base maps
      </v-expansion-panel-header>
      <v-expansion-panel-content class="pa-0">
        <div>
          <v-row class="px-3">
            <v-col v-for="(map, index) in basemaps" :key="index" cols="4">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-card v-bind="attrs" v-on="on"
                    @click="changeBasemap(map)"
                    :class="{'selected': map.id === selected}"
                    :color="color(map)"
                  >
                    <v-badge
                      :value="map.vector"
                      content="V"
                      color="primary" left overlap style="width:100%">
                      <v-img :src="map.thumbnailUrl" class="rounded-t"></v-img>
                    </v-badge>
                    <v-card-title class="caption justify-center pa-1">
                      <span class="basemapTitle">{{map.label}}</span>
                    </v-card-title>
                  </v-card>
                </template>
                {{map.label}}
              </v-tooltip>
            </v-col>
          </v-row>
        </div>
       </v-expansion-panel-content>
     </v-expansion-panel>
     <v-expansion-panel>
       <v-expansion-panel-header>
        Go to XY
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-container>
          <v-row align="center" justify="center" class="py-0 mt-4">
          <v-col class="py-0">
            <v-text-field  label="x" v-model="X" type="text" @keyup.enter="zoomTo()" append-icon="mdi-map-marker"/>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" class="py-0">
          <v-col class="py-0">
            <v-text-field label="y" v-model="Y" type="text" @keyup.enter="zoomTo()" append-icon="mdi-map-marker"/>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col>
            <v-btn block @click="zoomToFromXY()">zoom</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
  <v-expansion-panel>
     <v-expansion-panel-header>
       Distance for identify
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-container>
          <v-subheader inset> Distance for identify </v-subheader>
          <v-slider
          v-model="distance"
          thumb-label
          min="0"
          max="100"
          @change="sendDistance()"
        ></v-slider>
        </v-container>
      </v-expansion-panel-content>
     </v-expansion-panel>
     <v-expansion-panel>
       <v-expansion-panel-header>
        Search
      </v-expansion-panel-header>
<v-expansion-panel-content>
  <Search></Search>
</v-expansion-panel-content>
     </v-expansion-panel>
     <v-expansion-panel @change="destroyElevation()">
      <v-expansion-panel-header>
        Elevation Profile
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <Elevation ref='elevation'></Elevation>
      </v-expansion-panel-content>
    </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Coordinates
        </v-expansion-panel-header>
      <v-expansion-panel-content>
        <Coordinates></Coordinates>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel @change="destroyMeasure()">
      <v-expansion-panel-header>
        Measure
      </v-expansion-panel-header>
      <v-expansion-panel-content>
      <Measure ref='measure'></Measure>
      </v-expansion-panel-content>
    </v-expansion-panel>
    </v-expansion-panels>    
  </v-container>
</template>

<script>
import { loadModules } from 'esri-loader'
import Search from '../widgets/Search.vue'
import Elevation from '../widgets/Elevation.vue'
import Coordinates from '../widgets/Coordinates.vue'
import Measure from '../widgets/Measure.vue'
export default {
  name: 'Settings',
  components: { Search, Elevation, Coordinates, Measure },
  data () {
    return {
      X: null,
      Y: null,
      distance: 0,
      "basemaps": [
				{
					"vector": false,
					"label": "Topographic",
					"id": "topo",
					"thumbnailUrl": "https://js.arcgis.com/4.4/esri/images/basemap/topo.jpg"
				},
				{
					"vector": false,
					"label": "Streets",
					"id": "streets",
					"thumbnailUrl": "https://js.arcgis.com/4.4/esri/images/basemap/streets.jpg"
				},
				{
					"vector": false,
					"label": "World Navigation Map",
					"id": "streets-navigation-vector",
					"thumbnailUrl": "https://js.arcgis.com/4.4/esri/images/basemap/streets-navigation.jpg"
				},
				{
					"vector": false,
					"label": "Dark Gray Canvas",
					"id": "dark-gray",
					"thumbnailUrl": "https://js.arcgis.com/4.4/esri/images/basemap/dark-gray.jpg"
				},
        {
					"vector": true,
					"label": "Topographic (Vector)",
					"id": "topo-vector",
					"thumbnailUrl": "https://js.arcgis.com/4.4/esri/images/basemap/topo.jpg"
				},
				{
					"vector": true,
					"label": "World Steet Map (Vector)",
					"id": "streets-vector",
					"thumbnailUrl": "https://js.arcgis.com/4.4/esri/images/basemap/streets.jpg"
				}
			],
      selected: 'topo',
      headerHeight: '0px',
      computedHeight: '0px'
    }
  },
  computed: {
    openSettings () {
      return this.$store.getters.getOpenSettings
    }
  },
  methods: {
    sendDistance () {
       this.$emit('distanceSent', this.distance)
    },
    destroyMeasure () {
      this.$refs.measure.destroy()
    },
    destroyElevation() {
      this.$refs.elevation.destroy()
    },
    zoomToFromXY () {
      loadModules(['esri/geometry/Point'], { css: true })
        .then(([Point]) => {
          const point = new Point({
            longitude: parseFloat(this.X),
            latitude: parseFloat(this.Y)
          })
          const view = this.$store.getters.getMapView
          view.goTo({ center: point, zoom: 15 })
            .catch(error => {
              console.log(error)
            })
        })
    },
    close () {
      const openValue = !this.openSettings
      this.$store.dispatch('changeOpenSettings', openValue)
    },
    changeBasemap (map) {
      const webMap = this.$store.getters.getMap
      webMap.basemap = map.id
      this.selected = map.id
    },
    color (map) {
      if (map.id === this.selected) {
        return 'primary'
      }
      return ''
    },
    resize () {
      if (this.activeToolId === 'basemap') {
        const containerH = this.$refs.container.clientHeight
        const headerH = this.$refs.header.clientHeight
        this.headerHeight = headerH + 'px'
        const h = containerH - headerH
        this.computedHeight = h + 'px'
      }
    }
  }
}
</script>

<style scoped>
.basemapTitle {
  white-space: nowrap ;
  word-break: normal;
  overflow: hidden ;
  text-overflow: ellipsis;
}
.selected {
  border: 3px solid;
}
</style>
