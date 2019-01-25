<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎：{{getAdminName}}</div>
    <div class="dashboard-text">{{getAdminType}}</div>
  </div>

</template>

<script>
import store from '@/store'
import {mapGetters} from 'vuex'   //mapGetter是一个映射，/store中的getters
export default {

  name:"Dashboard",

  computed:{
    //...是对象展开运算符，可以把一个对象混入到外部对象中，这里把mapGetters混入到了计算属性中
    // ...mapGetters([
    //   'name',
    //   'role'
    // ]),

    getAdminName() {
      return this.$store.getters.name
    },
    getAdminType(){
      if(this.$store.getters.role===1) return '超级管理员'
      else if(this.$store.getters.role.role===2) return '服务管理员'
      else if(this.$store.getters.role.role===3) return '业务管理员'
      else $store.dispatch('/404')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
