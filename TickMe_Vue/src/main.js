import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import dayjs from 'dayjs'
import ObjectSupport from 'dayjs/plugin/objectSupport'
import '@/assets/icons/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import request from "@/utils/api"
Vue.prototype.$request = request
Vue.use(ElementUI)
// 挂载echarts
Vue.prototype.$echarts=window.echarts

Vue.prototype.dayjs = dayjs
dayjs.extend(ObjectSupport)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
