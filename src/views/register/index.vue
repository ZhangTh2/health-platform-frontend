<template>
  <div class="container">
    <div class="card">
      <div class="col-lg-7">
        <div class="p-5" style="padding-left:600px ">
          <div class="text-center"style="color: #ffffff;padding-right: 800px">
            <h1 class="h4">申请管理员账户</h1>
          </div>
          <el-form ref="dataForm" :rules="rules" :model="Temp" autocomplete="new" label-position="right"
                   label-width="80px" style="width:400px;margin-right: 50px;">
            <el-form-item label="类型" prop="roleId">
              <el-select placeholder="选择想成为的管理员类型" v-model="Temp.roleId">
                <el-option
                  v-for="item in adminOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input type="text" style="display: none"/>
              <el-input type="text" placeholder="5-12个字母/汉字/数字/下划线组成" v-model="Temp.username"
                        autocomplete="new"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="text" style="display: none"/>
              <el-input placeholder="5-12位字母/数字/下划线组成" v-model="Temp.password" type="password" onfocus="type:'password'"
                        autocomplete="new"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
              <el-input type="text" style="display: none"/>
              <el-input placeholder="再次输入密码" v-model="Temp.password2" type="password" onfocus="type:'password'"
                        autocomplete="new"></el-input>
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
              <el-select placeholder="选择银行" v-model="Temp.bankType">
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
            <el-form-item>
              <el-button type="primary" @click="handleInsert()">注册</el-button>
            </el-form-item>
          </el-form>

          <div class="text-center">
            <router-link to="/login" style="color: #ffffff;padding-right: 900px">已有账户？点击登录</router-link>
            <register-view></register-view>
          </div>

        </div>
      </div>
    </div>
  </div>
  <!--<div>-->
  <!--<el-button type="primary" @click="">注册</el-button>-->
  <!--</div>-->


</template>

<script>
  import {insertAdmin,ifexistAdmin} from "@/api/admin";
  export default {
    name: "register",
    data() {
      var validateName = (rule, value, callback) => {
        var pattern = /^[\w\u4e00-\u9fa5]{5,12}$/g
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if (!pattern.test(value)) {
          callback(new Error('5-12个字母/汉字/数字/下划线组成'))
        } else {

            ifexistAdmin(value).then(response => {
              console.log(response.data)
              if (response.data !== 0 ) {
                console.log("错误")
                callback(new Error('该用户名已经被注册'))
              }
              else {callback();}
            })

        }
      };
      var validatePass = (rule, value, callback) => {
        var pattern = /^[\w\u4e00-\u9fa5]{5,12}$/g
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!pattern.test(value)) {
          callback(new Error('5-12个字母/数字/下划线组成'))
        } else {
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
        } else if (!pattern.test(value)) {
          callback(new Error('5-12个字母/数字/下划线组成'))
        } else if (this.Temp.password2 !== this.Temp.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validatePhone = (rule, value, callback) => {
        var pattern = /^1(3|4|5|7|8)\d{9}$/
        if (value !== '' && !pattern.test(value)) {
          callback(new Error('请输入正确格式的手机号码'))
        } else {
          callback();
        }
      };
      var validateEmail = (rule, value, callback) => {
        var pattern = /(\S)+[@]{1}(\S)+[.]{1}(\w)+/
        if (value !== '' && !pattern.test(value)) {
          callback(new Error('请输入正确格式的邮箱'))
        } else {
          callback();
        }

      };
      var validateAccount = (rule, value, callback) => {
        console.log('bankaccount是' + value)
        var pattern = /^([1-9]{1})(\d{15}|\d{18})$/
        if (value !== '') {
          if (this.Temp.bankType === '') {
            callback(new Error("请先选择银行类型"))
          } else if (!pattern.test(value)) {
            callback(new Error('请输入正确格式的银行卡号'))
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        Temp: {
          roleId: '',
          username: '',
          password: '',
          password2: '',
          name:'',
          phone: '',
          email: '',
          bankType: '',
          checked:0,
          accountNumber: '',
        },
        rules: {
          roleId: [{
            required: true,
            message: '请选择类型',
          }],
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
          phone: [{validator: validatePhone, trigger: 'blur'}],
          email: [{validator: validateEmail, trigger: 'blur'}],
          accountNumber: [{validator: validateAccount, trigger: 'blur'}],
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
        adminOptions: [{
          value: '2',
          label: '业务管理员'
        }, {
          value: '3',
          label: '服务管理员'
        }],
      }

    },
    methods:{
      handleInsert() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid) {
            insertAdmin(this.Temp).then(()=> {
              this.$message({
                type: 'success',
                message: '申请成功，请等待超级管理员审核'
              })

            })
            this.$router.push('adminlogin')
          }

        })


      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #283443;
  $light_gray: #eee;
  $cursor: #fff;
  .container{
    height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
  }

</style>
