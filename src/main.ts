import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'
import axios from 'axios';
import VueAxios from 'vue-axios';

const app = createApp(App)

registerPlugins(app)
app.use(VueAxios, axios)
app.mount('#app')
