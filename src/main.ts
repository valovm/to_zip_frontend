import Btn from '@/components/ui/Btn.vue';
import Vue from 'vue';
import App from './App.vue';
import i18n from './i18n';
import './plugins/axios';
import router from './router';
import store from './store';

Vue.component('Btn', Btn);

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
