import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import app from './modules/app'
//import errorlog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({

  modules:{
    app,
   // errorlog,
    permission,
    tagsView,
    user
  },
  getters
})

export default store
