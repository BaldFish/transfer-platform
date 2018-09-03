<template>
  <div class="reportDetails">
    <my-topSearch></my-topSearch>
    <my-toggle :toggleIndex="toggleIndex"></my-toggle>
    <div class="site_box">
      <div class="site">
        <ul>
          <li>当前位置 ：</li>
          <li><a href="/">首页</a></li>
          <li>&nbsp;>&nbsp;</li>
          <li><a href="/moreReport">诊断报告</a></li>
          <li>&nbsp;>&nbsp;</li>
          <li>{{reportDetails.assetname}}</li>
        </ul>
      </div>
    </div>
    <div class="details">
      <h4>{{reportDetails.assetname}}</h4>
      <div class="attestation">
        <span class="merchant" v-if="reportDetails.authtype==='认证商家'">{{reportDetails.authtype}}</span>
        <span class="person" v-if="reportDetails.authtype==='认证个人'">{{reportDetails.authtype}}</span>
        <span class="trust" v-if="reportDetails.creditlevel!=='未认证'">{{reportDetails.creditlevel}}</span>
      </div>
      <div :class="reportDetails.shopcart_id?'like':'dislike'" @click="toggleLike(reportDetails.id)">收藏</div>
      <div class="price">
        <span class="triangle_border_nw"></span>
        <label>此诊断报告价格：</label>
        <span class="money">{{reportDetails.price}}</span>
        <a href="javascript:void(0)" @click="buy(reportDetails.id)"><p class="buy">一键购买</p></a>
      </div>
      <div class="details-box">
        <div class="details-left">
          <span class="details-dot"></span>
          <ul>
            <li>
              <label>资产所属人</label>
              <span>：{{reportDetails.assetowner}}</span>
            </li>
            <li>
              <label>诊断报告ID</label>
              <span>：{{reportDetails.report_id}}</span>
            </li>
            <li>
              <label>数据来源</label>
              <span>：{{reportDetails.resource}}</span>
            </li>
            <li>
              <label>故障码个数</label>
              <span>：{{reportDetails.fault_n}}</span>
            </li>
            <li>
              <label>VIN码</label>
              <span>：{{reportDetails.vin}}</span>
            </li>
          </ul>
        </div>
        <div class="details-right">
          <span class="details-dot"></span>
          <ul>
            <li>
              <label>权益</label>
              <span>：{{reportDetails.sell_type}}</span>
            </li>
            <li>
              <label>诊断设备ID</label>
              <span>：{{reportDetails.pro_serial_no}}</span>
            </li>
            <li>
              <label>诊断用户ID</label>
              <span>：{{reportDetails.diagnostic_user_id}}</span>
            </li>
            <li>
              <label>报告生产时间</label>
              <span>：{{reportDetails.generate_time}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div style="clear: both"></div>
      <div class="title">
        <span class="title-line"></span>
        <span class="title-text">可信溯源</span>
      </div>
      <div class="transfer-record" :class="{more:isShow}">
        <div class="transfer-title">
          <span class="transfer-dot"></span>
          <label>资产转让记录</label>
          <span class="check-more" @click="reportSource != ''?isShow = true:isShow = false">显示更多</span>
        </div>
        <div class="transfer-container">
          <ul v-for="(item,index) of reportSource" :key="item.id">
            <li>
              <label>"交易发起方"</label>
              <span>："{{item.from}}",</span>
            </li>
            <li>
              <label>"交易接收方"</label>
              <span>："{{item.to}}",</span>
            </li>
            <li>
              <label>"交易价格"</label>
              <span>：{{item.price}},</span>
            </li>
            <li>
              <label>"交易时间"</label>
              <span>："{{item.trans_at}}"</span>
            </li>
          </ul>
        </div>
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
    name: "reportDetails",
    data() {
      return {
        toggleIndex: 0,
        reportSource:[],
        reportDetails:{},
        userId:"",
        token:"",
        apiKey:"",
        assetId:"",
        id:"",
        isShow:false
      }
    },
    mounted() {
      if(JSON.parse(sessionStorage.getItem("loginInfo"))){
        this.userId=JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
        this.token=JSON.parse(sessionStorage.getItem("loginInfo")).token;
      }
      this.apiKey=JSON.parse(sessionStorage.getItem("reportDetails")).apikey;
      this.assetId=JSON.parse(sessionStorage.getItem("reportDetails")).assetid;
      this.acquireReportSource();
      this.acquireReportDetails()
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
          let likeInfo=this.reportDetails;
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
      acquireReportSource(){
        axios({
          method: "GET",
          url: `${cardURL}/v1/transed-asset/${this.assetId}/apikey/${this.apiKey}?page=0&limit=1000000`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          if (res.data.data != null) {
            for(let v of res.data.data){
              v.trans_at=utils.formatDate(new Date(v.trans_at), "yyyy-MM-dd hh:mm:ss");
            }
            this.reportSource = res.data.data
          }else{
            this.reportSource =[]
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      acquireReportDetails(){
        if(JSON.parse(sessionStorage.getItem("loginInfo"))){
          axios({
            method: "GET",
            url: `${baseURL}/v1/asset/${this.apiKey}/${this.assetId}/detail?userid=${this.userId}`,
            headers: {
              "Content-Type": "application/json",
            }
          }).then((res) => {
            res.data.sell_at=utils.formatDate(new Date(res.data.sell_at), "yyyy-MM-dd hh:mm:ss");
            res.data.generate_time=utils.formatDate(new Date(res.data.generate_time), "yyyy-MM-dd hh:mm:ss");
            this.reportDetails=res.data;
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
            res.data.generate_time=utils.formatDate(new Date(res.data.generate_time), "yyyy-MM-dd hh:mm:ss");
            this.reportDetails=res.data;
          }).catch((err) => {
            console.log(err);
          })
        }
      },
      addCollection(){
        this.$store.commit("addCollection")
      },
      subtractCollection(){
        this.$store.commit("subtractCollection")
      },
      buy(val){
        if(JSON.parse(sessionStorage.getItem("loginInfo"))){
          let buyInfoObj=this.reportDetails;
          this.apiKey=buyInfoObj.apikey;
          this.assetId=buyInfoObj.assetid;
          var data={};
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
  .reportDetails {
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
      padding-top 20px
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
    }
  }
  .price{
    width: 1200px;
    height: 60px;
    background-color: #e9e9e9;
    line-height 60px
  }
  .price label{
    font-size: 16px;
    color: #666666;
  }
  .price a{
    outline none
  }
  .money{
    font-size: 24px;
    color: #d91f00;
  }
  .triangle_border_nw{
    width: 0;
    height: 0;
    border-width: 15px 15px 0 0;
    border-style: solid;
    border-color: #d91e01 transparent transparent transparent;
    margin: 40px auto;
    position: relative;
    top: -9px;
    margin-right: 5px;
  }
  .buy{
    width: 160px;
    height: 54px;
    display inline-block;
    background-color: #d91e01;
    font-size: 22px;
    color: #ffffff;
    text-align center
    margin-top: 3px;
    float right
    margin-right:3px
  }
  .details-left,.details-right{
    width: 590px;
    height: 180px;
    background-color: #ffffff;
    border-radius: 10px;
    margin-top 16px
  }
  .details-left{
    float left
  }
  .details-right{
    float right
  }
  .details-dot{
    width: 10px;
    height: 10px;
    display inline-block
    background-color: #f3f3f3;
    border-radius 50%
    margin:10px
    margin-bottom 0
  }
  .details-box ul{
    margin-left: 30px;
    font-size 14px
  }
  .details-box ul li{
    margin-bottom 18px
  }
  .details-box ul li label{
    width: 110px;
    display: inline-block;
    color: #666;
  }
  .details-box ul li span{
    color: #222;
  }
  .title{
    width: 1200px;
    height: 45px;
    background-color: #ffffff;
    border-radius: 10px 10px 0 0;
    border: solid 1px #e5e5e5;
    margin-top 15px
    margin-bottom 4px
    line-height 45px
    font-size: 18px;
    color: #666666;
    .title-line{
      width: 2px;
      height: 17px;
      background-color: #d91e01;
      display: inline-block;
      margin-left: 18px;
      margin-right: 3px;
      position: relative;
      top: 3px;
    }
  }
  .more{
    height:auto !important
  }
  .transfer-record{
    width: 1200px;
    height: 145px;
    background-color: #ffffff;
    border-radius: 0 0 10px 10px;
    border: solid 1px #e5e5e5;
    margin-bottom 60px
    overflow: hidden;
    .transfer-title{
      height:54px
      line-height 54px
      .transfer-dot{
        width: 8px;
        height: 8px;
        background-color: #dcdcdc;
        display: inline-block;
        border-radius: 50%;
        margin-left: 18px;
        margin-right: 2px;
        margin-bottom: 2px;
      }
      label{
        font-size: 18px;
        color: #333333;
      }
      .check-more{
        font-size: 14px;
        color: #666666;
        cursor pointer
        float right
        margin-right 24px
      }
    }
    .transfer-container{
      margin-left 30px
      line-height normal
      margin-bottom: 27px;
      ul{
        margin-bottom 27px
        li{
          label{
            color: #333333
            width: 84px;
            display: inline-block;
          }
          span{
            color: #666666;
          }
        }
      }
    }
  }




</style>
