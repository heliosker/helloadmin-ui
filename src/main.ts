import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/style/global.less';
import storage from '@/utils/Storage'
import i18n from '@/locales/setupI18n'
storage.setOptions({ namespace: 'v3_', isEncrypt: true })
// TODO:ls需要在生产模式下加密

// storage.set('asd', 'zxcxzcxzcxzcxzcxzxcxzcxzcxz')
console.log(storage.get('asd'))
const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app');