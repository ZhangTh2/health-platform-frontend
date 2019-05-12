import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whitelists=['/adminlogin','/register']  //不重定向白名单
//全局钩子，在路由改变之前使用，这里用做进行权限的控制
//to：即将进入的路由对象
//from：即将离开的当前界面
//next:钩子的状态，执行完了是confirmed，否则是false,终止导航
/**
 * 逻辑
 * 查看是否有Token，有的话如果是去登录直接重定向到首页，不是的话（已经重定向到首页了）要先判断一下用户信息是否拉取了，没拉取去拉取
 * 如果没有Token，除了白名单中的页面（不用访问权限），都重定向到登录页面
 */
router.beforeEach((to,from,next) => {
  NProgress.start()
  if(getToken()) {
    if(to.path==='/adminlogin') {
      next({path:'/'})
      NProgress.done()
    }else{
      if(store.getters.role==='') {
        store.dispatch('GetAdminInfo').then(res =>{
          const role = res.data.role
           store.dispatch('GenerateRoutes', { role }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters)// 动态添加可访问路由表
           // next({ ...to, replace: true })// hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
          next()
          }
        ).catch((err) => {
          //获取用户信息时出错则让用户登出再重新登录
          // console.log("error is"+err)
          store.dispatch('FedLogOut').then(() => {
            Message.error(err||"验证未通过，请重新登录")
            next({path:'/adminlogin'})
          })
        })
      }else {
        next()

      }
    }
  }else{
    if(whitelists.indexOf(to.path)!==-1) {
      //在白名单中的页面继续执行
      next()
    }else{
      next(`/adminlogin?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
})

