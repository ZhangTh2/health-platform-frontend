<template>
  <div class="app-container">
    <h1>养老服务注册中心</h1>
  <br/>
    <h3>服务信息</h3>
    <el-table
      v-loading="listloading"
      :data="applist"
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column
        prop="name"
        label="服务名"
        width="400px"
      >
      </el-table-column>
      <el-table-column
        prop="instanceNum"
        label="实例数量"
        width="200px"
      >
      </el-table-column>
      <el-table-column
        prop="instanceStatus"
        label="实例"
      ></el-table-column>
    </el-table>
    <br/>
    <h3>服务实例管理</h3>
    <el-table
      v-loading="listloading"
      :data="instancelist"
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column
        prop="instanceId"
        label="实例标识"
        width="400px">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="130px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ handlestatus(scope.row.status)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="renewalIntervalInSecs"
        label="续约时间间隔"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="durationInSecs"
        label="租约有效时间长"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="registrationTime"
        label="第一次注册时间"
        width="180px">
      </el-table-column>
      <el-table-column
      prop="lastUpdateTime"
      label="最后一次状态更新时间"
      width="180px">
    </el-table-column>
      <el-table-column
        prop="lastRenewalTime"
        label="最后一次续约时间"
        width="180px">
      </el-table-column>
      <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==='UP'" type="warning" @click="handleOut(scope.row)" size="small" >下线
          </el-button>
          <el-button v-if="scope.row.status==='OUT_OF_SERVICE'" type="success" size="small"  @click="handleUp(scope.row)">重新上线
          </el-button>
          <el-button  type="danger" size="small"  @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <br/>
    <h3>系统信息</h3>
    <el-table
      :data="systemInfo"
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column
        prop="name"
        label="属性名"
        width="800px">
      </el-table-column>
      <el-table-column
        prop="value"
        label="属性值"
       >
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import {getAllApp,deleteInstance,upInstance,outInstance} from "../../api/eureka";
  import {formatDate} from "../../utils/datatrans";

  export default {
      name: "eureka-ui",
      filters: {
      statusFilter(status) {
        const statusMap = {
          'UP': 'success',
          'DOWN': 'info',
          'OUT_OF_SERVICE': 'danger',
          'STARTING': 'primary',
          'UNKNOWN': 'warning'
        }
        return statusMap[status]
      }
     },
      created(){
        this.fetchAllApp()
      },
      data(){
        return {
          applist:[],
          instancelist:[],
          listloading:false,
          systemInfo:[
            {

              name:'总分配内存',
              value:'167MB'
            },
            {
              name:'已使用内存',
              value:'84MB(50%)'
            },
            {
              name:'CPU核数',
              value:'4'
            },
            {
              name:'已运行时间',
              value:'54天6小时15分'
            },
            {
              name:'每分钟最少续约数',
              value:'10'
            },
            {
              name:'最后一分钟的续约数量',
              value:'8'
            },
            {
              name:'是否启动租约过期',
              value:'否'
            }
          ]


        }
      },
    methods:{
        handleOut(row){
          outInstance(row.app,row.instanceId).then(response =>{
            if(response.status!=200){
              this.$message({
                type: 'error',
                message: '下线服务失败'
              })
            }else{
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            }
            this.fetchAllApp()
          })
        },
        handleUp(row){
          upInstance(row.app,row.instanceId).then(response =>{
            if(response.status!=200){
              this.$message({
                type: 'error',
                message: '上线服务失败'
              })
            }else{
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.fetchAllApp()
            }
          })
        },
        handleDelete(row){
          deleteInstance(row.app,row.instanceId).then(response =>{
            if(response.status!=200){
              this.$message({
                type: 'error',
                message: '删除服务失败'
              })
            }else{
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.fetchAllApp()
            }
          })
        },
        fetchAllApp(){
          this.listloading=true
          getAllApp().then(response => {
            var list=response.data.applications.application
            console.log(list)
            for(const v of list) {
              var app=new Object()
              app.name=v.name
              app.instanceNum=v.instance.length
              var temp = ''
              for(const i of v.instance){
                var instance = new Object()
                instance.instanceId = i.instanceId
                instance.status = i.status
                instance.lastUpdateTime = formatDate(new Date(JSON.parse(i.lastUpdatedTimestamp)),'yyyy-MM-dd hh:mm')
                instance.renewalIntervalInSecs = i.leaseInfo.renewalIntervalInSecs
                instance.durationInSecs = i.leaseInfo.durationInSecs
                instance.registrationTime = formatDate(new Date(JSON.parse(i.leaseInfo.registrationTimestamp)),'yyyy-MM-dd hh:mm')
                instance.lastRenewalTime = formatDate(new Date(JSON.parse(i.leaseInfo.lastRenewalTimestamp)),'yyyy-MM-dd hh:mm')
                instance.app = v.name
                temp += '('
                temp += i.status
                temp += ')-'
                temp += i.instanceId
                temp += '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'
                this.instancelist.push(instance)
              }
              app.instanceStatus=temp
              this.applist.push(app)
            }
          })
          this.listloading=false
        },
      handlestatus(status) {
        if (status === 'UP') return '正在运行'
        else if (status === 'STARTING') return '正在启动'
        else if(status === 'DOWN') return '错误'
        else if(status === 'OUT_OF_SERVICE') return '已下线'
        else return '未知'
      },

    }
    }

</script>

<style scoped>

</style>
