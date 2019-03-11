<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--<error-log class="errLog-container right-menu-item"/>-->

        <el-tooltip content="全屏" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>

        <!--<lang-select class="international right-menu-item"/>-->

        <el-tooltip content="换肤" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="hover">
        <div class="avatar-wrapper">
          <!--<img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <img src="@/assets/ava.png" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <!--<router-link to="/pesonalCenter">-->
            <!--<el-dropdown-item>-->
              <!--个人中心-->
            <!--</el-dropdown-item>-->
          <!--</router-link>-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="handleUpdateSelf">修改个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dialog title="修改个人信息" :visible.sync="dialogFormVisible1">
        <el-form ref="dataForm" :rules="rules" :model="selfTemp" autocomplete="new" label-position="left" label-width="80px" style="width:400px;margin-left: 50px;">
          <el-form-item label="用户名" prop="username">
            <el-input type="text"   style="display: none"/>
            <el-input  :disabled="true" type ="text"  placeholder="5-12个字母/汉字/数字/下划线组成" v-model="selfTemp.username" autocomplete="new"></el-input>
          </el-form-item>
          <el-form-item  label="密码" prop="password">
            <el-input type="password" style="display: none"/>
            <el-input placeholder="5-12位字母/数字/下划线组成" v-model="selfTemp.password" type="text" autocomplete="new"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input type="password" style="display: none"/>
            <el-input placeholder="再次输入密码" v-model="selfTemp.password2" type="text"  autocomplete="new"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="selfTemp.name"></el-input>
          </el-form-item>
          <el-form-item label="邮件" prop="email">
            <el-input v-model="selfTemp.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="selfTemp.phone"></el-input>
          </el-form-item>
          <el-form-item label="银行类型" prop="bankType">
            <el-select placeholder="选择银行" v-model="selfTemp.bankType"  >
              <el-option
                v-for="item in bankOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行卡号" prop="accountNumber">
            <el-input v-model="selfTemp.accountNumber"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
          <!--<el-button type="primary" @click="dialogStatus==='添加管理员'?createData():updateData()">确认</el-button>-->
         <el-button type="primary" @click="update()">确认</el-button>
      </span>
      </el-dialog>

    </div>

  </div>



</template>

uj

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
//import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import {getSelf,updateAdmin} from  '@/api/admin'
import { getToken } from '@/utils/auth' // 验权
export default {
  components: {
    Breadcrumb,
    Hamburger,
    //ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  data() {
    var validatePass = (rule, value, callback) => {
      var pattern = /^[\w\u4e00-\u9fa5]{5,12}$/g
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if(!pattern.test(value)){
        callback(new Error('5-12个字母/数字/下划线组成'))
      }
      else {
        if (this.selfTemp.password2 !== '') {
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
      else if (this.selfTemp.password2 !== this.selfTemp.password) {
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
      //详细信息
      selfTemp: {
        id:undefined,
        roleId: undefined,
        username: '',
        password: '',
        password2: '',
        phone: '',
        email: '',
        bankType: '',
        accountNumber: '',
      },
      dialogFormVisible1: false,
      rules: {
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
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    handleUpdateSelf() {
      getSelf(getToken()).then(response => {
        this.selfTemp = Object.assign({},response.data)
        this.selfTemp.password2=this.selfTemp.password
        this.dialogFormVisible1 = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    update() {
      this.$refs['dataForm'].validate((valid) => {
        if(valid) {
          updateAdmin(this.selfTemp).then(()=> {
            this.dialogFormVisible1 = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          })
        }
      })
      // location.reload()
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
