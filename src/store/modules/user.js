import { login, logout, getAdminInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    role:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    // FLASH_USER:(state =>{
    //   state.name=Lockr.get('name')
    //   state.role=Lockr.get('role')
    // })
  },

  // computed:{
  //   name:function(state) {
  //     if(state.role==''&&getToken()!==null) {
  //       this.dispatch('FLASH_USER');
  //     }
  //     return state.name;
  //   },
  //   role:function(state) {
  //     if(state.role==''&&getToken()!==null) {
  //       this.dispatch('FLASH_USER');
  //     }
  //     return state.role;
  //   }
  // },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
         const data = response.data
         // Cookies.set('Token',data.data)
          setToken(data)
          commit('SET_TOKEN', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    updateavatar({commit,state},avatar) {
      return new Promise((resolve, reject) => {
          commit('SET_AVATAR', avatar)
          resolve()
        })
    },
    GetAdminInfo({commit,state}) {
      //ES6中的Promise(),简单理解就是resolve是成功后的操作,reject是失败后的操作，
      return new Promise((resolve,reject) =>{
        console.log("获取admin内容")
        getAdminInfo(state.token).then(response=> {
          if (!response.data) {
            reject('Verification failed, please login again.')
          }
          const data =response.data
          console.log("adminInfo"+data.role+"    "+data.username+"     "+data.adminId)
          if(data.role==='') {
            console.log('该用户没有角色定义')
            reject('该用户没有角色定义')
          } else {
            console.log('添加role')
            commit('SET_ROLE',data.role)
           // Lockr.set('role',data.role)
          }
          commit('SET_NAME',data.username)
          if(data.avatar===''){
            console.log("无头像")
          }else {
            commit('SET_AVATAR',data.avatar)
          }
          resolve(response)
        })
      }).catch(error => {
        console.log("获取用户信息是报错了"+error)
        reject(error)
      }
      )
    },

    //用户主动登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        console.log("remove之后的"+getToken())
        resolve()
      })
    }
  }
}

export default user
