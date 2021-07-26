<template>
  <div id="coordinates"></div>
</template>

<script>
import { loadModules } from 'esri-loader'
export default {
  name: 'coordinates',
  data () {
    return {
      coordinatesWidget: null
    }
  },
  computed: {
    mapView () {
      return this.$store.getters.getMapView
    }
  },
  created () {
    loadModules(['esri/widgets/CoordinateConversion'], { css: true })
      .then(([CoordinateConversion]) => {
        const view = this.mapView
        this.coordinatesWidget = new CoordinateConversion({
            view: view,
            container: 'coordinates',
            visibleElements: {
            expandButton: false
          },
        })
      })
  },
  methods: {
  }
}
</script>
