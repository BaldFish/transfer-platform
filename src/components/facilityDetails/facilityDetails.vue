<template>
  <div>
    <div class="facilityDetails" v-if="equities==='所有权'">
      <my-topSearch></my-topSearch>
      <my-toggle :toggleIndex="toggleIndex"></my-toggle>
      <div class="site_box">
        <div class="site">
          <ul>
            <li>当前位置 ：</li>
            <li><a href="/">首页</a></li>
            <li>&nbsp;>&nbsp;</li>
            <li><a href="/moreFacility">维修设备</a></li>
            <li>&nbsp;>&nbsp;</li>
            <li>{{facilityDetails.assetname}}</li>
          </ul>
        </div>
      </div>
      <div class="details">
        <div class="clearfix details_top">
          <div class="fl facility_img">
            <img :src="facilityDetails.asseturl" alt="">
          </div>
          <div class="fr facility_intro">
            <h4>{{facilityDetails.assetname}}</h4>
            <div class="attestation">
              <span class="merchant" v-if="facilityDetails.authtype==='认证商家'">{{facilityDetails.authtype}}</span>
              <span class="person" v-if="facilityDetails.authtype==='认证个人'">{{facilityDetails.authtype}}</span>
              <span class="trust" v-if="facilityDetails.creditlevel!=='未认证'">{{facilityDetails.creditlevel}}</span>
            </div>
            <div :class="facilityDetails.shopcart_id?'like':'dislike'" @click="toggleLike(facilityDetails.id)">收藏</div>
            <a href="/facilitySource" @click="getFacilitySource"><p class="tracing">可信溯源</p></a>
            <div class="intro_list">
              <ul>
                <li>
                  <span>资产所属人</span>
                  <span class="holder">：{{facilityDetails.assetowner}}</span>
                </li>
                <li>
                  <span>权益</span>
                  <span>：{{facilityDetails.sell_type}}</span>
                </li>
                <li>
                  <span>价格</span>
                  <span>：{{facilityDetails.price}}</span>
                </li>
                <li>
                  <span>案例ID</span>
                  <span>：{{facilityDetails.id}}</span>
                </li>
                <li>
                  <span>上架时间</span>
                  <span>：{{facilityDetails.sell_at}}</span>
                </li>
              </ul>
              <a href="javascript:void(0)" @click="buy(facilityDetails.id)"><p class="buy">一键购买</p></a>
            </div>
          </div>
        </div>
        <div class="intro_text">
          <span>设备简介</span>
          <p style="line-height: 18px">{{facilityDetails.assetcontent}}</p>
        </div>
      </div>
    </div>
    <div class="facilityProfit" v-if="equities==='收益权'">
      <my-topSearch></my-topSearch>
      <my-toggle :toggleIndex="toggleIndex"></my-toggle>
      <div class="site_box">
        <div class="site">
          <ul>
            <li>当前位置 ：</li>
            <li><a href="/">首页</a></li>
            <li>&nbsp;>&nbsp;</li>
            <li><a href="/moreFacility">维修设备</a></li>
            <li>&nbsp;>&nbsp;</li>
            <li>{{facilityDetails.assetname}}</li>
          </ul>
        </div>
      </div>
      <div class="details">
        <div class="clearfix details_top">
          <div class="fl facility_img">
            <img :src="facilityDetails.asseturl" alt="">
          </div>
          <div class="fr facility_intro">
            <h4>{{facilityDetails.assetname}}</h4>
            <div class="attestation">
              <span class="merchant" v-if="facilityDetails.authtype==='认证商家'">{{facilityDetails.authtype}}</span>
              <span class="person" v-if="facilityDetails.authtype==='认证个人'">{{facilityDetails.authtype}}</span>
              <span class="trust" v-if="facilityDetails.creditlevel!=='未认证'">{{facilityDetails.creditlevel}}</span>
            </div>
            <div :class="facilityDetails.shopcart_id?'like':'dislike'" @click="toggleLike(facilityDetails.id)">收藏</div>
            <a href="/facilitySource"  @click="getFacilitySource"><p class="tracing">可信溯源</p></a>
            <div class="intro_list">
              <ul>
                <li>
                  <span>资产所属人</span>
                  <span class="holder">：{{facilityDetails.assetowner}}</span>
                </li>
                <li>
                  <span>权益</span>
                  <span>：{{facilityDetails.sell_type}}</span>
                </li>
                <li>
                  <span>每份价格</span>
                  <span>：{{facilityDetails.price}}</span>
                </li>
                <li>
                  <span>已购份数</span>
                  <span>：{{purchasedCount}}/{{splitCount}}</span>
                </li>
                <li>
                  <span>设备ID</span>
                  <span>：{{facilityDetails.id}}</span>
                </li>
              </ul>
            </div>
            <div class="intro_list intro_list_right">
              <ul>
                <li>
                  <span>发布时间</span>
                  <span>：{{facilityDetails.sell_at}}</span>
                </li>
                <li>
                  <span>拆分截止时间</span>
                  <span>：{{facilityDetails.split_expire}}</span>
                </li>
                <li>
                  <span>收益起止时间</span>
                  <span class="holder">：{{facilityDetails.profit_start}}~{{facilityDetails.profit_end}}</span>
                </li>
                <li>
                  <span>收益方式</span>
                  <span>：{{facilityDetails.pay_method}}</span>
                </li>
                <li>
                  <span>认购份数</span>
                  <span class="input-number">：
                  <el-input-number size="mini" v-model="num" :min="min" :max="restCount"></el-input-number>
                </span>
                </li>
              </ul>
              <a href="javascript:void(0)" @click="buy(facilityDetails.id)"><p class="buy">一键购买</p></a>
            </div>
          </div>
        </div>
        <div class="intro_text">
          <span>设备简介</span>
          <p style="line-height: 18px">{{facilityDetails.assetcontent}}</p>
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
    name: "facilityDetails",
    data() {
      return {
        toggleIndex: 0,
        facilityDetails:{},
        userId:"",
        token:"",
        apiKey:"",
        assetId:"",
        id:"",
        equities:"查阅权",
        num:0,
        min:0,
        purchasedCount:0,
        restCount:1,
        splitCount:1
      }
    },
    mounted() {
      if(JSON.parse(sessionStorage.getItem("loginInfo"))){
        this.userId=JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
        this.token=JSON.parse(sessionStorage.getItem("loginInfo")).token;
      }
      this.apiKey=JSON.parse(sessionStorage.getItem("facilityDetails")).apikey;
      this.assetId=JSON.parse(sessionStorage.getItem("facilityDetails")).assetid;
      this.acquireFacilityDetails()
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
      openLimited(){
        this.$confirm('所购资产数超出限制或购买资产为0', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
        }).catch(() => {
        });
      },
      toggleLike(val){
        if(sessionStorage.getItem("loginInfo")){
          let likeInfo=this.facilityDetails;
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
              likeInfo.shopcart_id=this.id;
              this.addCollection();
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
              this.subtractCollection();
            }).catch((err) => {
              console.log(err);
            });
          }
        }else {
          this.open()
        }
      },
      acquireFacilityDetails(){
        if(JSON.parse(sessionStorage.getItem("loginInfo"))){
          axios({
            method: "GET",
            url: `${baseURL}/v1/asset/${this.apiKey}/${this.assetId}/detail?userid=${this.userId}`,
            headers: {
              "Content-Type": "application/json",
            }
          }).then((res) => {
            res.data.sell_at=utils.formatDate(new Date(res.data.sell_at), "yyyy-MM-dd hh:mm:ss");
            if(res.data.sell_type==="收益权"){
              res.data.split_expire=utils.formatDate(new Date(res.data.split_expire), "yyyy-MM-dd");
              res.data.profit_start=utils.formatDate(new Date(res.data.profit_start), "yyyy-MM-dd");
              res.data.profit_end=utils.formatDate(new Date(res.data.profit_end), "yyyy-MM-dd");
              this.purchasedCount=res.data.purchased_count;
              this.splitCount=res.data.split_count;
              this.restCount=res.data.rest_count;
            }
            res.data.assetowner=res.data.assetowner.substr(0,13)+"..."+res.data.assetowner.substr(res.data.assetowner.length-14,13);
            this.equities=res.data.sell_type;
            this.facilityDetails=res.data;
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
            if(res.data.sell_type==="收益权"){
              res.data.split_expire=utils.formatDate(new Date(res.data.split_expire), "yyyy-MM-dd");
              res.data.profit_start=utils.formatDate(new Date(res.data.profit_start), "yyyy-MM-dd");
              res.data.profit_end=utils.formatDate(new Date(res.data.profit_end), "yyyy-MM-dd");
              this.purchasedCount=res.data.purchased_count;
              this.splitCount=res.data.split_count;
              this.restCount=res.data.rest_count;
            }
            res.data.assetowner=res.data.assetowner.substr(0,13)+"..."+res.data.assetowner.substr(res.data.assetowner.length-14,13);
            this.equities=res.data.sell_type;
            this.facilityDetails=res.data
          }).catch((err) => {
            console.log(err);
          })
        }
      },
      getFacilitySource(val) {
        this.$store.commit("changeFacilitySource",this.facilityDetails);
      },
      addCollection(){
        this.$store.commit("addCollection")
      },
      subtractCollection(){
        this.$store.commit("subtractCollection")
      },
      buy(val){
        if(JSON.parse(sessionStorage.getItem("loginInfo"))){
          let buyInfoObj=this.facilityDetails;
          this.apiKey=buyInfoObj.apikey;
          this.assetId=buyInfoObj.assetid;
          let data={};
          if(this.facilityDetails.sell_type==="收益权"){
            if(this.num===0){
              this.openLimited();
              return
            }
            data.nums=this.num;
            axios({
              method: "POST",
              url: `${baseURL}/v1/order/${this.userId}/${this.apiKey}/${this.assetId}`,
              data:querystring.stringify(data),
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Access-Token":this.token,
              }
            }).then((res) => {
              buyInfoObj=res.data;
              this.getBuy(buyInfoObj);
              this.$router.push("/checkOrder")
            }).catch((err) => {
              console.log(err);
            })
          }else{
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
          }
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
  .facilityDetails{
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
      .details_top{
        .facility_img{
          box-sizing border-box
          background-color: #ffffff;
          display: table-cell;
          width: 280px;
          height: 280px;
          vertical-align: middle;
          text-align: center;
          img {
            vertical-align: middle;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            max-width 250px
            max-height 250px
          }
        }
        .facility_intro{
          width 904px
          h4 {
            width 770px
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #222222;
            font-size: 20px;
          }
          .attestation {
            width 850px
            height 78px
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
            top 78px
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
  .facilityProfit{
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
      .details_top{
        .facility_img{
          box-sizing border-box
          background-color: #ffffff;
          display: table-cell;
          width: 280px;
          height: 280px;
          vertical-align: middle;
          text-align: center;
          img {
            vertical-align: middle;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            max-width 250px
            max-height 250px
          }
        }
        .facility_intro{
          width 904px
          h4 {
            width 770px
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #222222;
            font-size: 20px;
          }
          .attestation {
            width 850px
            height 75px
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
            top 78px
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
            width 445px
            float left
            height 184px
            .buy{
              position absolute
              top 120px
              right 10px
              width 126px
              height 50px
              background-color #c6351e
              color #ffffff
              font-size 22px
              line-height 50px
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
          .intro_list_right{
            float right
            li{
              span:first-child{
                width 100px
              }
            }
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
<style>
  .input-number .el-input--mini .el-input__inner {
    height: 18px;
    line-height: 18px;
  }
  .input-number .el-input-number--mini {
    width: 110px;
    line-height: 16px;
  }
</style>
