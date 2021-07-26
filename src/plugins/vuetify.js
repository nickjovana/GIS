import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#0081FF',
          secondary: '#FFFFFF',
          error: '#EF0606',
          success: '#60FF00',
          info: '#000000',
          accent: '#FFFF00',
          warning: '#FFC107'
        },
        dark: {
          primary: '#0081FF',
          secondary: '#FFFFFF',
          error: '#EF0606',
          success: '#60FF00',
          info: '#000000',
          accent: '#FFFF00',
          warning: '#FFC107'
        }
      }
    }
  })
  