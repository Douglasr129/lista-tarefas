/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'
import axios from 'axios';
import VueAxios from 'vue-axios';

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
  app.use(vuetify).use(pinia).use(VueAxios, axios).use(router)
}
