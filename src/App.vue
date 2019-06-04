<template>
  <div id="app">
    <div class="head-wrap" v-if="isShowTopSearch">
      <div class="head">
        <a class="logo" href="/">
          <img src="./common/images/logo.png" alt="">
        </a>
        <ul class="platform">
          <li v-for="(item,index) of toggleParam" @click="platform(index)" :class="{active:index===toggleIndex}">{{item}}</li>
        </ul>
        <a href="/">欢迎来到 数据集市 ！</a>
        <div class="favorite" @click="turnFavorite">
          <span class="s_text">收藏夹</span>
          <span class="s_num">{{this.$store.state.favoriteCount}}</span>
        </div>
        <div class="no_login" v-if="!isLogin">
          <a href="javascript:void(0)" @click="login">登录/注册</a>
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
    <div class="main_wrap">
      <router-view class="main" v-if="isRouterAlive"></router-view>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="380px" top="20vh"
      center class="dialog">
      <div class="content">
        <div class="header">
          <a class="close" href="javascript:void(0)" @click="close"></a>
          <p class="phone">咨询热线：010-58205388</p>
          <p class="tip">请填写一下信息，我们会尽快和您联系</p>
        </div>
        <div class="mainer">
          <div class="name">
            <label for="name">您的姓名：</label>
            <input type="text" id="name" v-model="name">
          </div>
          <div class="phone">
            <label for="phone">手机号码：</label>
            <input type="text" id="phone" v-model="phone">
          </div>
          <div class="phone">
            <label for="email">邮箱：</label>
            <input type="text" id="email" v-model="email">
          </div>
          <div class="content">
            <label for="content">留言内容：</label>
            <textarea id="content" v-model="content"></textarea>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitAdvise">提交留言</el-button>
  </span>
    </el-dialog>
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
          <ul class="text">
            <li @click="advise">意见和建议</li>
          </ul>
        </div>
        <div class="ft-box">
          <ul class="code">
            <li>
              <a href="javascript:void(0)">
                <img class="ft_code" src="./common/images/Android.png" alt="Android">
                <p>Android版人人道</p>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <img class="ft_code" src="./common/images/weixin.png" alt="weixin">
                <p>咨询客服微信号</p>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <img class="ft_code" src="./common/images/gongzhonghao.png" alt="weixin">
                <p>人人道公众号</p>
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
        name:"",
        phone:"",
        content:"",
        email:"",
        centerDialogVisible: false,
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
      let username = encodeURIComponent(this.getQuery("username"));
      let uutoken = this.getQuery("uutoken");
      if(uutoken){
        axios({
          method: "GET",
          url: `${baseURL}/v1/saas/uutoken?phone=${username}&uutoken=${uutoken}`,
        }).then((res) => {
          if (res.data.code == 200) {
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
          }
        }).catch((err) => {
          console.log(err);
        })
      } else {
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
            }
          }).catch((err) => {
            console.log(err);
          })
        } else {
          sessionStorage.removeItem('loginInfo');
          sessionStorage.removeItem('userInfo');
        }
      }
    },
    mounted() {
      if(this.pathname==="/developer"){
        this.toggleIndex=3
      }else{
        this.toggleIndex=2
      }
    },
    beforeUpdate() {
      let username = encodeURIComponent(this.getQuery("username"));
      let uutoken = this.getQuery("uutoken");
      if(uutoken){
        axios({
          method: "GET",
          url: `${baseURL}/v1/saas/uutoken?phone=${username}&uutoken=${uutoken}`,
        }).then((res) => {
          if (res.data.code == 200) {
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
          }
        }).catch((err) => {
          console.log(err);
        })
      } else {
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
      }
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
      //获取URL参数
      getQuery(name){
        let reg=new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
        let r=window.location.search.substr(1).match(reg);
        if(r!=null){
          return unescape(r[2]);
        } else{
          return null
        }
      },
      advise(){
        this.name="";
        this.phone="";
        this.content="";
        this.centerDialogVisible=true
      },
      close(){
        this.centerDialogVisible=false
      },
      submitAdvise(){
        if(this.name===""){
          this.tipName="姓名";
          this.openTip();
          return
        }
        if(this.phone===""&&this.email===""){
          this.tipName="手机号码或邮箱";
          this.openTip();
          return
        }
        if(this.content===""){
          this.tipName="反馈内容";
          this.openTip();
          return
        }
        let data={
          name:this.name,
          phone:"+86"+this.phone,
          email:this.email,
          content:this.content,
          platform:1,
        };
        //提交请求
        axios({
          method: 'post',
          url: `${baseURL}/v1/users/feedback`,
          data: querystring.stringify(data),
        }).then(res => {
          this.centerDialogVisible=false
        }).catch(error => {
          console.log(error);
        })
      },
      openTip() {
        this.$confirm(`${this.tipName}, 不能为空！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          showCancelButton:false
        }).then(() => {
        }).catch(() => {
        });
      },
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
        float left
        box-sizing border-box
        font-size: 0px;
        display: table-cell;
        width: 160px;
        height: 50px;
        vertical-align: top;
        text-align: center;
        img {
          vertical-align: top;
          max-width 160px
          max-height 48px
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .platform {
        box-sizing border-box
        display inline-block
        text-align left
        width 620px
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
        margin-right 20px
        width 140px
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
        margin-right 20px
        width 140px
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

  /*.head-wrap {
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
            margin-right 10px
            a {
              color #ffffff
              p {
                font-size 16px
                color #ffffff
                padding-top 14px
              }
            }
          }
          li:nth-child(2){
            margin-right 20px
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
          width: 200px;
          height: 150px;
          vertical-align: top;
          text-align: center;
          img {
            vertical-align: top;
            max-width 200px
            max-height 150px
            position: relative;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .ft-box:nth-child(3){
        margin-left 130px
        li{
          cursor pointer
          border 1px solid #ffffff
          padding 4px
        }
      }
      .ft-box:last-child {
        float right
      }
    }
  }
</style>
<style lang="stylus">
  .dialog {
    .el-dialog--center {
      border-radius: 10px;
    }
    .el-dialog__header {
      display none
    }
    .el-dialog__body {
      padding-top 28px
      padding-bottom 28px
      position relative
      .content {
        .header{
          text-align center
          .close{
            display inline-block
            width 15px
            height 15px
            position absolute
            top 12px
            right 20px
            background-image: url('./common/images/close.png');
            background-position: top left;
            background-repeat: no-repeat;
          }
          .phone{
            font-size: 18px;
            color: #c6351e;
            margin-bottom 8px
          }
          .tip{
            color #666666
          }
        }
        .mainer{
          margin-top 40px
          margin-left 25px
          label{
            color #222222
            font-size 18px
            display inline-block
            width 90px
            text-align right
          }
          input,textarea{
            color #333333
            box-sizing border-box
            outline:none;
            border 1px solid #d2d2d2
            resize:none;
            width 210px
            padding-left 12px
          }
          input:focus,textarea:focus{
            border 1px solid #c6351e
          }
          input{
            height 26px
          }
          textarea{
            height 130px
          }
          .name{
            margin-bottom 22px
          }
          .phone{
            margin-bottom 22px
          }
          .content{
            label{
              vertical-align top
            }
            textarea{
              vertical-align top
            }
          }
        }
      }
    }
    .el-dialog__footer{
      padding-top 0
      padding-bottom 20px
      .el-button,.el-button--primary{
        border none
        width: 94px;
        height: 30px;
        background-color: #c6351e;
        border-radius: 8px;
        padding 0
        font-size: 16px;
      }
    }
  }
</style>
