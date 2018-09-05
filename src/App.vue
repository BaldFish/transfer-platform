<template>
  <div id="app">
    <div class="head-wrap">
      <div class="head">
        <a href="/">欢迎来到 可信链 ！</a>
        <div class="no_login" v-if="!isLogin">
          <a href="/login">请登录</a>
          <a href="/register">免费注册</a>
        </div>
        <div class="login" v-if="isLogin" @mouseleave="leaveUl">
          <div @click.capture="toggle">{{userName}} <img src="./down.png" alt=""></div>
          <ul v-if="switchover">
            <li><a href="/personalAssets" target="_blank">个人中心</a></li>
            <li><a href="/securityCenter" target="_blank">安全中心</a></li>
            <li @click="dropOut">退出</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="login-header" v-if="isShowLogin">
      <div class="login-header-cont">
        <router-link to="/home">
          <img src="./common/images/login_header.png" alt="">
        </router-link>
      </div>
    </div>
    <div class="forget_psw_header" v-if="isShowRegister">
      <section>
        <router-link to="/home">
          <img src="./common/images/register_logo.png" alt="">
        </router-link>
        <p>已有账号，立即
          <router-link to="/login" class="to_login">登录</router-link>
        </p>
      </section>
    </div>
    <div class="forget_psw_header" v-if="isShowForgetPassword">
      <section>
        <router-link to="/home">
          <img src="./common/images/forget_psw_logo.png" alt="">
        </router-link>
        <p>已有账号，立即
          <router-link to="/login" class="to_login">登录</router-link>
        </p>
      </section>
    </div>
    <my-topSearch v-if="isShowTopSearch"></my-topSearch>
    <my-toggle :toggleIndex="toggleIndex"></my-toggle>
    <div class="main_wrap">
      <router-view class="main" v-if="isRouterAlive"></router-view>
    </div>
    <div class="footer-wrap">
      <div class="footer">
        <div class="ft-box">
          <a href="/">
            <p>Trusted Assets Blockchain</p>
          </a>
        </div>
        <div class="ft-box">
          <span>资产服务</span>
          <ul class="text">
            <li><a href="javascript:void(0)">维修案例</a></li>
            <li><a href="javascript:void(0)">维修设备</a></li>
            <li><a href="javascript:void(0)">汽车资产</a></li>
            <li><a href="javascript:void(0)">汽车零部件</a></li>
          </ul>
        </div>
        <div class="ft-box">
          <ul class="code">
            <li>
              <a href="javascript:void(0)">
                <img class="ft_code" src="./common/images/Android.png" alt="Android">
                <p>Android版</p>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <img class="ft_code" src="./common/images/IOS.png" alt="IOS">
                <p>IOS版</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import "@/common/stylus/index.styl";
  import {baseURL, cardURL} from '@/common/js/public.js';
  import myTopSearch from "@/components/topSearch/topSearch"
  import myToggle from "@/components/toggle/toggle"

  export default {
    name: 'App',
    components: {
      myTopSearch,
      myToggle,
    },
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true,
        switchover: false,
        isLogin: false,
        userName: "",
        toggleIndex: 0,
        isShowTopSearch: false,
        isShowLogin: false,
        isShowRegister: false,
        isShowForgetPassword: false,
      }
    },
    beforeMount() {
      if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
        this.isLogin = true;
        this.userName = JSON.parse(sessionStorage.getItem("userName")).phone
      } else {
        this.isLogin = false
      }
      this.changTop()
    },
    beforeUpdate() {
      if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
        this.isLogin = true;
        this.userName = JSON.parse(sessionStorage.getItem("userName")).phone
      } else {
        this.isLogin = false
      }
      this.changTop()
    },
    computed: {},
    watch: {},
    methods: {
      changTop() {
        if (this.$route.path == "/login") {
          this.isShowTopSearch = false;
          this.isShowLogin = true;
          this.isShowRegister = false;
          this.isShowForgetPassword = false;
        } else if (this.$route.path == "/register") {
          this.isShowTopSearch = false;
          this.isShowLogin = false;
          this.isShowRegister = true;
          this.isShowForgetPassword = false;
        } else if (this.$route.path == "/forgetPassword") {
          this.isShowTopSearch = false;
          this.isShowLogin = false;
          this.isShowRegister = false;
          this.isShowForgetPassword = true;
        } else {
          this.isShowTopSearch = true;
          this.isShowLogin = false;
          this.isShowRegister = false;
          this.isShowForgetPassword = false;
        }
      },
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      },
      dropOut(command) {
        sessionStorage.removeItem('loginInfo');
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('userName');
        this.switchover = false;
        location.reload()
      },
      toggle() {
        this.switchover = !this.switchover
      },
      leaveUl() {
        this.switchover = false
      },
    }
  }
</script>

<style scoped lang="stylus">
  #app {
    min-height: 98vh;
    display: flex;
    flex-direction: column;
  }

  .head-wrap {
    width: 100%;
    min-width 1212px
    height: 34px;
    background-color: #e5e5e5;
    z-index: 9999;
    .head {
      box-sizing: border-box
      width: 1212px;
      margin: 0 auto;
      text-align right
      line-height 34px
      a {
        color: #666666;
      }
      .no_login {
        display inline-block
        width 160px
        a {
          margin-left 28px
          color: #666666;
        }
      }
      .login {
        display inline-block
        cursor pointer
        width 160px
        position relative
        ul {
          background-color #ffffff
          position absolute
          top 34
          right 0
          text-align center
          width 86px
          color #666666
          li:hover {
            color #c6351e
            a {
              color #c6351e
            }
          }
        }
      }
    }
  }

  .login-header {
    width: 100%;
    height: 130px;
    background-color: #f3f3f3;
    .login-header-cont {
      width: 1200px;
      margin: 0 auto;
      height: 100%;
      padding-top 36px
      img {
        width: 280px;
        height: 58px;
        display: inline-block;
      }
    }
  }

  .forget_psw_header {
    width: 100%;
    height: 130px;
    background-color: #f3f3f3;
    section {
      width: 1200px;
      margin: 0 auto;
      padding-top: 36px;
      p {
        float: right;
        margin-top: 36px;
        font-size: 16px;
        color: #222222;
        .to_login {
          color: #c6351e;
        }
      }
    }
  }

  .main_wrap {
    flex: 1;
    box-sizing: border-box;
    margin: 0 auto;
    width 100%
    min-width 1212px
    background-color #f3f3f3
  }

  .footer-wrap {
    width 100%
    min-width 1212px
    background-color: #272324;
    .footer {
      box-sizing: border-box
      width 1212px
      height 156px
      margin 0 auto
      font-size 0
      text-align center
      .ft-box {
        display inline-block
        font-size 16px
        vertical-align top
        margin-right 66px
        span {
          padding-top 45px
          display block
          color #ffffff
          text-align left
        }
        .text {
          font-size 0
          li {
            padding-top 25px
            display inline-block
            font-size 14px
            margin-right 77px
            a {
              color #ffffff
            }
          }
          li:last-child {
            margin-right 0
          }
        }
        .code {
          font-size 0
          li {
            padding 30px 16px 0
            display inline-block
            font-size 14px
            a {
              color #ffffff
              p {
                font-size 16px
                color #ffffff
                padding-top 14px
              }
            }
          }
        }
      }
      .ft-box:last-child {
        margin-right -16px
      }
      .ft-box:first-child {
        margin-right 42px
        a {
          display inline-block
          color #d92000
          font-size 10px
          margin-top 38px
          background-image: url('./common/images/logo_footer.png');
          background-position: top left;
          background-repeat: no-repeat;
          width 240px
          height 82px
          position relative
          p {
            position absolute
            left 90px
            bottom 0
          }
        }
      }
    }
  }
</style>
