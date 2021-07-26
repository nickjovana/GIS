<template>
<div id="wrapperMeasure">
  <div id="measure"></div>
</div>
</template>

<script>
import { loadModules } from 'esri-loader'
export default {
  name: 'coordinates',
  data () {
    return {
      measureWidget: null,
      created: false
    }
  },
  computed: {
    mapView () {
      return this.$store.getters.getMapView
    }
  },
  methods: {
   destroy () {
     if (this.measureWidget === null) {
       this.createWidget()
     } else {
      this.$store.dispatch('changeIdentifyActive', true)
      this.measureWidget.destroy()
      this.measureWidget = null 
     }
   },
   createWidget () {
     const vm = this
       loadModules(['esri/widgets/DistanceMeasurement2D'], { css: true })
      .then(([ DistanceMeasurement2D]) => {
        const view = vm.mapView
        if (document.getElementById('measure') === null) {
          const g = document.createElement('div')
          g.setAttribute("id", "measure")
          document.getElementById('wrapperMeasure').appendChild(g); 
        }
        this.$store.dispatch('changeIdentifyActive', false)
        vm.measureWidget = new DistanceMeasurement2D({
                  view: view,
                  container: 'measure'
                });
        })
        vm.$forceUpdate()
    }
  } 
}
</script>
