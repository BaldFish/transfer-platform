<template>
  <div id="app">
    <div class="head-wrap" v-if="isShowTopSearch">
      <div class="head">
        <a class="logo" href="/">
          <!--<p>Trusted Assets Blockchain</p>-->
        </a>
        <ul class="platform">
          <li v-for="(item,index) of toggleParam" @click="platform(index)" :class="{active:index===toggleIndex}">{{item}}</li>
        </ul>
        <a href="/">欢迎来到 ENGINE ！</a>
        <div class="favorite" @click="turnFavorite">
          <span class="s_text">收藏夹</span>
          <span class="s_num">{{this.$store.state.favoriteCount}}</span>
        </div>
        <div class="no_login" v-if="!isLogin">
          <a href="javascript:void(0)" @click="login">请登录</a>
          <a href="javascript:void(0)" @click="register">免费注册</a>
        </div>
        <div class="login" v-if="isLogin" @mouseleave.stop="leaveUl">
          <div @click.stop="toggle">{{userName}} <img src="./common/images/down.png" alt=""></div>
          <ul v-if="switchover">
            <li><a href="/personalAssets" target="_blank">个人中心</a></li>
            <li><a href="/securityCenter" target="_blank">安全中心</a></li>
            <li @click.stop="dropOut">退出</li>
          </ul>
        </div>
      </div>
    </div>
    <!--<div class="login-header" v-if="isShowLogin">
      <div class="login-header-cont">
        <router-link to="/transferPlatform">
          <img src="./common/images/login_header.png" alt="">
        </router-link>
      </div>
    </div>
    <div class="forget_psw_header" v-if="isShowRegister">
      <section>
        <router-link to="/transferPlatform">
          <img src="./common/images/register_logo.png" alt="">
        </router-link>
        <p>已有账号，立即
          <router-link to="/login" class="to_login">登录</router-link>
        </p>
      </section>
    </div>
    <div class="forget_psw_header" v-if="isShowForgetPassword">
      <section>
        <router-link to="/transferPlatform">
          <img src="./common/images/forget_psw_logo.png" alt="">
        </router-link>
        <p>已有账号，立即
          <router-link to="/login" class="to_login">登录</router-link>
        </p>
      </section>
    </div>-->
    <!--<my-topSearch v-if="isShowTopSearch"></my-topSearch>
    <my-toggle :toggleIndex="toggleIndex"></my-toggle>-->
    <div class="main_wrap">
      <router-view class="main" v-if="isRouterAlive"></router-view>
    </div>
    <div class="footer-wrap">
      <div class="footer">
        <div class="ft-box">
          <a href="javascript:void(0)">
            <img src="./common/images/logo_footer.png" alt="">
          </a>
        </div>
        <div class="ft-box">
          <ul class="text">
            <li>工作时间：08:30-17:30</li>
            <li>服务电话：010-58205388</li>
          </ul>
        </div>
        <div class="ft-box">
          <ul class="code">
            <li>
              <a href="javascript:void(0)">
                <img class="ft_code" src="./common/images/weixin.png" alt="weixin">
                <p>微信号</p>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <img class="ft_code" src="./common/images/Android.png" alt="Android">
                <p>Android钱包</p>
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
  import {baseURL, loginPlatform, exchangePlatform, transferPlatform, searchPlatform} from '@/common/js/public.js';
  import axios from "axios";
  import utils from "@/common/js/utils.js";
  
  export default {
    name: 'App',
    components: {},
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
        isShowTopSearch: true,
        isShowLogin: false,
        isShowRegister: false,
        isShowForgetPassword: false,
        toggleIndex: 2,
        toggleParam: ["搜索", "交易平台", "转让平台","开发者计划"],
        userId: '',
        token: "",
      }
    },
    beforeMount() {
      let token = utils.getCookie("token");
      if (token) {
        axios({
          method: "GET",
          url: `${baseURL}/v1/sessions/check`,
          headers: {
            "Access-Token": `${token}`,
          }
        }).then((res) => {
          if (res.data.user_id) {
            window.sessionStorage.setItem("userInfo", JSON.stringify(res.data));
            let loginInfo = {};
            loginInfo.token = token;
            loginInfo.user_id = res.data.user_id;
            window.sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
            this.userId = JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
            this.token = JSON.parse(sessionStorage.getItem("loginInfo")).token;
            this.userName = JSON.parse(sessionStorage.getItem("userInfo")).phone;
            this.isLogin = true;
            this.acquireFavoriteCount();
          } else {
            this.isLogin = false;
            sessionStorage.removeItem('loginInfo');
            sessionStorage.removeItem('userInfo');
            //this.dropOut()
          }
        }).catch((err) => {
          console.log(err);
        })
      } else {
        sessionStorage.removeItem('loginInfo');
        sessionStorage.removeItem('userInfo');
      }
      //this.changTop()
    },
    mounted() {
      if(this.pathname==="/developer"){
        this.toggleIndex=3
      }else{
        this.toggleIndex=2
      }
    },
    beforeUpdate() {
      let token = utils.getCookie("token");
      if (token) {
        axios({
          method: "GET",
          url: `${baseURL}/v1/sessions/check`,
          headers: {
            "Access-Token": `${token}`,
          }
        }).then((res) => {
          if (res.data.user_id) {
            window.sessionStorage.setItem("userInfo", JSON.stringify(res.data));
            let loginInfo = {};
            loginInfo.token = token;
            loginInfo.user_id = res.data.user_id;
            window.sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
            this.userId = JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
            this.token = JSON.parse(sessionStorage.getItem("loginInfo")).token;
            this.userName = JSON.parse(sessionStorage.getItem("userInfo")).phone;
            this.isLogin = true;
            this.acquireFavoriteCount();
          } else {
            this.isLogin = false;
            sessionStorage.removeItem('loginInfo');
            sessionStorage.removeItem('userInfo');
            //this.dropOut()
          }
        }).catch((err) => {
          console.log(err);
        })
      } else {
        sessionStorage.removeItem('loginInfo');
        sessionStorage.removeItem('userInfo');
      }
      //this.changTop()
    },
    computed: {
      pathname:{
        get:function () {
          return document.location.pathname
        },
        set:function () {}
      },
      favoriteCount: function () {
        return this.$store.state.favoriteCount
      }
    },
    watch: {
      $route(to,from) {
        if (to.path === "/developer") {
          this.toggleIndex = 3
        } else {
          this.toggleIndex = 2
        }
      },
      favoriteCount: function () {
        this.acquireFavoriteCount();
      }
    },
    methods: {
      login() {
        let redirectURL = window.location.href;
        let url=`?redirectURL=${redirectURL}`;
        window.location.href=`${loginPlatform}/login${url}`;
      },
      register() {
        let redirectURL = window.location.href;
        let url=`?redirectURL=${redirectURL}`;
        window.location.href=`${loginPlatform}/register${url}`;
      },
      /*changTop() {
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
        } else if (this.$route.path == "/contract") {
          this.isShowTopSearch = false;
          this.isShowLogin = false;
          this.isShowRegister = false;
          this.isShowForgetPassword = false;
        } else {
          this.isShowTopSearch = true;
          this.isShowLogin = false;
          this.isShowRegister = false;
          this.isShowForgetPassword = false;
        }
      },*/
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      },
      dropOut() {
        let sessionsId = JSON.parse(sessionStorage.getItem("userInfo")).session_id;
        axios({
          method: 'DELETE',
          url: `${baseURL}/v1/sessions/${sessionsId}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        }).then(res => {
          sessionStorage.removeItem('loginInfo');
          sessionStorage.removeItem('userInfo');
          //document.cookie = `token=;expires=${new Date(0)}`;
          //document.cookie = `user_id=;expires=${new Date(0)}`;
          document.cookie = `token=;expires=${new Date(0)};domain=.datajs.com.cn`;
          document.cookie = `user_id=;expires=${new Date(0)};domain=.datajs.com.cn`;
          this.switchover = false;
          location.reload()
        }).catch(error => {
          console.log(error);
        })
      },
      toggle() {
        this.switchover = !this.switchover
      },
      leaveUl() {
        this.switchover = false
      },
      platform(index) {
        if (index === 0) {
          window.location.href = searchPlatform
        } else if (index === 1) {
          window.location.href = exchangePlatform
        } else if (index === 2) {
          window.location.href = transferPlatform
        }else if (index === 3) {
          this.$router.push("/developer");
        }
      },
      open() {
        this.$confirm('此操作需要先登录, 是否登录?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          this.login();
        }).catch(() => {
        });
      },
      acquireFavoriteCount() {
        axios({
          method: "GET",
          url: `${baseURL}/v1/assets-transfer/favorites/count/${this.userId}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.$store.state.favoriteCount = res.data.count;
        }).catch((err) => {
          console.log(err);
        })
      },
      turnFavorite() {
        if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
          this.$router.push("/favorite")
        } else {
          this.open()
        }
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
    height: 50px;
    background-color: #d91e01;
    z-index: 9999;
    .head {
      box-sizing: border-box
      width: 1212px;
      height 50px
      margin: 0 auto;
      text-align right
      line-height 50px
      font-size 0
      a {
        color: #ffffff;
        font-size 12px
      }
      .logo {
        display inline-block
        color #ffffff
        background-image: url('./common/images/logo.png');
        background-position: top center;
        background-repeat: no-repeat;
        width 150px
        height 46px
        float left
        margin-top 2px
        margin-left 6px
        position relative
        vertical-align top
        p {
          line-height 20px
          font-size 12px
          position absolute
          left 50px
          bottom 0
        }
        
      }
      .platform {
        box-sizing border-box
        display inline-block
        text-align left
        width 630px
        height 50px
        font-size 0
        //padding-left 100px
        vertical-align top
        padding-top 1px
        li {
          display inline-block
          text-align center
          width 106px
          height 48px
          line-height 48px
          font-size: 16px;
          color: #f3f3f3;
          cursor pointer
        }
        li:active {
          background-color #ffffff
          color: #d91e01;
        }
        .active {
          background-color #ffffff
          color: #d91e01;
        }
      }
      .favorite {
        margin-left 20px
        box-sizing border-box
        display: inline-block
        cursor pointer
        margin-right 20px
        width 100px
        height 24px
        line-height 24px
        border 1px solid #ffffff
        background-image: url('./common/images/like.png');
        background-position: top 5px left 10px;
        background-repeat: no-repeat;
        background-color #d91e01
        color #ffffff
        font-size 0
        position relative
        text-align left
        .s_text {
          padding-left 30px
          display inline-block
          font-size 12px
        }
        .s_num {
          width 16px
          height 16px
          line-height 16px
          text-align center
          display inline-block
          color #d91e01
          background-color #ffffff
          border-radius 50%
          position absolute
          top 2px
          right 10px
          text-align center
          overflow hidden
          font-size 10px
        }
      }
      .no_login {
        vertical-align top
        display inline-block
        width 160px
        height 50px
        a {
          font-size 12px
          margin-left 28px
          color: #ffffff;
        }
      }
      .login {
        display inline-block
        cursor pointer
        width 160px
        height 50px
        position relative
        color #ffffff
        vertical-align top
        font-size 12px
        img {
          vertical-align top
          margin-top 18px
        }
        ul {
          background-color #ffffff
          position absolute
          top 50px
          right 0
          text-align center
          width 86px
          li {
            height 40px
            color #666666
            a {
              color #666666
            }
          }
          li:hover {
            color #d91e01
            a {
              color #d91e01
            }
          }
        }
      }
    }
  }
  
  /*.login-header {
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
  */
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
      height 160px
      margin 0 auto
      font-size 0
      .ft-box {
        display inline-block
        font-size 16px
        vertical-align top
        .text {
          height 48px
          margin-top 56px
          li {
            font-size 14px
            color #ffffff
          }
          li:last-child {
            margin-top 20px
          }
        }
        .code {
          font-size 0
          padding-right 15px
          li {
            padding-top 10px
            display inline-block
            font-size 14px
            text-align center
            a {
              color #ffffff
              p {
                font-size 16px
                color #ffffff
                padding-top 14px
              }
            }
          }
          li:first-child{
            margin-right 36px
          }
        }
      }
      .ft-box:first-child {
        margin-left 12px
        margin-right 146px
        padding-top 5px
        a {
          box-sizing border-box
          font-size: 0px;
          color: #c6351e;
          display: table-cell;
          width: 150px;
          height: 150px;
          vertical-align: top;
          text-align: center;
          img {
            vertical-align: top;
            max-width 150px
            max-height 150px
            position: relative;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .ft-box:last-child {
        float right
      }
    }
  }
</style>
