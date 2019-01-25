import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 修改了roles为单独的一个role
 */
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param role
 * @param route
 */
function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    if(route.meta.roles.indexOf(role)===-1) return false
    else return true
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param role
 */
function filterAsyncRouter(routes, role) {
  const res = []
  //console.log('asyncRouterMap:'+typeof asyncRouterMap)
  //console.log('constantRouterMap:'+typeof constantRouterMap)
  routes.forEach(route => {
    //console.log('route是'+route)
    const tmp = { ...route }
    if (hasPermission(role, tmp)) {
      console.log('添加一个')
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, role)
      }
      res.push(tmp)
    }
  })
  // for(route in routes) {
  //     console.log('route是'+route)
  //     const tmp = { ...route }
  //     if (hasPermission(role, tmp)) {
  //       if (tmp.children) {
  //         tmp.children = filterAsyncRouter(tmp.children, role)
  //       }
  //       res.push(tmp)
  //     }
  // }

  console.log('res是'+res)

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { role } = data
        let accessedRouters
        // if (roles.includes('admin')) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // }
        accessedRouters = filterAsyncRouter(asyncRouterMap, role)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
