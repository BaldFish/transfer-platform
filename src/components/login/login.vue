<template>
  <div class="login-container">
    <div class="login-content">
      <div class="site_box">
        <div class="site">
          <ul>
            <li>当前位置 ：</li>
            <li><a href="/">首页</a></li>
            <li>&nbsp;>&nbsp;</li>
            <li><a href="/login">登录</a></li>
          </ul>
        </div>
      </div>
      <div class="content-box">
        <div class="content-mid">
          <img src="./images/login_content.png" alt="">
          <div class="content-right">
            <div class="right-details">
              <ul class="content-nav">
                <li @click="tabChange" :class="{'nav-avtive': loginWay,'nav-unavtive': !loginWay}">手机登陆</li>
                <li @click="tabChange" :class="{'nav-avtive': !loginWay,'nav-unavtive':loginWay }">免密登录</li>
              </ul>
              <section class="account-login" v-show="loginWay">
                <ul>
                  <li>
                    <i></i>
                    <input type="text" placeholder="请输入手机号" v-model="phoneLeft" v-validate="'required|mobile'" name='mobile'>
                    <span v-show="errors.has('mobile')" class="error" style="width: 200px">{{errors.first('mobile')}}</span>
                  </li>
                  <li>
                    <i></i>
                    <input type="password" placeholder="请输入密码" v-model="password" v-validate="'required'" name='password'>
                    <span v-show="errors.has('password')" class="error">{{errors.first('password')}}</span>
                  </li>
                  <li>
                    <i></i>
                    <input type="text" placeholder="请输入验证码" v-model="captcha_number" v-validate="'required'" name='captcha_number'
                           @blur="captchaError">
                    <img class="img_change_img" @click="getCaptcha" :src="captcha">
                    <span v-show="errors.has('captcha_number')" class="error">{{errors.first('captcha_number')}}</span>
                    <span v-show="captchaNotice" class="error">图形验证码错误</span>
                  </li>
                </ul>
              </section>
              <section class="account-login phone-login" v-show="!loginWay">
                <ul>
                  <li>
                    <i></i>
                    <input type="text" placeholder="请输入手机号" v-model="phoneRight" v-validate="'required|mobileRight'" name='mobileRight'>
                    <span v-show="errors.has('mobileRight')" class="error error_bot">{{errors.first('mobileRight')}}</span>
                  </li>
                  <li>
                    <i></i>
                    <input type="text" placeholder="请输入验证码" v-model="captcha_number_right" v-validate="'required'" name='captcha_number_right'
                           @blur="captchaErrorRight">
                    <img class="img_change_img" @click="getCaptcha" :src="captcha">
                    <span v-show="errors.has('captcha_number_right')" class="error error_top">{{errors.first('captcha_number_right')}}</span>
                    <span v-show="captchaNoticeRight" class="error error_top">图形验证码错误</span>
                  </li>
                  <li>
                    <i></i>
                    <input type="text" placeholder="请输入手机验证码" v-model="code" v-validate="'required'" name='code' @blur="codeError"
                           :disabled="isDisabled">
                    <div class="img_change_img get_code" @click="getCode" v-if="codeValue">获取验证码</div>
                    <div class="img_change_img count_down" v-else>倒计时（{{second}}）</div>
                    <span v-show="errors.has('code')" class="error">{{errors.first('code')}}</span>
                    <span v-show="codeNotice" class="error">短信验证码错误</span>
                  </li>
                </ul>
              </section>

              <router-link to="/forgetPassword" class="to_forget"><p>忘记密码？</p></router-link>
              <router-link to="" class="to_login"><span @click="login">登录</span></router-link>
              <router-link to="/register" class="to_register"><p>还没有账号，立即注册</p></router-link>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import {baseURL} from '@/common/js/public.js';
  import myToggle from "../toggle/toggle"

  const querystring = require('querystring');

  export default {
    name: "login",
    components: {
      myToggle,
    },
    data() {
      return {
        toggleIndex: 0,
        loginWay: true,
        codeValue: true,
        isDisabled: true,
        captchaNotice: false,//校验图形码是否正确
        captchaNoticeRight: false,//校验图形码是否正确
        codeNotice: false,//校验短信码是否正确
        second: 60,// 发送验证码倒计时
        phoneLeft: "", //手机号
        phoneRight: "", //手机号
        captcha_number: "", //图形验证码
        captcha_number_right: "", //图形验证码
        captcha_id: "", //图形验证码--ID
        captcha: "./images/code.png", //图形验证码--图片
        code: "", //短信验证码
        password: "", //密码
        userId: "",
        codeErrors:""
      };
    },
    watch: {},
    computed: {
      uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
      }
    },
    mounted () {
      //这个是钩子函数
      //如果getCaptcha函数要执行，必须先执行钩子函数
      //这个钩子函数完成了对getCaptcha函数的调用
      //应该注意的是，使用mounted 并不能保证钩子函数中的 this.$el 在 document 中。为此还应该引入Vue.nextTick/vm.$nextTick
      this.$nextTick(() => {
        this.getCaptcha()
      });
      //获取错误码
      axios({
        method: 'get',
        url: `http://wallet-api-test.launchain.org:50000/v1/errors`
      }).then(res => {
        this.codeErrors = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    methods: {
      tabChange() {
        this.loginWay = !this.loginWay
      },
      //获取图片验证码--图片
      getCaptcha() {
        axios({
          method: 'post',
          url: `${baseURL}/v1/captcha`,
          data: querystring.stringify({})
        }).then(res => {
          this.captcha = `data:image/png;base64,${res.data.png}`;
          this.captcha_id = res.data.captcha_id;
          //校验图形验证码
          this.captchaError();
          this.captchaErrorRight();
        }).catch(error => {
          console.log(error);
        });
      },
      //获取短信验证码
      getCode() {
        this.$validator.validateAll({
          mobileRight: this.phoneRight,
          captcha_number_right: this.captcha_number_right,
        }).then((result) => {
          //校验是否正确：图形验证码
          if (this.captchaNoticeRight) {
            this.isDisabled = true;
            return false
          } else {
            //校验input输入值
            if (result) {
              this.isDisabled = false;

              //倒计时
              let me = this;
              me.codeValue = false;
              let interval = window.setInterval(function () {
                if ((me.second--) <= 0) {
                  me.second = 60;
                  me.codeValue = true;
                  window.clearInterval(interval);
                }
              }, 1000);
              //get短信验证码
              axios({
                method: 'post',
                url: `${baseURL}/v1/sms/code`,
                data: querystring.stringify({
                  phone: "+86" + this.phoneRight, //手机号
                  type: 3 //1-注册，2-修改密码, 3-登录
                })
              }).then(res => {
              }).catch(error => {
                console.log(error);
              })
            } else {
              this.isDisabled = true;
            }
          }
        })

      },
      //校验图形验证码
      captchaError() {
        if (this.captcha_number) {
          axios({
            method: 'get',
            url: `${baseURL}/v1/captcha/${this.captcha_id}/code/${this.captcha_number}`
          }).then(res => {
            this.captchaNotice = false
          }).catch(error => {
            console.log(error);
            this.captchaNotice = true
          });
        } else {
          this.captchaNotice = false
        }
      },
      captchaErrorRight() {
        if (this.captcha_number_right) {
          axios({
            method: 'get',
            url: `${baseURL}/v1/captcha/${this.captcha_id}/code/${this.captcha_number_right}`
          }).then(res => {
            this.captchaNoticeRight = false
          }).catch(error => {
            console.log(error);
            this.captchaNoticeRight = true
          });
        } else {
          this.captchaNoticeRight = false
        }
      },
      //校验短信验证码
      codeError() {
        if (this.code) {
          axios({
            method: 'get',
            url: `${baseURL}/v1/sms/+86${this.phoneRight}/code/${this.code}`
          }).then(res => {
            this.codeNotice = false
          }).catch(error => {
            console.log(error);
            this.codeNotice = true
          });
        } else {
          this.codeNotice = false
        }
      },
      login() {
        if (this.loginWay) {
          let loginFormData = {
            phone: "+86" + this.phoneLeft, //手机号
            password: this.password, //密码
            device_id: this.uuid, //设备ID
            platform: 1,
            captcha_id: this.captcha_id, //图片验证码ID
            captcha_number: this.captcha_number //图片验证码--图片
          };
          this.$validator.validateAll({
            mobile: this.phoneLeft,
            password: this.password,
            captcha_number: this.captcha_number
          }).then((result) => {
            //校验是否正确：图形验证码
            if (this.captchaNotice) {
              return false
            } else {
              //校验input输入值
              if (result) {
                axios({
                  method: 'post',
                  url: `${baseURL}/v1/sessions`,
                  data: querystring.stringify(loginFormData)
                }).then(res => {
                  document.cookie=`token=${res.data.token}`;
                  document.cookie=`user_id=${res.data.user_id}`;
                  /*document.cookie=`token=${res.data.token};domain=.launchain.org`;
                  document.cookie=`user_id=${res.data.user_id};domain=.launchain.org`;*/
                  window.sessionStorage.setItem("loginInfo", JSON.stringify(res.data));
                  this.userId = res.data.user_id;
                  this.acquireUserInfo();
                }).catch(error => {
                  console.log(error);
                  //错误提示
                  this.codeErrors.forEach((data)=>{
                    if(error.response.data.code == data.code){
                      this.$confirm(data.cn, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      })
                    }
                  })

                })
              }
            }
          })
        } else {
          let loginFormData = {
            phone: "+86" + this.phoneRight, //手机号
            password: this.password, //密码
            device_id: this.uuid, //设备ID
            platform: 1,
            code: this.code, //短信验证码
            captcha_id: this.captcha_id, //图片验证码ID
            captcha_number: this.captcha_number_right //图片验证码--图片
          };

          this.$validator.validateAll({
            mobileRight: this.phoneRight,
            captcha_number_right: this.captcha_number_right,
            code: this.code
          }).then((result) => {
            //校验是否正确：图形验证码、短信验证码
            if (this.captchaNoticeRight || this.codeNotice) {
              return false
            } else {
              //校验input输入值
              if (result) {
                axios({
                  method: 'post',
                  url: `${baseURL}/v1/sessions/phone`,
                  data: querystring.stringify(loginFormData)
                }).then(res => {
                  document.cookie=`token=${res.data.token}`;
                  document.cookie=`user_id=${res.data.user_id}`;
                  /*document.cookie=`token=${res.data.token};domain=.launchain.org`;
                  document.cookie=`user_id=${res.data.user_id};domain=.launchain.org`;*/
                  window.sessionStorage.setItem("loginInfo", JSON.stringify(res.data));
                  this.userId = res.data.user_id;
                  this.acquireUserInfo();
                }).catch(error => {
                  console.log(error);
                  //错误提示
                  this.codeErrors.forEach((data)=>{
                    if(error.response.data.code == data.code){
                      this.$confirm(data.cn, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      })
                    }
                  })
                })
              }
            }
          })
        }
      },
      acquireUserInfo() {
        axios({
          method: "GET",
          url: `${baseURL}/v1/users/${this.userId}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          res.data.phone = res.data.phone.substr(3, 3) + "***" + res.data.phone.substr(10, 4);
          window.sessionStorage.setItem("userName", JSON.stringify(res.data));
          this.$router.back(-1)
        }).catch((err) => {
          console.log(err);
        });
      },
    }
  }
</script>
<style scoped>
  .login-content {
    background: url("./images/login_bg.png") no-repeat center;
    background-size: 100% 100%;
    height: 765px;
  }

  .content-box {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
  }

  .content-mid {
    width: 876px;
    height: 480px;
    margin: 0 auto;
    padding-top: 120px;
  }

  .content-mid img {
    width: 370px;
    height: 480px;
    float: left;
    z-index: 10;
    position: relative;
  }

  .content-right {
    width: 506px;
    height: 414px;
    background-color: #ffffff;
    float: left;
    margin-top: 32px;
    margin-left: -28px;
    z-index: 5;
  }

  .right-details {
    margin-top: 26px;
    margin-left: 62px;
  }

  .content-nav {
    height: 48px;
    margin-bottom: 20px;
  }

  .content-nav li {
    font-size: 20px;
    color: #222222;
    height: 44px;
    width: 190px;
    float: left;
    text-align: center;
    border-bottom: 4px solid #313131;
    cursor: pointer;
  }

  .nav-avtive {
    color: #c7361e !important;
    border-bottom: 4px solid #c7361e !important;
  }

  .nav-unavtive {
    color: #222222;
    border-bottom: 4px solid #313131;
  }

  .account-login li {
    width: 380px;
    height: 40px;
    background-color: #f3f3f3;
    /*margin-bottom: 16px;*/
    margin-bottom: 24px
  }

  .account-login li input {
    background-color: #f3f3f3;
    height: 24px;
    width: 328px;
    outline: none;
    position: relative;
    bottom: 17px;
    -webkit-box-shadow: 0 0 0px 1000px #f3f3f3 inset !important;
  }

  .account-login li:nth-child(3) input {
    width: 210px;
  }

  .account-login li:nth-child(2) input {
    bottom: 15px;
  }

  .account-login li:nth-child(1) input {
    bottom: 14px;
  }

  .account-login li:nth-child(1) i {
    width: 20px;
    height: 24px;
    display: inline-block;
    background: url("./images/id.png") no-repeat center;
    background-size: 100% 100%;
    position: relative;
    margin: 7px 10px;
  }

  .account-login li:nth-child(2) i {
    width: 20px;
    height: 25px;
    display: inline-block;
    background: url("./images/passwoer.png") no-repeat center;
    background-size: 100% 100%;
    position: relative;
    margin: 7px 10px;
  }

  .account-login li:nth-child(3) i {
    width: 20px;
    height: 21px;
    display: inline-block;
    background: url("./images/yanzheng.png") no-repeat center;
    background-size: 100% 100%;
    position: relative;
    margin: 10px 10px;
  }

  .img_change_img {
    width: 100px !important;
    height: 33px !important;
    float: right !important;
    margin: 3px 10px;
    cursor: pointer;
  }

  .to_forget p {
    width: 388px;
    text-align: right;
    margin-top: -5px;
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
  }

  .to_login span {
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    width: 380px;
    height: 40px;
    line-height: 40px;
    background-color: #c7361e;
    display: inline-block;
    margin-bottom: 12px;
  }

  .to_register p {
    width: 380px;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }

  .phone-login li:nth-child(1) i {
    width: 19px;
    height: 28px;
    background: url("./images/phone.png") no-repeat center;
    background-size: 100% 100%;
    bottom: 1px;
  }

  .phone-login li:nth-child(2) i {
    width: 20px;
    height: 21px;
    background: url("./images/yanzheng.png") no-repeat center;
    background-size: 100% 100%;
    top: 3px;
  }

  .phone-login li:nth-child(1) input {
    bottom: 17px;
  }

  .phone-login li:nth-child(2) input {
    width: 210px;
    bottom: 10px;
  }

  .get_code {
    border: solid 1px #c7361e;
    font-size: 14px;
    color: #c7361e;
    text-align: center;
    line-height: 35px;
  }

  .count_down {
    background-color: #7d7d7d;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    line-height: 33px;
  }

  .error {
    position: relative;
    color: #c6351e;
    display: inline-block;
    width: 200px;
  }

  .error_bot {
    bottom: 3px;
  }

  .error_top {
    top: 3px;
  }
</style>
<style scoped lang="stylus">
  .site_box {
    margin 0 auto
    width 100%
    background-color: #e7e7e7;
    .site {
      width 1212px
      height 34px
      line-height 34px
      margin 0 auto
      ul {
        padding-left 8px
        font-size 0
        li {
          vertical-align top
          display inline-block
          font-size 14px
          a{
            color: #666666;
          }
        }
      }
    }
  }
</style>
