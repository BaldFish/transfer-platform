<template>
  <div class="caseDetails">
    <my-topSearch></my-topSearch>
    <my-toggle :toggleIndex="toggleIndex"></my-toggle>
    <div class="site_box">
      <div class="site">
        <ul>
          <li>当前位置 ：</li>
          <li><a href="/">首页</a></li>
          <li>&nbsp;>&nbsp;</li>
          <li><a href="/moreCase">维修案例</a></li>
          <li>&nbsp;>&nbsp;</li>
          <li>{{caseDetails.assetname}}</li>
        </ul>
      </div>
    </div>
    <div class="details">
      <h4>{{caseDetails.assetname}}</h4>
      <div class="attestation">
        <span class="merchant" v-if="caseDetails.authtype==='认证商家'">{{caseDetails.authtype}}</span>
        <span class="person" v-if="caseDetails.authtype==='认证个人'">{{caseDetails.authtype}}</span>
        <span class="trust" v-if="caseDetails.creditlevel!=='未认证'">{{caseDetails.creditlevel}}</span>
      </div>
      <div :class="caseDetails.shopcart_id?'like':'dislike'" @click="toggleLike(caseDetails.id)">收藏</div>
      <a href="/caseSource" @click="getCaseSource"><p class="tracing">可信溯源</p></a>
      <div class="intro_list">
        <ul>
          <li>
            <span>资产所属人</span>
            <span class="holder">：{{caseDetails.assetowner}}</span>
          </li>
          <li>
            <span>权益</span>
            <span>：{{caseDetails.sell_type}}</span>
          </li>
          <li>
            <span>价格</span>
            <span>：{{caseDetails.price}}</span>
          </li>
          <li>
            <span>案例ID</span>
            <span>：{{caseDetails.id}}</span>
          </li>
          <li>
            <span>上架时间</span>
            <span>：{{caseDetails.sell_at}}</span>
          </li>
        </ul>
        <a href="javascript:void(0)" @click="buy(caseDetails.id)"><p class="buy">一键购买</p></a>
      </div>
      <div class="intro_text">
        <span>案例简介</span>
        <p style="line-height: 18px">{{caseDetails.assetcontent}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import myTopSearch from "../topSearch/topSearch"
  import myToggle from "../toggle/toggle"
  import {baseURL,cardURL} from '@/common/js/public.js';
  import utils from "@/common/js/utils.js";
  const querystring = require('querystring');
  
  export default {
    name: "caseDetails",
    data() {
      return {
        toggleIndex: 0,
        caseDetails:{},
        userId:"",
        token:"",
        apiKey:"",
        assetId:"",
        id:"",
      }
    },
    mounted() {
      if(JSON.parse(sessionStorage.getItem("loginInfo"))){
        this.userId=JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
        this.token=JSON.parse(sessionStorage.getItem("loginInfo")).token;
      }
      this.apiKey=JSON.parse(sessionStorage.getItem("caseDetails")).apikey;
      this.assetId=JSON.parse(sessionStorage.getItem("caseDetails")).assetid;
      this.acquireCaseDetails()
    },
    methods: {
      open() {
        this.$confirm('此操作需要先登录, 是否登录?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          this.$router.push("/login")
        }).catch(() => {
        });
      },
      toggleLike(val){
        if(sessionStorage.getItem("loginInfo")){
          let likeInfo=this.caseDetails;
          this.apiKey=likeInfo.apikey;
          this.assetId=likeInfo.assetid;
          this.id=likeInfo.shopcart_id;
          if(likeInfo.shopcart_id===""){
            axios({
              method: "POST",
              url: `${baseURL}/v1/shopcart/${this.userId}/${this.apiKey}/${this.assetId}`,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Access-Token":this.token
              }
            }).then((res) => {
              this.id=res.data._id;
              likeInfo.shopcart_id=this.id
              this.addCollection()
            }).catch((err) => {
              console.log(err);
            });
          }else if(likeInfo.shopcart_id!==""){
            axios({
              method: "DELETE",
              url: `${baseURL}/v1/shopcart/${this.userId}/${this.id}`,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Access-Token":this.token
              }
            }).then((res) => {
              likeInfo.shopcart_id="";
              this.subtractCollection()
            }).catch((err) => {
              console.log(err);
            });
          }
        }else {
          this.open()
        }
      },
      acquireCaseDetails(){
        if(JSON.parse(sessionStorage.getItem("loginInfo"))){
          axios({
            method: "GET",
            url: `${baseURL}/v1/asset/${this.apiKey}/${this.assetId}/detail?userid=${this.userId}`,
            headers: {
              "Content-Type": "application/json",
            }
          }).then((res) => {
            res.data.sell_at=utils.formatDate(new Date(res.data.sell_at), "yyyy-MM-dd hh:mm:ss");
            this.caseDetails=res.data;
          }).catch((err) => {
            console.log(err);
          })
        }else{
          axios({
            method: "GET",
            url: `${baseURL}/v1/asset/${this.apiKey}/${this.assetId}/detail`,
            headers: {
              "Content-Type": "application/json",
            }
          }).then((res) => {
            res.data.sell_at=utils.formatDate(new Date(res.data.sell_at), "yyyy-MM-dd hh:mm:ss");
            this.caseDetails=res.data;
          }).catch((err) => {
            console.log(err);
          })
        }
      },
      getCaseSource() {
        this.$store.commit("changeCaseSource",this.caseDetails);
      },
      addCollection(){
        this.$store.commit("addCollection")
      },
      subtractCollection(){
        this.$store.commit("subtractCollection")
      },
      buy(val){
        if(JSON.parse(sessionStorage.getItem("loginInfo"))){
          let buyInfoObj=this.caseDetails;
          this.apiKey=buyInfoObj.apikey;
          this.assetId=buyInfoObj.assetid;
          let data={};
          data.nums=1;
          axios({
            method: "POST",
            url: `${baseURL}/v1/order/${this.userId}/${this.apiKey}/${this.assetId}`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-Access-Token":this.token,
            },
            data:querystring.stringify(data),
          }).then((res) => {
            buyInfoObj=res.data;
            this.getBuy(buyInfoObj);
            this.$router.push("/checkOrder")
          }).catch((err) => {
            console.log(err);
          })
        }else{
          this.open()
        }
      },
      getBuy(val){
        this.$store.commit("changeBuy",val);
      }
    },
    watch: {},
    computed: {},
    components: {
      myTopSearch,
      myToggle
    },
  }
</script>

<style scoped lang="stylus">
  .caseDetails {
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
    .details {
      width 1200px
      padding-top 42px
      margin 0 auto
      position relative
      h4 {
        width 1028px
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #222222;
        font-size: 20px;
      }
      .attestation {
        width 850px
        height 74px
        font-size 0px
        span {
          text-align center
          color #ffffff
          font-size 14px
          display inline-block
          width 70px
          height 30px
          line-height 30px
          margin-right 14px
          margin-top 16px
          margin-bottom 30px
        }
        .trust {
          background-color #99c7ff
        }
        .person {
          background-color #ffdd99
        }
        .merchant {
          background-color #ffa799
        }
      }
      .dislike {
        position absolute
        top 48px
        right 0
        height 20px
        line-height 20px
        color: #979797;
        cursor pointer
        padding-left 26px
        background-image: url('./images/dislike.png');
        background-repeat: no-repeat;
        background-position: top left;
      }
      .like {
        position absolute
        top 48px
        right 0
        height 20px
        line-height 20px
        color: #c6351e;
        cursor pointer
        padding-left 26px
        background-image: url('./images/like.png');
        background-repeat: no-repeat;
        background-position: top left;
      }
      .tracing {
        position absolute
        top 83px
        right 0
        color: #f3b43f;
        font-size 14px
        background-image: url('./images/credible.png');
        background-repeat: no-repeat;
        background-position: top left;
        padding-left 26px
        height 18px
        line-height 18px
        margin-bottom 24px
      }
      .intro_list{
        box-sizing border-box
        min-height 180px
        padding 20px 30px 5px
        background-color #ffffff
        position relative
        .buy{
          position absolute
          top 88px
          right 60px
          width 170px
          height 54px
          background-color #c6351e
          color #ffffff
          font-size 22px
          line-height 54px
          text-align center
        }
        li{
          font-size 0
          color: #222222;
          margin-bottom 15px
          span{
            display inline-block
            font-size 16px
            vertical-align top
          }
          span:first-child{
            width 80px
          }
        }
      }
      .intro_text{
        box-sizing border-box
        min-height 180px
        margin-top 22px
        margin-bottom 70px
        padding 20px 30px
        background-color #ffffff
        border 1px solid #bfbfbf;
        span{
          color: #000000;
          font-size: 18px;
        }
        p{
          margin 18px 50px 30px 36px
          color: #666666;
          font-size: 14px;
        }
      }
    }
  }
</style>
