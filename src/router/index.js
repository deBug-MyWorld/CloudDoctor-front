import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/**
 * 重写路由的push方法 不然进入相同的页面会报错
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export default new Router({
  mode:'history',
  routes: [
    {
      path:'/',
      name:'home',
      redirect:{
        path:'/index'
      }
    }, 
    {
      path: '/login',
      name: 'login',
      component:(resolve)=>require(['@/views/login'],resolve),//异步按需加载组件
      meta:{
        titile:'登录',
        requireAuth:false  //不需要登录验证
      }
    },
    {
      path:'/index',
      name:'index',
      component:(resolve)=>require(['@/views/index'],resolve),//异步按需加载组件
      meta:{
        titile:'首页',
        requireAuth:false  //不需要登录验证
      }
    },
    {
      path:'/search',
      name:'search',
      component:(resolve)=>require(['@/views/search'],resolve),//异步按需加载组件
      meta:{
        titile:'搜索页',
        requireAuth:false  //不需要登录验证
      }
    },
    {
      path:'/askDoctor/:id',
      name:'askDoctor',
      component:(resolve)=>require(['@/views/doctor/askDoctor'],resolve),//异步按需加载组件
      meta:{
        titile:'询问医生页',
        requireAuth:true  //需要登录验证
      }
    },
    {
      path:'/chatRoom/:id',
      name:'chatRoom',
      component:(resolve)=>require(['@/views/doctor/chatRoom'],resolve),//异步按需加载组件
      meta:{
        titile:'用户问诊聊天页',
        requireAuth:true  //需要登录验证
      }
    },
    {
      path:'/doctorChatRoom/:id',
      name:'doctorChatRoom',
      component:(resolve)=>require(['@/views/doctor/doctorChatRoom'],resolve),//异步按需加载组件
      meta:{
        titile:'医生问诊聊天页',
        requireAuth:true  //需要登录验证
      }
    },
    {
      path:'/doctorInfo/:id',
      name:'doctorInfo',
      component:(resolve)=>require(['@/views/doctor/doctorInfo'],resolve),//异步按需加载组件
      meta:{
        titile:'医生信息页',
        requireAuth:false  //不需要登录验证
      }
    },
    {
      path:'/illness/:id',
      name:'illness',
      component:(resolve)=>require(['@/views/illness'],resolve),//异步按需加载组件
      meta:{
        titile:'疾病百科详情页',
        requireAuth:false  //不需要登录验证
      }
    },
    {
      path:'/department',
      name:'department',
      component:(resolve)=>require(['@/views/department'],resolve),//异步按需加载组件
      meta:{
        titile:'科室分类页',
        requireAuth:false  //不需要登录验证
      }
    },
    {
      path:'/account',
      // name:'account',
      component:(resolve)=>require(['@/views/myInfo/account'],resolve),//异步按需加载组件
      meta:{
        titile:'个人中心',
        requireAuth:true  //需要登录验证
      },
      children:[
        {
          path:'',
          name:'',
          component:(resolve)=>require(['@/views/myInfo/information'],resolve),//异步按需加载组件
        },
        {
          path:'information',
          name:'information',
          component:(resolve)=>require(['@/views/myInfo/information'],resolve),//异步按需加载组件
        },
        {
          path:'myDoctor',
          name:'myDoctor',
          component:(resolve)=>require(['@/views/myInfo/myDoctor'],resolve),//异步按需加载组件
        },
        {
          path:'myWallet',
          name:'myWallet',
          component:(resolve)=>require(['@/views/myInfo/myWallet'],resolve),//异步按需加载组件
        },
        {
          path:'myAnswer/:id',
          name:'myAnswer',
          component:(resolve)=>require(['@/views/myInfo/myAnswer'],resolve),//异步按需加载组件
        },
        {
          path:'doctorCertify',
          name:'doctorCertify',
          component:(resolve)=>require(['@/views/myInfo/doctorCertify'],resolve),//异步按需加载组件
        },
      ]
    },
    {
      path:'/admin',
      component:(resolve)=>require(['@/views/admin/index'],resolve),//异步按需加载组件
      meta:{
        titile:'管理员页面',
        requireAuth:true  //需要登录验证
      },
      children:[
        {
          path:'Account',
          name:'Account',
          component:(resolve)=>require(['@/views/admin/account'],resolve),//异步按需加载组件
        },    
        {
          path:'Chat',
          name:'Chat',
          component:(resolve)=>require(['@/views/admin/chat'],resolve),//异步按需加载组件
        },
        {
          path:'Comment',
          name:'Comment',
          component:(resolve)=>require(['@/views/admin/comment'],resolve),//异步按需加载组件
        },    
        {
          path:'Department',
          name:'Department',
          component:(resolve)=>require(['@/views/admin/department'],resolve),//异步按需加载组件
        },   
        {
          path:'Doctor',
          name:'Doctor',
          component:(resolve)=>require(['@/views/admin/doctor'],resolve),//异步按需加载组件
        }, 
        {
          path:'Illness',
          name:'Illness',
          component:(resolve)=>require(['@/views/admin/illness'],resolve),//异步按需加载组件
        }, 
        {
          path:'Order',
          name:'Order',
          component:(resolve)=>require(['@/views/admin/order'],resolve),//异步按需加载组件
        }, 
      ]
    },
    {
      path:'/error',
      name:'error',
      component:(resolve)=>require(['@/views/error'],resolve),//异步按需加载组件
      meta:{
        titile:'出错了',
        requireAuth:false  //不需要登录验证
      }
    },
    {
      path: '*',
      redirect: {
        path: '/error'
      }
    },
  ]
})
