<template>
  <div class="app-container">
    <h1>{{this.name}}API列表</h1>
    <el-table
      v-loading="listloading"
      :data="apilist"
      fit
      :stripe="true"
      highlight-current-row
      style="width:100%">
      <el-table-column
        prop="name"
        label="API名称"
        width="250">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        width="230">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="最近修改时间"
        width="230">

      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="200">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ handlestatus(scope.row.status)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="scope.row.status === 0||scope.row.status === 2" type="success" size="small" @click="handleOnSell(scope.row)">上架
          </el-button>
          <el-button v-if="scope.row.status===1" type="warning" size="small" @click="handleDown(scope.row)">下架
          </el-button>
          <el-button v-if="scope.row.status!==1" type="danger" size="small" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 20px">
      <el-button   type="primary" icon="el-icon-edit" @click="handleCreate">添加新API</el-button>
    </div>

    <el-dialog :title="dialogStatus":visible.sync="dialogFormVisible" @close='closeDialog' :fullscreen="false" width="70%">
      <el-form ref="dataForm"  :model="Temp"   autocomplete="new" label-position="right" label-width="150px"  style="width:100%;margin-left: 20px;">
        <el-row>
        <el-col :span="12">
          <el-form-item label="API名称" prop="name" :required="true">
            <el-input   type ="text"   v-model="Temp.name" style="width: 300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APIKEY" prop="appKey">
            <el-input   type ="text"   v-model="Temp.appKey"  style="width: 300px"></el-input>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Address"  prop="address" :required="true">
              <el-input   type ="text"  placeholder="Host : Port" v-model="Temp.address" style="width: 300px" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="path" prop="path" :required="true">
              <el-input   type ="text"   v-model="Temp.path" style="width: 300px" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="请求协议" prop="httpProtocal" :required="true">
              <template>
                <el-radio v-model="Temp.httpProtocal" :label="1">HTTP</el-radio>
                <el-radio v-model="Temp.httpProtocal" :label="2">HTTPS</el-radio>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="HTTP methods" prop="httpMethod" :required="true">
              <template>
                <el-radio v-model="Temp.httpMethod" :label="1">GET</el-radio>
                <el-radio v-model="Temp.httpMethod" :label="2">POST</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Headers">
            <el-form-item v-for="(header,index) in Headers">
              <el-form :inline="true" :model="header">
                <el-form-item >
                  <el-input v-model="header.name" placeholder="参数名称" style="width: 400px;margin-top: 5px">
                  <template slot="prepend">Name{{index}}</template></el-input>
                </el-form-item>
                <el-form-item >
                  <el-input v-model="header.value" placeholder="参数值"style="width: 400px;margin-top: 5px" >
                    <template slot="prepend">Value{{index}}</template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="removeHeader(header)">删除</el-button>
                </el-form-item>
              </el-form>
            </el-form-item>
            <el-button type="primary" size="medium" @click="addHeader">添加</el-button>
          <el-button v-show="Headers.length" type="primary" size="medium" @click="resetHeaders">清空</el-button>
        </el-form-item>

        <el-form-item label="Request Parameters">
          <el-form-item v-for="(param,index) in Params">
            <el-form :inline="true" :model="param">
              <el-form-item >
                <el-input v-model="param.name" placeholder="参数名称" style="width: 400px;margin-top: 5px">
                  <template slot="prepend">Name{{index}}</template></el-input>
              </el-form-item>
              <el-form-item >
                <el-input v-model="param.value" placeholder="对参数的说明"style="width: 400px;margin-top: 5px" >
                  <template slot="prepend">Explain</template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="removeParam(param)">删除</el-button>
              </el-form-item>
            </el-form>
          </el-form-item>
          <el-button type="primary" size="medium" @click="addParam">添加</el-button>
          <el-button v-show="Params.length" type="primary" size="medium" @click="resetParams">清空</el-button>
        </el-form-item>
        <el-form-item label="Request Body">
            <el-select v-model="bodyType" clearable @clear="clearSelect" placeholder="请选择Request Body的类型" style="width: 250px">
              <el-option
                v-for="item in bodyTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input v-show="bodyType!=='0'&&bodyType!=''" type="text" placeholder="对Request Body的描述" v-model="bodyContent" style="margin-top:10px;width: 800px"></el-input>
        </el-form-item>
        <el-form-item label="Api描述" prop="description" >
          <el-input    type="textarea" autosize  v-model="Temp.description" style="width: 800px" ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="每日允许请求次数" prop="callLimit">
              <template>
                <el-input-number v-model="Temp.callLimit" :min="0" :step="20"></el-input-number>
                <span>0是无限制</span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP每日允许请求次数" prop="callIpLimit">
              <el-input-number v-model="Temp.callIpLimit" :min="0" :step="20"></el-input-number>
              <span>0是无限制</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="返回参数">
          <el-form-item v-for="(result,index) in resultArguments">
            <el-form :inline="true" :model="result">
              <el-form-item >
                <el-input v-model="result.name" placeholder="返回参数名称" style="width: 400px;margin-top: 5px">
                  <template slot="prepend">Name{{index}}</template></el-input>
              </el-form-item>
              <el-form-item >
                <el-input v-model="result.value" placeholder="对参数的说明"style="width: 400px;margin-top: 5px" >
                  <template slot="prepend">Explain</template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="removeResult(result)">删除</el-button>
              </el-form-item>
            </el-form>
          </el-form-item>
          <el-button type="primary" size="medium" @click="addResult">添加</el-button>
          <el-button v-show="resultArguments.length" type="primary" size="medium" @click="resetResults">清空</el-button>
        </el-form-item>
        <el-form-item label="错误码" prop="errorCode">
          <el-form-item v-for="(errorcode,index) in errorCodes">
            <el-form :inline="true" :model="errorcode">
              <el-form-item >
                <el-input-number v-model="errorcode.value" :controls="false" :min="0" style="margin-top: 5px">
                  <template slot="prepend">ErrorCode{{index}}</template>
                </el-input-number>
              </el-form-item>
              <el-form-item >
                <el-input v-model="errorcode.explain" placeholder="对返回码的说明"style="width: 400px;margin-top: 5px" >
                  <template slot="prepend">Explain</template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="removeErrorCode(errorcode)">删除</el-button>
              </el-form-item>
            </el-form>
          </el-form-item>
          <el-button type="primary" size="medium" @click="addErrorCode">添加</el-button>
          <el-button v-show="errorCodes.length" type="primary" size="medium" @click="resetErrorCodes">清空</el-button>
        </el-form-item>
        <el-form-item label="请求示例" prop="callExample">
          <el-input   type="textarea" autosize   v-model="Temp.callExample" style="width: 800px" ></el-input>
        </el-form-item>
        <el-form-item label="返回示例" prop="resultExample">
          <el-input   type="textarea" autosize   v-model="Temp.resultExample" style="width: 800px" ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input   type="textarea" autosize   v-model="Temp.remarks" style="width: 800px" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取消</el-button>
        <!--<el-button type="primary" @click="dialogStatus==='添加管理员'?createData():updateData()">确认</el-button>-->
         <el-button type="primary" @click="dialogStatus==='添加Api'?createData():updateData()">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {listApi,insertApi,updateApi,getInfo,updateStatus} from "../../api/api";

  export default {
      name: "apiList",
      filters: {
        statusFilter(status) {
          const statusMap = {
            1: 'success', //正常运行
            0: 'info', //未上架
            2: 'warning',//已下架
            3: 'danger', //错误
          }
          return statusMap[status]
        }
      },
      created(){
        console.log("进入api界面")
        this.getParams()
        this.fetchApilist()
      },
      data(){
        return{
          id:'',
          name:'',
          apilist:'',
          listloading:false,
          dialogStatus:'',
          Headers:[
          ],
          Params:[
          ],
          resultArguments:[
          ],
          errorCodes:[
          ],
          bodyType:'',
          bodyContent:'',
          bodyTypes:[{
            value:'0',
            label:'Empty'
          },{
            value:'1',
            label:'Text'
          },
            {
              value:'2',
              label:'File contents'
            },
            {
              value:'3',
              label:'File upload(multipart/form-data)'
            }
          ],
          dialogFormVisible:false,
          Temp:{
            //Class:Api
            //展示数据
            name:'',
            appKey:'',
            address:'',
            path:'',
            httpMethod:'',
            httpProtocal:'',
            headers:'',
            params:'',
            body:'',
            description:'',
            callLimit:'',
            callIpLimit:'',
            resultArguments:'',
            errorCode:'',
            resultExample:'',
            callExample:'',
            remarks:'',
            //操作数据
            id:undefined,
            status:'',
            serviceId:'',

          }
        }
      },
      methods:{
        updateData(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.objectDataToJson()
              updateApi(this.Temp).then(response => {
                if (response.status != 10000) {
                  this.$message({
                    type: 'error',
                    message: '更新Api失败'
                  })
                } else {
                  this.fetchApilist()
                  this.$message({
                    type: 'success',
                    message: '更新Api成功'
                  })
                  this.resetTemp()
                }
              })

              this.dialogFormVisible = false
            }
          })
        },
        handleUpdate(row){
          getInfo(row.id).then(response => {
            this.Temp = response.data
            this.jsonToObject()
            this.dialogStatus='修改'+row.name+'Api'
            this.dialogFormVisible=true
          })
        },
        handleCreate(){
          this.dialogStatus='添加Api'
          this.dialogFormVisible=true
        },
        jsonToObject(){
          if(this.Temp.headers != null)
          this.Headers=JSON.parse(this.Temp.headers)
          if(this.Temp.params != null)
          this.Params=JSON.parse(this.Temp.params)
          if(this.Temp.errorCode != null)
          this.errorCodes=JSON.parse(this.Temp.errorCode)
          if(this.Temp.resultArguments)
          this.resultArguments=JSON.parse(this.Temp.resultArguments)

          //body这一块是有问题的
          if(this.Temp.body != null) {
            console.log('body是'+this.Temp.body)
            var index = this.Temp.body.indexOf(':')
            console.log("index是"+index)
            this.bodyType = this.Temp.body.substring(0, index)
            console.log("bodyType是"+this.bodyType)
            this.bodyContent = this.Temp.body.substring(index+1, this.Temp.body.length)
            console.log("bodyContent是"+this.bodyContent)
          }

        },
        createData(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.objectDataToJson()
              this.Temp.status=0
              insertApi(this.Temp).then(response => {
                if (response.status != 10000) {
                  this.$message({
                    type: 'error',
                    message: '新增Api失败'
                  })
                } else {
                  this.fetchApilist()
                  this.$message({
                    type: 'success',
                    message: '新增Api成功'
                  })
                  this.resetTemp()
                }
              })

              this.dialogFormVisible = false
            }
          })
        },
        objectDataToJson(){
          this.Temp.headers=JSON.stringify(this.Headers);
          this.Temp.params=JSON.stringify(this.Params);
          this.Temp.body=this.bodyType+':'+this.bodyContent;
          this.Temp.errorCode=JSON.stringify(this.errorCodes)
          this.Temp.resultArguments=JSON.stringify(this.resultArguments)
        },
        resetErrorCodes(){
          this.errorCodes = []
        },
        addErrorCode(){
          this.errorCodes.push({
            value:'',
            explain:''
          })
        },
        removeErrorCode(item){
          var index = this.errorCodes.indexOf(item)
          if(index !== -1){
            this.errorCodes.splice(index,1)
          }
        },
        resetResults(){
          this.resultArguments = []
        },
        addResult(){
          this.resultArguments.push({
            name:'',
            value:''
          })
        },
        removeResult(item){
          var index = this.resultArguments.indexOf(item)
          if(index !== -1){
            this.resultArguments.splice(index,1)
          }
        },
        clearSelect(){
          this.bodyType=''
        },
        resetParams(){
          this.Params = []
        },
        addParam(){
          this.Params.push({
            name:'',
            value:''
          })
        },
        removeParam(item){
          var index = this.Params.indexOf(item)
          if(index !== -1){
            this.Params.splice(index,1)
          }
        },
        resetHeaders(){
          this.Headers = []
        },
        addHeader(){
          this.Headers.push({
            name:'',
            value:''
          })
        },
        removeHeader(item){
          var index = this.Headers.indexOf(item)
          if(index !== -1){
            this.Headers.splice(index,1)
          }
        },
        handleCancel(){
          this.resetTemp()
          this.dialogFormVisible = false
        },
        closeDialog(){
          this.resetTemp()
        },
        resetTemp(){
            this.Temp.name='',
            this.Temp.appKey='',
            this.Temp.address='',
            this.Temp.path='',
            this.Temp.httpMethod='',
            this.Temp.httpProtocal='',
            this.Temp.headers='',
            this.Temp.params='',
            this.Temp.body='',
            this.Temp.description='',
            this.Temp.callLimit='',
            this.Temp.callIpLimit='',
            this.Temp.resultArguments='',
            this.Temp.errorCode='',
            this.Temp.resultExample='',
            this.Temp.callExmaple='',
            this.Temp.id=undefined,
            this.Temp.status='',
            this.Temp.remarks='',
            this.Headers=[],
            this.Params=[],
            this.resultArguments=[],
            this.errorCodes=[],
            this.bodyType='',
            this.bodyContent=''
        },
        fetchApilist(){
          this.listloading = true
          listApi(this.id).then(response => {
          this.apilist=response.data
          this.listloading=false
          })
        },
        //获取服务的id和name
        getParams(){
          this.id=this.$route.params.id
          this.name=this.$route.params.name
          this.Temp.serviceId=this.id
        },
        handlestatus(checked) {
          if (checked === 0) return '未上架'
          else if (checked === 1) return '正常运行中'
          else if (checked === 2) return '已下架'
          else  return '运行错误'
        },
        handleDelete(row){
          updateStatus(row.id,4).then(response => {
            if(response.status!=10000){
              this.$message({
                type: 'error',
                message: '删除Api失败'
              })
            }else{
              row.status = 4
              for(const v of this.apilist) {
                if(v.id === row.id) {
                  const index =this.apilist.indexOf(v)
                  this.apilist.splice(index,1)
                }
              }
              this.$message({
                type: 'success',
                message: '删除Api成功'
              })
            }
          })
        },
        handleOnSell(row){
          updateStatus(row.id,1).then(response => {
            if(response.status!=10000){
              this.$message({
                type: 'error',
                message: '上架Api失败'
              })
            }else{
              row.status =1
              this.$message({
                type: 'success',
                message: '下架Api成功'
              })
            }
          })
        },
        handleDown(row){
          updateStatus(row.id,2).then(response => {
            if(response.status!=10000){
              this.$message({
                type: 'error',
                message: '下架Api失败'
              })
            }else{
              row.status =2
              this.$message({
                type: 'success',
                message: '下架Api成功'
              })
            }
          })
        }
      },
      watch:{
        '$route': 'getParams'
      }
    }
</script>

<style scoped>

</style>
