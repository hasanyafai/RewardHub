import { createApp } from 'vue'
import store from '@/stores/store'
import App from './App.vue'
import router from './router'
import AppSpinner from '@/components/AppSpinner.vue'
import VeeValidatePlagin from '@/plugins/VeeValidatePlagin'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { vfmPlugin } from 'vue-final-modal'
import VueQrcode from 'vue-qrcode'

import './assets/main.css'

const app = createApp(App)
app.component('AppSpinner', AppSpinner)
app.component('LanguageSelector', LanguageSelector)
app.component('VueQrcode', VueQrcode)

app.use(store)
app.use(router)
app.use(VeeValidatePlagin)
app.use(vfmPlugin)

router.isReady().then(() => {
    app.mount('#app')
    requestPermission()
  })

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });
}