<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select placeholder="服务状态" v-model="listQuery.checked" clearable style="margin-left: 5px;width:120px" class="filter-item">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-cascader
        v-model="selectedOptions"
        @change="handleOptions"
        style="margin-left: 5px;width:220px;float: left"
        placeholder="选择服务类别 可以搜索"
        expand-trigger="hover"
        :clearable=true
        :show-all-levels="false"
        :options="options"
        filterable
        change-on-select
      ></el-cascader>
      <el-input placeholder="服务名称" v-model="listQuery.service_name" style="margin-left: 5px;width:250px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button type="primary" icon="el-icon-search" class="filter-item" style="margin-left: 5px;width: 90px;" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加新服务</el-button>
    </div>

    <el-table
      v-loading="listloading"
      :data="list"
      fit
      highlight-current-row
      style="width:100%"
      :default-sort="{prop:'id',order:'ascending'}"
      @sort-change="sortChange">
      <el-table-column
        prop="id"
        label="编号"
        sortable="custom"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="serviceName"
        label="服务名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="serviceCategory"
        label="服务类别"
        width="150">
      </el-table-column>
      <el-table-column
        prop="owner"
        label="服务提供者"
        width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="230">

      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="130">
        <template slot-scope="scope">
          <el-tag :type="scope.row.checked | statusFilter">{{ handlestatus(scope.row.checked)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="scope.row.checked==2" type="danger" size="small" @click="handleDelete(scope.row)">下架
          </el-button>
          <el-button v-if="scope.row.checked==0" type="warning" size="small" @click="handleCheck(scope.row)">审核通过
          </el-button>
          <el-button v-if="scope.row.checked==0" type="warning" size="small" @click="handleUnCheck(scope.row)">审核不通过
          </el-button>
          <el-button v-if="scope.row.checked===1||scope.row.checked===3" type="success " size="small" @click="handleSale(scope.row)" >上架
          </el-button>
          <el-button  type="info" size="small" @click="apiManage(scope.row.id,scope.row.serviceName)">API管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchService" />


    <el-dialog :title="dialogStatus":visible.sync="dialogFormVisible" @close='closeDialog'>
      <el-form ref="dataForm"  :model="this.Temp" :rules="rules" :is-file="true" autocomplete="new" label-position="left" label-width="80px" style="width:600px;margin-left: 50px;">
        <el-form-item label="服务名称" prop="serviceName">
          <el-input   type ="text"   v-model="Temp.serviceName" style="width: 300px" ></el-input>
        </el-form-item>
        <el-form-item label="服务类别" prop="categoryId">
          <el-cascader
            v-model="selectedOptions1"
            @change="handleOptions1"
            style="margin-left: 5px;width:220px;float: left"
            placeholder="选择服务类别 可以搜索"
            expand-trigger="hover"
            :clearable=true
            :show-all-levels="false"
            :options="options"
            filterable
            change-on-select
          ></el-cascader>
        </el-form-item>
        <!--<el-form-item label="服务图片" style="width: 500px" >-->
          <!--<div prop="serviceImg" >-->
            <!--<el-button  @click="uploadFile" icon='el-icon-plus' style="height:100px;width: 100px" v-show="imageShow==false">-->
              <!--<input type="file" class ="upload-file"   style="display: none" ref="inputImg" @change="doUpload"/>-->
            <!--</el-button>-->
            <!--<div class="imagePreview" v-show="imageShow">-->
              <!--<img :src="Temp.serviceImg" @click="$refs.inputImg.click()">-->
            <!--</div>-->

          <!--</div>-->
          <!--<div><h7>只能上传单张10M以下的 PNG、JPG、GIF 格式的图片</h7></div>-->
        <!--</el-form-item>-->
        <el-form-item label="服务图片">
          <el-upload
            class="avatar-uploader"
            action="/abs/serviceManage/insertImg"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.Temp.serviceImg" :src="this.Temp.serviceImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div v-if="dialogStatus==='添加服务'">
            <span  v-if="this.Temp.serviceImg">已选择{{this.imageName}},可点击图片更改</span>
            <span  v-else >只能上传单张10M以下的 PNG、JPG、GIFJPEG格式的图片</span>
          </div>
          <div v-else>
            <span  v-if="this.Temp.serviceImg">可点击图片更改</span>
            <span  v-else >只能上传单张10M以下的 PNG、JPG、GIFJPEG格式的图片</span>
          </div>
          </el-form-item>

        <el-form-item label="单价" prop="price">
          <!--<el-input   type ="text"  placeholder="计量单位是元" v-model="Temp.price" style="width: 300px"></el-input>-->
          <template>
            <el-input-number placeholder="单位是元" v-model="Temp.price" :precision="2" :step="0.1" :max="10"></el-input-number>
          </template>
        </el-form-item>
        <!--<el-form-item label="购买规格" prop="format">-->
        <!--</el-form-item>-->
        <el-form-item label="简单介绍" prop="introduction" >
          <el-input   type ="textarea"  placeholder="对服务的简单介绍" v-model="Temp.introduction" ></el-input>
        </el-form-item>
        <el-form-item label="详细介绍" prop="detailIntroduction">
          <el-input   type ="textarea"  :autosize="{minRows:5}" placeholder="对服务的详细介绍" v-model="Temp.detailIntroduction" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取消</el-button>
        <!--<el-button type="primary" @click="dialogStatus==='添加管理员'?createData():updateData()">确认</el-button>-->
         <el-button type="primary" @click="dialogStatus==='添加服务'?createData():updateData()">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination';
  import {ListSeviceCategory1} from '../../api/serviceCategory'
  import {fetchServicelist,createService,updateChecked,unChecked,getInfo,updateService} from '../../api/service'

    export default {
      name: "onlineServiceManage",
      components:{Pagination},
      filters: {
        statusFilter(status) {
          const statusMap = {
            1: 'success',
            0: 'info',
            2: 'danger',
            3: 'primary',
            4: 'warning'
          }
          return statusMap[status]
        }
      },
      created(){
        this.fetchServiceCategories()
        this.fetchService()
      },
      data(){
        return {
          total:0,
          list:null,
          listloading:false,
          dialogStatus:'',
          dialogFormVisible:false,
          options:[],
          listQuery:{
            page:1,
            limit:20,
            type:1,
            service_name:null,
            checked:'',
            category_id:'',
            sort: '+id'
          },
          selectedOptions: [],
          selectedOptions1: [],
          imageName:'',
          category:'',
          Temp:{
            id:undefined,
            serviceName:'',
            categoryId:'',
            serviceImg:'',
            price:'',
            introduction:'',
            format:'',
            detailIntroduction:'',
            is_other:1

          },
          rules: {
            serviceName: [  {
              required: true,
              message: '请输入服务名',
              trigger: 'blur'
            }],
          },
          statusOptions: [{
            value: '0',
            label: '待审核'
          },{
            value: '1',
            label: '待上架'
          }, {
            value: '2',
            label: '出售中'
          }, {
            value: '3',
            label: '已下架'
          }, {
            value: '4',
            label: '审核未通过'
          }],
        }
      },
      methods:{
        closeDialog(){
          this.resetTemp()
        },
        apiManage(id,name) {
          this.$router.push({
            path:'/api/'+id+'/'+name,
          })
        },
        handleOptions(value) {
          this.listQuery.category_id = value[value.length-1]
        },
        handleOptions1(value) {
          this.Temp.categoryId = value[value.length-1]
          console.log("selected是"+this.selectedOptions1+"type:"+this.selectedOptions1.type)
          this.Temp.format = value.toString()
        },
        handleFilter() {
          this.listQuery.page = 1
          this.fetchService()
        },
        handleCreate() {
          this.dialogFormVisible = true
          this.dialogStatus = '添加服务'
        },
        handleUpdate(row){
          this.Temp.id = row.id
          getInfo(row.id).then(response => {
            this.Temp=response.data
            if(this.Temp.format) {
               var se =this.Temp.format.split(',')
              this.selectedOptions1=se.map(Number)
            }
            this.dialogFormVisible = true
            this.dialogStatus = '修改服务'
          })
        },
        handleDelete(row){
          updateChecked(row.id,3).then(response =>{
            if(response.status!=10000){
              this.$message({
                type: 'error',
                message: '下架服务失败'
              })
            }else{
              row.checked = 3;
              this.$message({
                type: 'success',
                message: '下架服务成功'
              })
            }
          })
        },
        handleCheck(row){
          updateChecked(row.id,1).then(response =>{
            if(response.status!=10000){
              this.$message({
                type: 'error',
                message: '审核服务失败'
              })
            }else{
              row.checked = 1;
              this.$message({
                type: 'success',
                message: '审核服务成功'
              })
            }
          })
        },
        handleUnCheck(row){
          this.$prompt('请输入审核不通过的理由', '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /\S/,
              inputErrorMessage: '理由不能为空'
            }
          ).then(({value}) => {
            unChecked(row.id, value).then(response => {
              if (response.status != 10000) {
                this.$message({
                  type: 'error',
                  message: '审核服务失败'
                })
              } else {
                row.checked = 1;
                this.$message({
                  type: 'success',
                  message: '审核服务成功'
                })
              }
            })
          })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              });
            });

        },
        handleSale(row){
          updateChecked(row.id,2).then(response =>{
            if(response.status!=10000){
              this.$message({
                type: 'error',
                message: '上架服务失败'
              })
            }else{
              row.checked = 2;
              this.$message({
                type: 'success',
                message: '上架服务成功'
              })
            }
          })
        },
        sortChange(data) {
          const {prop,order} =data
          if(prop === 'id'){
            this.sortById(order)
          }
        },
        beforeAvatarUpload(file) {
          const filetype = file.type ;
          var isAllow = true;
          const isLt10M = file.size / 1024 / 1024 < 10;

          if (filetype!=='image/png'&&filetype!=='image/jpg'&&filetype!=='image/gif'&&filetype!=='image/jpeg') {
            isAllow = false;
            this.$message.error('上传图片只能是 png、jpg、jpeg、gif 格式!');
          }
          if (!isLt10M) {
            this.$message.error('上传图片大小不能超过 10MB!');
          }
          return isAllow && isLt10M;
        },
        handleAvatarSuccess(res, file) {
          console.log('图片上传的res是'+res.data)
          if(res.status!=10000){
            this.$message({
              type: 'error',
              message: '上传失败'
            })
          }else{
            this.imageName = file.name
            this.Temp.serviceImg = res.data
          }
        },
        resetQuery(){
          this.listQuery.page = 1
          this.listQuery.service_name=null
          this.listQuery.category_id=''
          this.listQuery.checked=''
          this.listQuery.sort='+id'
        },
        sortById(order) {
          if(order === 'ascending'){
            this.listQuery.sort = '+id'
          }else{
            this.listQuery.sort = '-id'
          }
          this.handleFilter()
        },
        handlestatus(checked) {
          if (checked === 0) return '待审核'
          else if (checked === 1) return '待上架'
          else if (checked === 2) return '出售中'
          else if (checked === 4) return '审核未通过'
          else return '已下架'
        },
        handleCancel(){
          this.resetTemp()
          this.dialogFormVisible = false

        },
        resetTemp(){
            this.Temp.serviceName='',
            this.Temp.categoryId='',
            this.Temp.serviceImg='',
            this.Temp.price='',
            this.Temp.introduction='',
            this.Temp.detailIntroduction='',
            this.Temp.format='',
            this.Temp.id=undefined
            this.selectedOptions1=[]
        },
        fetchServiceCategories(){
          ListSeviceCategory1().then((response) => {
           // console.log("response中option的类型"+response.data.type)
            this.options =response.data
           // console.log("option的类型"+this.options.type)
          })
        },
        fetchService(){
          this.listloading=true
          fetchServicelist(this.listQuery).then(response => {
            this.list = response.data.list
            this.total = response.data.total
            this.listloading = false
          })
        },
        updateData(){
          this.$refs['dataForm'].validate((valid) => {
            if(valid) {
              updateService(this.Temp).then(response=> {
                this.dialogFormVisible = false
                this.resetTemp()
                if(response.status!=10000){
                  this.$message({
                    type: 'error',
                    message: '修改服务失败'
                  })
                }else{
                  //this.resetQuery()
                  this.fetchService()
                  this.$message({
                    type: 'success',
                    message: '修改成功'
                  })
                }
              })
            }
          })
        },
        createData() {
          this.$refs['dataForm'].validate((valid) => {
            if(valid) {
              createService(this.Temp).then(response => {
                this.dialogFormVisible = false
                this.resetTemp()
                if(response.status!=10000){
                  this.$message({
                    type: 'error',
                    message: '添加服务失败'
                  })
                }else{
                 // this.resetQuery()
                  this.fetchService()
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  })
                }
              })
            }
          })
        },
      }


    }
</script>

<style >
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
