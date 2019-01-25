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
    redirect:'/adminlist/index',
    meta:{
      title:'管理员列表',
      icon:'adminuser_list',
      roles:[1]
    },
    children:[
      {
        path:'serviceadmin',
        name:'serviceadmin',
        Component: () => import('@/views/adminlist/index'),
        meta:{
          title:'服务管理员',
          icon:'serviceadmin_list',
          roles:[1]
        }
      },
      {
        path:'businessadmin',
        name:'businessadmin',
        Component:()=>import('@/views/adminlist/index'),
        meta:{
          title:'商业管理员',
          icon:'businessadmin_list',
          roles:[1]
        }
      }
    ]
  },





  //最后挂载404
  { path: '*', redirect: '/404', hidden: true }
]