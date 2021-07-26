<template>
<div id="wrapperElevation">
  <div id="elevation"></div>
</div>
</template>

<script>
import { loadModules } from 'esri-loader'
export default {
  name: 'elevation',
  data () {
    return {
      elevationWidget: null,
    }
  },
  computed: {
    mapView () {
      return this.$store.getters.getMapView
    }
  },
  methods: {
    createWidget () {
      const vm = this
       loadModules(['esri/widgets/ElevationProfile'], { css: true })
      .then(([ElevationProfile]) => {
        const view = vm.mapView
        if (document.getElementById('elevation') === null) {
          const g = document.createElement('div')
          g.setAttribute("id", "elevation")
          document.getElementById('wrapperElevation').appendChild(g); 
        }
        this.$store.dispatch('changeIdentifyActive', false)
         vm.elevationWidget = new ElevationProfile({
          view: view,
          profiles: [
            {
              type: "ground" // first profile line samples the ground elevation
            }
          ],
          visibleElements: {
            selectButton: false,
            clearButton: true,
            settingsButton: false
          },
          container: 'elevation',
        });
      })
       vm.$forceUpdate()
    },
    // add custom sources
    destroy () {
      if (this.elevationWidget === null) {
       this.createWidget()
     } else {
      this.$store.dispatch('changeIdentifyActive', true)
      this.elevationWidget.destroy()
      this.elevationWidget = null 
     }
   }
  }
}
</script>
