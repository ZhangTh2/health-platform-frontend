<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="用户名" v-model="listQuery.username" style="margin-left: 5px;width:200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="姓名" v-model="listQuery.name" style="margin-left: 5px;width:200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select placeholder="状态" v-model="listQuery.checked" clearable style="margin-left: 5px;width:90px" class="filter-item" >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" class="filter-item" style="margin-left: 5px;width: 90px;" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>

    </div>
    <el-table
      v-loading="listloading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width:67%"
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
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.checked | statusFilter">{{ handlestatus(scope.row.checked)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="225" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button v-if="scope.row.checked==1" type="danger" size="mini" @click="handleDelete(scope.row)">离职
          </el-button>
          <el-button v-if="scope.row.checked==0" type="success" size="mini" @click="handleCheck(scope.row)">通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchDataByCondition" />

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="Temp" autocomplete="new" label-position="left" label-width="80px" style="width:400px;margin-left: 50px;">
        <el-form-item label="用户名" prop="username">
          <el-input type="text"   style="display: none"/>
          <el-input  :disabled="dialogStatus==='编辑管理员'?true:false" type ="text"  placeholder="5-12个字母/汉字/数字/下划线组成" v-model="Temp.username" autocomplete="new"></el-input>
        </el-form-item>
        <el-form-item  label="密码" prop="password">
          <el-input type="password" style="display: none"/>
          <el-input placeholder="5-12位字母/数字/下划线组成" v-model="Temp.password" type="text" autocomplete="new"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" style="display: none"/>
          <el-input placeholder="再次输入密码" v-model="Temp.password2" type="text"  autocomplete="new"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="Temp.name"></el-input>
        </el-form-item>
        <el-form-item label="邮件" prop="email">
          <el-input v-model="Temp.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="Temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="银行类型" prop="bankType">
          <el-select placeholder="选择银行" v-model="Temp.bankType"  >
            <el-option
              v-for="item in bankOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡号" prop="accountNumber">
          <el-input v-model="Temp.accountNumber"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" :autosize="{minRows:4}" v-model="Temp.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <!--<el-button type="primary" @click="dialogStatus==='添加管理员'?createData():updateData()">确认</el-button>-->
         <el-button type="primary" @click="dialogStatus==='添加管理员'?createData():updateData()">确认</el-button>
      </span>


    </el-dialog>
    <!--<div class="block">-->
    <!--<span class="demonstration">完整功能</span>-->
    <!--<el-pagination-->
    <!--@size-change="handleSizeChange"-->
    <!--@current-change="handleCurrentChange"-->
    <!--:current-page="currentPage4"-->
    <!--:page-sizes="[100, 200, 300, 400]"-->
    <!--:page-size="100"-->
    <!--layout="total, sizes, prev, pager, next, jumper"-->
    <!--:total="400">-->
    <!--</el-pagination>-->
    <!--</div>-->

  </div>


</template>

<script>
  import Pagination from '@/components/Pagination';
  import {fetchAdminlist} from '@/api/admin';
  import {searchAdmin} from '@/api/admin';
  import {deleteAdmin} from "@/api/admin";
  import {getAdminById} from "@/api/admin";
  import {checkAdmin,ifexistAdmin,createAdmin,updateAdmin,getTotal} from "@/api/admin";

  export default {
    name:"AdminListTable",
    components:{Pagination},
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: 'success',
          0: 'info',
          2: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      var validateName = (rule, value, callback) => {
        var pattern = /^[\w\u4e00-\u9fa5]{5,12}$/g
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(!pattern.test(value)){
          callback(new Error('5-12个字母/汉字/数字/下划线组成'))
        } else {
          if(this.dialogStatus==='添加管理员') {
            ifexistAdmin(value).then(response => {
              console.log(response.data)
              if (response.data == 1)
                callback(new Error('该用户名已经被注册'))
              else callback();
            })
          }else{
            callback();
          }
        }
      };
      var validatePass = (rule, value, callback) => {
        var pattern = /^[\w\u4e00-\u9fa5]{5,12}$/g
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(!pattern.test(value)){
          callback(new Error('5-12个字母/数字/下划线组成'))
        }
        else {
          if (this.Temp.password2 !== '') {
            this.$refs['dataForm'].validateField('password2');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        var pattern = /^[\w\u4e00-\u9fa5]{5,12}$/g
        if (value === '') {
          callback(new Error('请再次输入密码'));
        }else if(!pattern.test(value)){
          callback(new Error('5-12个字母/数字/下划线组成'))
        }
        else if (this.Temp.password2 !== this.Temp.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validatePhone = (rule,value,callback) => {
        var pattern =/^1(3|4|5|7|8)\d{9}$/
        if(value !== ''&& !pattern.test(value)) {
          callback(new Error('请输入正确格式的手机号码'))
        }else{
          callback();
        }
      };
      var validateEmail = (rule,value,callback) => {
        var pattern = /(\S)+[@]{1}(\S)+[.]{1}(\w)+/
        if(value !== ''&& !pattern.test(value)) {
          callback(new Error('请输入正确格式的邮箱'))
        }else{
          callback();
        }

      };
      var validateAccount =(rule,value,callback) => {
        console.log('bankaccount是'+value)
        var pattern = /^([1-9]{1})(\d{15}|\d{18})$/
        if(value!=='') {
          if(this.Temp.bankType===''){
            callback(new Error("请先选择银行类型"))
          }
          else if(!pattern.test(value)){
            callback(new Error('请输入正确格式的银行卡号'))
          }
        }
        else{
          callback();
        }
      };
      return {
        total: 0,
        list: null,
        listloading: true,
        listQuery: {
          page: 1,
          limit: 20,
          role_id: 3,
          username: null,
          name: null,
          checked: '',
          sort: '+id'
        },
        //详细信息
        Temp: {
          id:undefined,
          roleId: 3,
          remarks: '',
          username: '',
          password: '',
          password2: '',
          checked: 1,
          phone: '',
          email: '',
          bankType: '',
          accountNumber: '',
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          username: [{validator: validateName, trigger: 'blur'}, {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{validator: validatePass, trigger: 'blur'}, {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          password2: [{validator: validatePass2, trigger: 'blur'}, {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          }],
          phone:[{validator:validatePhone,trigger:'blur'}],
          email:[{validator:validateEmail,trigger:'blur'}],
          accountNumber:[{validator:validateAccount,trigger:'blur'}],
        },
        bankOptions: [{
          value: '0',
          label: '中国银行'
        }, {
          value: '1',
          label: '农业银行'
        }, {
          value: '2',
          label: '工商银行'
        }, {
          value: '3',
          label: '建设银行'
        }],
        statusOptions: [{
          value: '0',
          label: '待审核'
        }, {
          value: '1',
          label: '在职'
        }, {
          value: '2',
          label: '离职'
        }],
      }
    },
    created() {
      // this.fetchData()
      this.fetchDataByCondition()
    },
    methods: {
      handleFilter() {
        this.listQuery.page = 1
        this.fetchDataByCondition()
      },
      fetchData() {
        this.listloading = true
        fetchAdminlist('business').then(response => {
          this.list = response.data.list
          this.listloading = false
        })
      },
      sortChange(data) {
        const {prop,order} =data
        if(prop === 'id'){
          this.sortById(order)
        }
      },
      sortById(order) {
        if(order === 'ascending'){
          this.listQuery.sort = '+id'
        }else{
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      fetchDataByCondition() {
        this.listloading = true
        searchAdmin(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listloading = false
        })
      },
      handlestatus(checked) {
        if (checked === 0) return '待审核'
        else if (checked === 1) return '在职'
        else return '离职'
      },
      handleUpdate(id) {
        getAdminById(id).then(response => {
          this.Temp = Object.assign({},response.data)
          this.Temp.password2=this.Temp.password
          this.dialogStatus = '编辑管理员'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            updateAdmin(this.Temp).then(()=> {
              for(const v of this.list) {
                if(v.id === this.Temp.id) {
                  const index =this.list.indexOf(v)
                  this.list.splice(index,1,this.Temp)
                }
              }
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            })
          }
        })
      },
      resetTemp() {
        this.Temp={
          id:undefined,
          roleId:2,
          remarks:'',
          username:'',
          password:'',
          password2:'',
          checked:1,
          phone:'',
          email:'',
          bankType:'',
          accountNumber:'',
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = '添加管理员'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            createAdmin(this.Temp).then(()=> {
              getTotal().then((response)=> {
                this.Temp.id=response.data
              })
              this.list.unshift(this.Temp)
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            })
          }
        })
      },


      handleDelete(row) {
        this.$confirm('是否将' + row.name + '离职？', '提示', {
          confirmButtonText: '确定',
          cancelButtonClass: '取消',
          type: "warning"
        }).then(() => {
          deleteAdmin(row.id).then(response => {
            if (response.data === 1) {
              // this.$notify({
              //   title: '成功',
              //   messege: '操作成功',
              //   type: 'success',
              //   duration: 2000,
              //   position: 'top-left',
              // })
              row.checked = 2
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: '操作失败'
              })
              // this.$notify({
              //   title: '操作失败',
              //   messege: '操作失败了',
              //   type: 'error',
              //   duration: 2000,
              //   position: 'top-left',
              // })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      handleCheck(row) {
        this.$confirm('是否通过' + row.name + '的申请？', '提示', {
          confirmButtonText: '确定',
          cancelButtonClass: '取消',
          type: "warning"
        }).then(() => {
          checkAdmin(row.id).then(respose => {
            if (respose.data === 1) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              // this.$notify({
              //   title: '成功',
              //   messege: '操作成功',
              //   type: 'success',
              //   duration: 2000,
              //   position: 'top-left',
              // })
              row.checked = 1
            } else {
              // this.$notify({
              //   title: '操作失败',
              //   messege: '操作失败了',
              //   type: 'error',
              //   duration: 2000,
              //   position: 'top-left',
              // })
              this.$message({
                type: 'error',
                message: '操作失败'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
