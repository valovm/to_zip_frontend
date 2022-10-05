import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
console.log(process.env);

export default new VueI18n({
  locale: process.env.DEFAULT_LOCALE || 'en',
  fallbackLocale: process.env.DEFAULT_LOCALE || 'en',
  messages: {
    'en': require('./locales/en.json'),
    'ru': require('./locales/ru.json'),
  },
});
