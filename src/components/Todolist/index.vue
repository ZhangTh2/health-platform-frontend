<template>
  <el-dropdown trigger="hover" >
    <div>
      <svg-icon class-name="size-icon" :icon-class="iconClass"/>
    </div>
    <el-dropdown-menu slot="dropdown" style="margin-top: 40px;margin-left: 10px">
      <el-dropdown-item v-for="(item,key) in this.notify" :key="key">{{item}}
      </el-dropdown-item>

    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import {getUnckeck} from "../../api/admin";
import {getUncheckService} from "../../api/service";

export default {
        name: "index",
      data(){
          return{
            iconClass:'notify',
            notify:[],
          }
      },
      created() {
          getUnckeck().then(response=>{
            console.log('获取未审核'+response.data+'类型是'+typeof response.data)
            var no =response.data
            if(no["service"] !==0) {
              this.notify.push(no["service"]+'个待审核的服务管理员')
            }
            if(no['bussiness'] !==0) {
              this.notify.push(no["bussiness"]+'个待审核的业务管理员')
            }
          })
        getUncheckService().then(response=>{
          console.log("获取未审核的服务数量")
          var service=response.data
          if(service["online"] !==0) {
            this.notify.push(service["online"]+'个待审核的线上服务')
          }
          if(service['offline'] !==0) {
            this.notify.push(service["offline"]+'个待审核的线下服务')
          }
          if(this.notify.length == 0)
            this.iconClass='notify1'
        })

      },
  methods:{

  }
    }
</script>

<style scoped>
  .size-icon {
    font-size: 20px;
    cursor: pointer;
    vertical-align: -4px!important;
  }
</style>
