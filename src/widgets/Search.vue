<template>
  <div id="searchWidget"></div>
</template>

<script>
import { loadModules } from 'esri-loader'
export default {
  name: 'quickSearch',
  data () {
    return {
      searchWidget: null
    }
  },
  computed: {
    mapView () {
      return this.$store.getters.getMapView
    }
  },
  created () {
    loadModules(['esri/widgets/Search',  'esri/layers/FeatureLayer'], { css: true })
      .then(([SearchWidget, FeatureLayer]) => {
        const view = this.mapView
        const source =  { 
          layer: new FeatureLayer({
            url: "https://gissd.sandag.org/rdw/rest/services/Transportation/GTFS_Transit/MapServer/0",
            outFields: ["*"]
          }),
          searchFields: ["stop_name"],
          displayField: "stop_name",
          exactMatch: false,
          outFields: ["*"],
          name: "Station",
          placeholder: "Station"
        }
          this.searchWidget = new SearchWidget({
            view: view,
            allPlaceholder: 'Search',
            container: 'searchWidget',
            loacationEnabled: false,
            popupEnabled: false,
            sources: [source]
          })
      })
  }
}
</script>
