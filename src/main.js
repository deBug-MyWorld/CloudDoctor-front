// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import qs from 'qs'
import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.$qs = qs
Vue.prototype.$axios = axios 

var myAxios=axios.create({//纯净的axios
  baseURL:'',
  timeout:5000,
  headers:{"Content-Type":"multipart/form-data"}
})

Vue.prototype.$myAxios=myAxios;

Vue.use(ElementUI); 
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:8080';
//POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
      config.data = qs.stringify(config.data);
  }
  else{
    config.data = JSON.stringify(config.data)
  }
  return config;
}, (error) => {
  Message({
      type: 'error',
      message: '错误的传参'
  });
  return Promise.reject(error); 
});

//路由全局守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record=>record.meta.requireAuth)) {//判断该路由是否需要登录权限 
    // console.log(sessionStorage.getItem('username'))
    if(sessionStorage.getItem('username')!=null){//判断是否登录
      next();
    }
    else{
      next({
        path:'/login',
        query:{redirect:to.fullPath}
      })
    }
  }
  else{
    next();
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
