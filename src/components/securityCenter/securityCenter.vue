<template>
  <div class="nav_content">
    <div class="nav_content_title">
      <span>安全中心</span>
      <span>建议您启动全部安全设置，以保障账户及资金安全</span>
    </div>
    <div class="nav_content_table">
      <table>
        <tbody>
        <tr>
          <td><img src="./images/adopt.png" alt=""></td>
          <td>登录密码</td>
          <td>互联网账号存在被盗风险，建议您定期更改密码以保护账户安全</td>
          <td @click="openModalPwd">修改</td>
        </tr>
        <tr>
          <td><img src="./images/adopt.png" alt=""></td>
          <td>手机验证</td>
          <td>您验证的手机： {{phone}}    若已丢失或停用，请立即更换，避免账户被盗</td>
          <td @click="openPhoneModal">修改</td>
        </tr>
        <tr>
          <td :class="{'class-a': userInfo.authentication == 2, 'class-b': userInfo.authentication == 1}">
            <span></span>
          </td>
          <td>实名认证</td>
          <td>用于提升账号的安全性和信任级别</td>
          <td v-if="userInfo.authentication == 2">已认证</td>
          <td v-else @click="openModalRealNameAuth" class="red_set">设置</td>
        </tr>
        <tr v-if="!userInfo.wallet_address">
          <td><img src="./images/not.png" alt=""></td>
          <td>钱包地址</td>
          <td>绑定您的钱包地址后，数据豆才能显示出来</td>
          <td class="red_set" @click="openModalBindWallet">设置</td>
        </tr>
        <tr v-else>
          <td><img src="./images/adopt.png" alt=""></td>
          <td>钱包地址</td>
          <td>钱包地址：{{userInfo.wallet_address}}</td>
          <td @click="openModalModifyWallet">修改</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="safe_dialog">
      <el-dialog title="修改登录密码" :visible.sync="modifyPassword">
        <el-form :model="formPwd" :rules="rules" ref="formPwd">
          <el-form-item label="旧密码" :label-width="formLabelWidth" prop="old">
            <el-input v-model="formPwd.old" auto-complete="off" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="new">
            <el-input v-model="formPwd.new" auto-complete="off" type="password"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" :label-width="formLabelWidth" prop="renew">
            <el-input v-model="formPwd.renew" auto-complete="off" type="password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <button @click="submitPwd">确认</button>
          <button class="forget_btn" @click="modifyPassword = false">
            <router-link to="/forgetPassword">忘记密码</router-link>
          </button>
        </div>
      </el-dialog>
      <el-dialog title="实名认证" :visible.sync="realNameAuthentication" class="auth_box">
        <div class="auth_title">
          <img src="./images/not.png" alt="">
          <p class="title_p1">您还未认证</p>
          <p class="title_p2">认证后，可提升账号安全等级，进行账号申诉等操作</p>
        </div>
        <div style="clear: both"></div>
        <el-form :model="formAuth" :rules="rules" ref="formAuth">
          <el-form-item label="证件类型：" :label-width="formLabelWidth" class="first_label">
            <span>身份证</span>
          </el-form-item>
          <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="realname">
            <el-input v-model="formAuth.realname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" :label-width="formLabelWidth" prop="idcard" :error="errorMsg">
            <el-input v-model="formAuth.idcard" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <button @click="submitAuth">提交</button>
        </div>
      </el-dialog>
      <el-dialog title="修改绑定手机" :visible.sync="phoneVerification">
        <el-form :model="formPhone" :rules="rules" ref="formPhone">
          <div v-show="bindPhone">
            <el-form-item label="绑定手机：" :label-width="formLabelWidth" class="first_label">
              <span>{{phone}}</span>
            </el-form-item>
            <el-form-item label="图形验证码" :label-width="formLabelWidth" prop="captcha_number_next" :error="errorMsgCaptcha">
              <el-input v-model="formPhone.captcha_number_next" auto-complete="off"></el-input>
              <img :src="captcha" @click="getCaptcha" alt="">
            </el-form-item>
            <el-form-item label="短信验证码" :label-width="formLabelWidth" prop="code" :error="errorMsgCode">
              <el-input v-model="formPhone.code" auto-complete="off"></el-input>
              <button type="button" @click="getCode(1)" class="send_btn" v-if="codeValue">发送</button>
              <div class="second_count" v-else>倒计时&nbsp;({{second}})</div>
            </el-form-item>
            <div slot="footer" class="dialog-footer padding_phone">
              <button @click="nextStep">下一步</button>
            </div>
          </div>
          <div v-show="!bindPhone">
            <el-form-item label="新手机号" :label-width="formLabelWidth" prop="inputPhone">
              <el-input v-model="formPhone.inputPhone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图形验证码" :label-width="formLabelWidth" prop="captcha_number" :error="errorMsgCaptcha">
              <el-input v-model="formPhone.captcha_number" auto-complete="off"></el-input>
              <img :src="captcha" @click="getCaptcha" alt="">
            </el-form-item>
            <el-form-item label="短信验证码" :label-width="formLabelWidth" prop="new_code" :error="errorMsgCode">
              <el-input v-model="formPhone.new_code" auto-complete="off"></el-input>
              <button type="button" @click="getCode(2)" class="send_btn" v-if="codeValue2">发送</button>
              <div class="second_count" v-else>倒计时&nbsp;({{second2}})</div>
            </el-form-item>
            <div slot="footer" class="dialog-footer padding_phone">
              <button @click="submitPhone">提交</button>
            </div>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog title="绑定钱包地址" :visible.sync="dialogFormVisible">
        <el-form :model="formBindWallet" :rules="rules" ref="formBindWallet" class="bindWallet">
          <el-form-item label="请输入钱包地址" :label-width="formLabelWidth" prop="wallet_address">
            <el-input v-model="formBindWallet.wallet_address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="验证码" :label-width="formLabelWidth" prop="captcha_number" :error="errorMsg">
            <el-input v-model="formBindWallet.captcha_number" auto-complete="off"></el-input>
            <img :src="captcha" @click="getCaptcha" alt="">
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <button @click="sunmitBindWallet">提交</button>
        </div>
      </el-dialog>
      <el-dialog title="修改钱包地址" :visible.sync="dialogFormVisible2">
        <el-form :model="formModifyWallet" :rules="rules" ref="formModifyWallet" class="bindWallet">
          <el-form-item label="请输入钱包地址" :label-width="formLabelWidth" prop="wallet_address">
            <el-input v-model="formModifyWallet.wallet_address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="验证码" :label-width="formLabelWidth" prop="captcha_number" :error="errorMsg">
            <el-input v-model="formModifyWallet.captcha_number" auto-complete="off"></el-input>
            <img :src="captcha" @click="getCaptcha" alt="">
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <button @click="sunmitModifyWallet">提交</button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import {baseURL} from '@/common/js/public.js';
  const querystring = require('querystring');

  export default{
    inject:['reload'],
    name: "securityCenter",
    components: {},
    data(){
      //Element-ui自定义校验
      var validateRenew = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入重复密码'));
        } else if (value !== this.formPwd.new) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        dialogFormVisible: false,
        dialogFormVisible2: false,
        phoneVerification: false,
        modifyPassword: false,
        realNameAuthentication: false,
        bindPhone:true,
        captcha:"./images/code.png", //图形验证码--图片
        phone:'',
        userInfo:'',
        token:"",
        errorMsg:'',
        errorMsgCaptcha:'',//图形验证码
        errorMsgCode:'',//短信验证码
        codeValue:true,//倒计时value
        codeValue2:true,//倒计时value
        second:60,// 发送验证码倒计时
        second2:60,// 发送验证码倒计时
        formPwd: {
          old:'',
          new:'',
          renew:''
        },
        formAuth: {
          type:1,
          realname: '',
          idcard:''
        },
        formPhone:{
          phone: '',
          code:'',
          new_phone:'',
          new_code:'',
          captcha_id:'',
          captcha_number:'',
          inputPhone:'', //新手机号
          captcha_number_next:'',//手机验证，下一步modal，图形验证码输入的值
        },
        formBindWallet: {
          wallet_address:'',
          captcha_id:'',
          captcha_number:''
        },
        formModifyWallet: {
          wallet_address:'',
          captcha_id:'',
          captcha_number:''
        },
        formLabelWidth: '120px',
        rules: {
          old: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
          new: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          renew: [
            { validator: validateRenew, trigger: 'blur' }
          ],
          wallet_address: [
            { required: true, message: '请输入钱包地址', trigger: 'blur' }
          ],
          captcha_number: [
            { required: true, message: '请输入图形验证码', trigger: 'blur' }
          ],
          captcha_number_next: [
            { required: true, message: '请输入图形验证码', trigger: 'blur' }
          ],
          realname: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' }
          ],
          idcard: [
            { required: true, message: '请输入身份证号', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入短信验证码', trigger: 'blur' }
          ],
          new_code: [
            { required: true, message: '请输入短信验证码', trigger: 'blur' }
          ],
          inputPhone: [
            { required: true, message: '请输入新手机号', trigger: 'blur' }
          ]
        }
      }
    },
    mounted: function() {
      if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
        this.token = JSON.parse(sessionStorage.getItem("loginInfo")).token;
        this.userInfo=JSON.parse(sessionStorage.getItem("userInfo"))
      }
    },
    methods: {
      //清除modal旧数据
      openModalPwd(){
        this.modifyPassword = true;
        if(this.$refs.formPwd!==undefined){
          this.$refs.formPwd.resetFields();
        }
        this.formPwd ={
          old:'',
          new:'',
          renew:''
        }
      },
      openModalModifyWallet(){
        this.dialogFormVisible2 = true;
        if(this.$refs.formModifyWallet!==undefined){
          this.$refs.formModifyWallet.resetFields();
        }
        this.getCaptcha();
        this.formModifyWallet = {
          wallet_address:'',
          captcha_id:'',
          captcha_number:''
        }
      },
      openModalBindWallet(){
        this.dialogFormVisible = true;
        if(this.$refs.formBindWallet!==undefined){
          this.$refs.formBindWallet.resetFields();
        }
        this.getCaptcha();
        this.formBindWallet = {
          wallet_address:'',
          captcha_id:'',
          captcha_number:''
        }
      },
      openModalRealNameAuth(){
        this.realNameAuthentication = true;
        if(this.$refs.formAuth!==undefined){
          this.$refs.formAuth.resetFields();
        }
        this.formAuth = {
          type:1,
          realname: '',
          idcard:''
        }
      },
      //修改密码
      submitPwd(){
        this.$refs.formPwd.validate((valid) => {
          if (valid) {
            axios({
              method: 'put',
              url: `${baseURL}/v1/users/${this.userInfo._id}/password`,
              data: querystring.stringify(this.formPwd),
              headers: {
                "X-Access-Token": `${this.token}`,
              }
            }).then(res => {
              this.modifyPassword = false
            }).catch(error => {
              console.log(error);
            })
          } else {
            return false;
          }
        })
      },
      //用户认证
      submitAuth(){
        this.$refs.formAuth.validate((valid) => {
          if (valid) {
            //errorMsg修改成一样的值，vue没触发响应，每次清空
            this.errorMsg = "";
            axios({
              method: 'post',
              url: `${baseURL}/v1/users/${this.userInfo._id}/authentication`,
              data: querystring.stringify(this.formAuth),
              headers: {
                "X-Access-Token": `${this.token}`,
              }
            }).then(res => {
              this.userInfo.authentication = 2;
              this.realNameAuthentication = false
            }).catch(error => {
              console.log(error);
              this.errorMsg = "姓名身份证号不匹配";
            })
          }
        })
      },
      //获取图片验证码--图片
      getCaptcha(){
        axios({
          method: 'post',
          url: `${baseURL}/v1/captcha`,
          data: querystring.stringify({})
        }).then(res => {
          this.captcha = `data:image/png;base64,${res.data.png}`;
          this.formPhone.captcha_id =res.data.captcha_id;
          this.formBindWallet.captcha_id =res.data.captcha_id;
          this.formModifyWallet.captcha_id =res.data.captcha_id;
        }).catch(error => {
          console.log(error);
        });
      },
      //获取短信验证码
      getCode(id) {
        let phoneNum ="";
        if(id == 1){
          //倒计时
          let me = this;
          me.codeValue = false;
          let interval = window.setInterval(function() {
            if ((me.second--) <= 0) {
              me.second = 60;
              me.codeValue = true;
              window.clearInterval(interval);
            }
          }, 1000);
          phoneNum = this.userInfo.phone
        }else{
          if (this.formPhone.inputPhone){
            //倒计时
            let me = this;
            me.codeValue2 = false;
            let interval = window.setInterval(function() {
              if ((me.second2--) <= 0) {
                me.second2 = 60;
                me.codeValue2 = true;
                window.clearInterval(interval);
              }
            }, 1000);
            phoneNum = '+86'+this.formPhone.inputPhone
          }
        }
        axios({
          method: 'post',
          url: `${baseURL}/v1/sms/code`,
          data: querystring.stringify({
            phone: phoneNum, //手机号
            type:3 //1-注册，2-修改密码, 3-登录
          })
        }).then(res => {
        }).catch(error => {
          console.log(error);
        })
      },
      //修改绑定手机,清除modal旧数据
      openPhoneModal(){
        this.phoneVerification = true;
        this.bindPhone =  true;
        this.getCaptcha();
        if(this.$refs.formPhone!=undefined){
          this.$refs.formPhone.resetFields();
        }
        this.formPhone = {
          phone: '',
          code:'',
          new_phone:'',
          new_code:'',
          captcha_id:'',
          captcha_number:'',
          captcha_number_next:'',
          inputPhone:''
        };
        //倒计时初始化
        this.codeValue = true;
        this.codeValue2 = true;
        this.second = 60;
        this.second2 = 60;
      },
      nextStep(){
        //校验图形验证码input存在
        this.$refs.formPhone.validateField('captcha_number_next',(captcha_number_next) => {
          if (!captcha_number_next) {
            //校验短信验证码input存在
            this.$refs.formPhone.validateField('code',(code) => {
              if (!code) {
                //校验图形验证码正确
                this.errorMsgCaptcha = '';
                axios({
                  method: 'get',
                  url: `${baseURL}/v1/captcha/${this.formPhone.captcha_id}/code/${this.formPhone.captcha_number_next}`
                }).then(res => {
                  //校验短信验证码正确
                  this.errorMsgCode = '';
                  axios({
                    method: 'get',
                    url: `${baseURL}/v1/sms/${this.userInfo.phone}/code/${this.formPhone.code}`
                  }).then(res => {
                    this.bindPhone =false;
                  }).catch(error => {
                    console.log(error);
                    this.errorMsgCode = '短信验证码错误'
                  })
                }).catch(error => {
                  console.log(error);
                  this.errorMsgCaptcha = '图形验证码错误'
                })
              } else {
                console.log('error code!!');
                return false;
              }
            })
          } else {
            console.log('error captcha_number_next!!');
            return false;
          }
        })
      },
      //修改手机号
      submitPhone(){
        this.formPhone.phone = this.userInfo.phone;
        this.formPhone.new_phone = '+86'+this.formPhone.inputPhone;
        this.$refs.formPhone.validate((valid) => {
          if (valid) {
            //校验图形验证码正确
            this.errorMsgCaptcha = '';
            axios({
              method: 'get',
              url: `${baseURL}/v1/captcha/${this.formPhone.captcha_id}/code/${this.formPhone.captcha_number}`
            }).then(res => {
              //校验短信验证码正确
              this.errorMsgCode = '';
              axios({
                method: 'get',
                url: `${baseURL}/v1/sms/+86${this.formPhone.inputPhone}/code/${this.formPhone.new_code}`
              }).then(res => {
                axios({
                  method: 'post',
                  url: `${baseURL}/v1/users/${this.userInfo._id}/phone`,
                  data: querystring.stringify(this.formPhone),
                  headers: {
                    "X-Access-Token": `${this.token}`,
                  }
                }).then(res => {
                  this.phoneVerification = false;
                  this.reload()
                }).catch(error => {
                  console.log(error);
                })
              }).catch(error => {
                console.log(error);
                this.errorMsgCode = '短信验证码错误'
              })
            }).catch(error => {
              console.log(error);
              this.errorMsgCaptcha = '图形验证码错误'
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      //绑定钱包地址
      sunmitBindWallet(){
        //校验input是否有值
        this.$refs.formBindWallet.validate((valid) => {
          if (valid) {
            //校验图形验证码
            //errorMsg修改成一样的值，vue没触发响应，每次清空
            this.errorMsg = "";
            axios({
              method: 'get',
              url: `${baseURL}/v1/captcha/${this.formBindWallet.captcha_id}/code/${this.formBindWallet.captcha_number}`
            }).then(res => {
              axios({
                method: 'post',
                url: `${baseURL}/v1/users/${this.userInfo._id}/wallet_address/${this.formBindWallet.wallet_address}`,
                data: querystring.stringify(this.formBindWallet),
                headers: {
                  "X-Access-Token": `${this.token}`,
                }
              }).then(res => {
                this.dialogFormVisible = false;
                this.reload()
              }).catch(error => {
                console.log(error);
              })
            }).catch(error => {
              console.log(error);
              this.errorMsg = "图形验证码错误";
              //this.$refs.formBindWallet.fields[1].error="图形验证码错误"
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      //修改钱包地址
      sunmitModifyWallet(){
        //校验input是否有值
        this.$refs.formModifyWallet.validate((valid) => {
          if (valid) {
            //校验图形验证码
            //errorMsg修改成一样的值，vue没触发响应，每次清空
            this.errorMsg = "";
            axios({
              method: 'get',
              url: `${baseURL}/v1/captcha/${this.formModifyWallet.captcha_id}/code/${this.formModifyWallet.captcha_number}`
            }).then(res => {
              axios({
                method: 'post',
                url: `${baseURL}/v1/users/${this.userInfo._id}/wallet_address/${this.formModifyWallet.wallet_address}`,
                data: querystring.stringify(this.formModifyWallet),
                headers: {
                  "X-Access-Token": `${this.token}`,
                }
              }).then(res => {
                this.dialogFormVisible2 = false;
                this.reload()
              }).catch(error => {
                console.log(error);
              })
            }).catch(error => {
              console.log(error);
              this.errorMsg = "图形验证码错误";
              //this.$refs.formModifyWallet.fields[1].error="图形验证码错误"
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    },
  }
</script>
<style scoped>
  .nav_content{
    width: 1078px;
    float: right;
  }
  .nav_content_title{
    width: 1078px;
    height: 50px;
    background-color: #ffffff;
    border: solid 1px #bfbfbf;
    line-height: 50px;
    font-size: 18px;
    color: #222222;
  }
  .nav_content_title span{
    padding-left: 20px;
  }
  .nav_content_title span:last-child{
    font-size: 14px;
    color: #666666;
  }
  .nav_content_table{
    margin-top: 12px;
    width:1078px;
    background-color: #ffffff;
    border: solid 1px #bfbfbf;
    margin-bottom: 324px;
  }
  .nav_content_table table{
    width:100%;
  }
  .nav_content_table tbody td:nth-child(1){
    width:100px;
    text-align: center;
  }
  .nav_content_table tbody td:nth-child(1) span{
    display: inline-block;
  }
  .nav_content_table tbody td:nth-child(2){
    width:170px;
    font-size: 18px;
    color: #222222;
  }
  .nav_content_table tbody td:nth-child(3){
    width:710px;
    font-size: 16px;
    color: #666666;
  }
  .nav_content_table tbody td:nth-child(4){
    font-size: 16px;
    color: #666666;
    cursor: pointer;
  }
  .nav_content_table tbody tr{
    border-bottom: 1px solid #d2d2d2;
    text-align: left;
    height:90px;
  }
  .nav_content_table tbody tr td{
    vertical-align: middle;
  }
  .nav_content_table tbody tr:last-child{
    border-bottom: none;
  }
  .red_set{
    color: #c6351e !important;
  }
</style>
<style>
  .safe_dialog .el-dialog__header{
    text-align: center;
    font-size: 16px;
    color: #222222;
  }
  .safe_dialog .dialog-footer{
    text-align: center;
  }
  .padding_phone{
    padding: 20px;
  }
  .safe_dialog .dialog-footer button{
    width: 85px;
    height: 30px;
    border-radius: 4px;
    border: solid 1px #c6351e;
    font-size: 14px;
    color: #c9402a;
    outline: none;
    background-color: #ffffff;
    cursor: pointer;
  }
  .safe_dialog .forget_btn{
    margin-left: 30px;
  }
  .safe_dialog .forget_btn a{
    color: #c9402a;
  }
  .safe_dialog .el-form-item{
    margin-bottom: 14px;
  }
  .safe_dialog .el-dialog__footer{
    padding: 20px;
  }
  .safe_dialog .el-form-item__label{
    color: #222222;
  }
  .safe_dialog .el-input__inner{
    width: 198px;
    height: 28px;
    background-color: #eeeeee;
    border-radius: 0;
    border: 0;
    padding-left: 4px;
  }
  .safe_dialog .el-dialog{
    width: 400px;
    border-radius: 10px;
  }
  .safe_dialog .el-dialog__body{
    padding-bottom: 0;
    padding-top: 10px;
  }
  .safe_dialog .el-form-item img{
    width: 57px;
    height: 23px;
    position: relative;
    top: 7px;
    left: -60px;
    cursor: pointer;
  }
  .safe_dialog .el-form-item__content{
    width:100%;
  }
  .safe_dialog .el-input{
    float: left;
    width:auto;
  }
  .safe_dialog .el-dialog__headerbtn{
    border: 1px solid #909399;
    width: 18px;
    height: 18px;
  }
  .safe_dialog .el-dialog__headerbtn .el-dialog__close:hover{
    color: #909399;
  }
  .safe_dialog .send_btn{
    width: 57px;
    height: 23px;
    border-radius: 4px;
    border: solid 1px #c6351e;
    font-size: 14px;
    background-color: #ffffff;
    color: #c6351e;
    outline: none;
    cursor: pointer;
    position: relative;
    left: -60px;
    top: 1px;
  }
  .safe_dialog .first_label .el-form-item__label{
    padding-right: 2px;
  }
  .safe_dialog .auth_title{
    padding-left: 14px;
    margin-bottom: 12px;
  }
  .safe_dialog .auth_title img{
    float: left;
    margin: 0 10px;
  }
  .safe_dialog .title_p1{
    font-size: 16px;
    color: #222222;
    position: relative;
    top: -4px;
    margin-bottom: 12px;
  }
  .safe_dialog .title_p2{
    font-size: 12px;
    color: #666666;
  }
  .safe_dialog .auth_box .el-dialog{
    width: 420px;
  }
  .class-a span{
    width: 35px;
    height: 27px;
    background: url("./images/adopt.png") no-repeat center;
    background-size: 100% 100%;
  }
  .class-b span{
    width: 33px;
    height: 34px;
    background: url("./images/not.png") no-repeat center;
    background-size: 100% 100%;
  }
  .bindWallet .el-form-item__label{
    width: 122px !important;
  }
  .second_count{
    background-color: #7d7d7d;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    line-height: 23px;
    width: 78px;
    height: 23px;
    position: relative;
    left: -80px;
    top: 1px;
    display: inline-block;
  }
</style>
