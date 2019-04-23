import Vue from 'vue'
import Router from 'vue-router'


/* Layout */
import Layout from '@/views/layout/Layout'
Vue.use(Router)
//不需要访问权限的界面
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path:'/adminlogin',
    component:() => import('@/views/login/index'),
    hidden:true
  },
  {
    path:'/register',
    component:() => import('@/views/register/index'),
    hidden:true
  },
  {
    path:'/404',
    component:() => import('@/views/404'),
    hidden:true
  },

  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path:'/pesonalCenter',
    component:() => import('@/views/personalCenter/index'),
    hidden:true
  }


]


export default new Router({
  mode:'history',
  scrollBehavior: () => ({ y: 0 }),
  routes:constantRouterMap
})


//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [

  {
    path:'/adminlist',
    component:Layout,
   // redirect:'/adminlist/index',
    meta:{
      title:'管理员管理',
      // icon:'serviceadmin_list',
      icon:'adminmanage',
      roles:[1]
    },
    children:[
      {
        path:'serviceadmin',
        name:'serviceadmin',
        component: () => import('@/views/adminlist/serviceAdmin'),
        meta:{
          title:'服务管理员',
          // icon:'adminuser_list',
          roles:[1]
        }
      },
      {
        path:'businessadmin',
        name:'businessadmin',
        component:()=>import('@/views/adminlist/businessAdmin'),
        meta:{
          title:'业务管理员',
          // icon:'businessadmin_list',
          roles:[1]
        }
      }
    ]
  },
  {
    path: '/serviceCategory',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/serviceCategory/index'),
        name: 'serviceCategory',
        meta: { title: '服务类别', icon:'category',roles:[1] }
      }
    ]
  },
  {
    path: '/api',
    component: Layout,
    hidden:true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/api/index'),
        name: 'api',
        meta:{title:'api管理',icon:'',roles:[1,2]}
      }
    ]
  },
  {
    path:'/serviceManage',
    component:Layout,
    meta:{
      title:'服务管理',
      icon:'service',
      roles:[1]
    },
    children:[
      {
        path:'online',
        component:() => import('@/views/serviceManage/online'),
        name:'onlineService',
        meta:{title:'线上服务管理',icon:'',roles:[1,2]}
      },
      {
        path:'offline',
        component:() => import('@/views/serviceManage/offline'),
        name:'offlineService',
        meta:{title:'线下服务管理',icon:'',roles:[1,2]}
      }
    ]
  },
  {
    path:'/order',
    component:Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index'),
        name: 'order',
        meta:{
          title:'订单管理',
          icon:'order',
          roles:[1,3]
        }
      }
    ]
  },
  {
    path:'/turbine',
    component:Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/turbine/index'),
        name: 'turbine',
        meta:{
          title:'监控信息查看',
          icon:'turbine',
          roles:[1,2]
        }
      }
    ]

  },
  {
    path:'/log',
    component:Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/log/index'),
        name: 'log',
        meta:{
          title:'日志信息查看',
          icon:'log',
          roles:[1,2]
        }
      }
    ]

  },


  //最后挂载404
  { path: '*', redirect: '/404', hidden: true }
]
