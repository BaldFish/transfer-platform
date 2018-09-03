<template>
  <div class="moreReport">
    <my-topSearch></my-topSearch>
    <my-toggle :toggleIndex="toggleIndex"></my-toggle>
    <div class="site_box">
      <div class="site">
        <ul>
          <li>当前位置 ：</li>
          <li><a href="/">首页</a></li>
          <li>&nbsp;>&nbsp;</li>
          <li><a href="/moreReport">诊断报告</a></li>
        </ul>
      </div>
    </div>
    <div class="report_list">
      <div class="fr_report" v-for="(item,index) of reportList" :key="item.id">
        <h4><a href="/reportDetails" @click="getReportDetails(item.id)">{{item.assetname}}</a></h4>
        <div class="attestation">
          <span class="merchant" v-if="item.authtype==='认证商家'">{{item.authtype}}</span>
          <span class="person" v-if="item.authtype==='认证个人'">{{item.authtype}}</span>
          <span class="trust" v-if="item.creditlevel!=='未认证'">{{item.creditlevel}}</span>
        </div>
        <div class="putaway">
          <a class="time" href="/reportDetails" @click="getReportDetails(item.id)"><span>报告生成时间：</span>{{item.generate_time}}</a>
          <a class="data" href="/reportDetails" @click="getReportDetails(item.id)"><span>数据来源：</span>{{item.resource}}</a>
        </div>
        <div class="putaway">
          <a class="vin" href="/reportDetails" @click="getReportDetails(item.id)"><span>VIN码：</span>{{item.vin}}</a>
          <a class="breakdown" href="/reportDetails" @click="getReportDetails(item.id)"><span>故障码个数：</span>{{item.fault_n}}个</a>
          <a class="equity" href="/reportDetails" @click="getReportDetails(item.id)"><span>权益：</span>{{item.sell_type}}</a>
        </div>
        <!--<div class="fault">
          <p>
            <a href="/caseDetails" @click="getCaseDetails(item.id)">
              <span>故障现象：</span>{{item.assetcontent}}
            </a>
          </p>
        </div>
        <div :class="item.shopcart_id?'like':'dislike'" @click="toggleLike(item.id)">收藏</div>-->
        <div class="price_box">
          <a href="/reportDetails" @click="getReportDetails(item.id)"><p class="price">{{item.price}}</p></a>
          <a href="/reportDetails" @click="getReportDetails(item.id)"><p class="tracing">可信溯源</p></a>
          <a href="javascript:void(0)" @click="buy(item.id)"><p class="buy">一键购买</p></a>
        </div>
        <div class="bar"></div>
      </div>
    </div>
    <div class="clearfix paging">
      <el-pagination class="my_paging"
                     layout="prev, pager, next"
                     :background=true
                     :total=total
                     :page-size=reportLimit
                     :current-page.sync=reportPage
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import "../../common/stylus/paging.styl";
  import axios from "axios";
  import _ from "lodash";
  import {baseURL,cardURL} from '@/common/js/public.js';
  import myTopSearch from "../topSearch/topSearch";
  import myToggle from "../toggle/toggle"
  import utils from "@/common/js/utils.js";
  const querystring = require('querystring');
  
  export default {
    name: "moreReport",
    components: {
      myTopSearch,
      myToggle,
    },
    data() {
      return {
        toggleIndex: 0,
        reportPage:1,
        reportLimit:10,
        total: 10,
        reportList:[],
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
      this.acquireReportList()
    },
    watch: {},
    computed: {},
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
          let likeInfo=_.find(this.caseList,function (o) {
            return o.id===val
          });
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
              likeInfo.shopcart_id=res.data._id;
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
      //获取诊断报告列表
      acquireReportList() {
        axios({
          method: "GET",
          url: `${baseURL}/v1/asset/diagnoseReport?page=${this.reportPage}&limit=${this.reportLimit}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          for (let v of res.data) {
            v.generate_time = utils.formatDate(new Date(v.generate_time), "yyyy-MM-dd hh:mm:ss");
          }
          this.reportList = res.data;
        }).catch((err) => {
          console.log(err)
        })
      },
      getReportDetails(val){
        this.$store.commit("changeReportDetails", _.find(this.reportList, function (o) {
          return o.id === val
        }));
      },
      handleCurrentChange(val){
        this.reportPage=val;
        this.acquireReportList()
      },
      addCollection(){
        this.$store.commit("addCollection")
      },
      subtractCollection(){
        this.$store.commit("subtractCollection")
      },
      buy(val){
        if(JSON.parse(sessionStorage.getItem("loginInfo"))){
          let buyInfoObj=_.find(this.reportList,function (o) {
            return o.id===val
          });
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
  }
</script>

<style scoped lang="stylus">
  .moreReport{
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
    .report_list {
      width 1212px
      margin 0 auto
      padding-top 30px
      .fr_report {
        margin 0 auto
        margin-bottom 18px
        position relative
        box-sizing border-box
        width 1198px
        height 220px
        background-color rgba(255, 255, 255, 0.8)
        /*opacity: 0.8;*/
        padding 15px 20px
        h4 {
          width 1060px
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          a {
            color: #222222;
            font-size: 20px;
          }
        }
        .attestation {
          width 800px
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
            margin-top 14px
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
        .putaway {
          padding-bottom 20px
          font-size 0
          a {
            display inline-block
            padding-left 26px
            padding-top 2px
            padding-bottom 2px
            color #666666;
            font-size 14px
            margin-right 34px
            background-repeat: no-repeat;
            background-position: top left;
            line-height 22px
            span {
              color #222222;
              font-size 16px
            }
          }
          .time {
            background-image: url('./images/time.png');
            width 250px
          }
          .data{
            background-image: url('./images/data.png');
          }
          .vin{
            background-image: url('./images/vin.png');
            width 250px
          }
          .breakdown{
            background-image: url('./images/breakdown.png');
            width 140px
          }
          .equity {
            background-image: url('./images/Profit.png');
          }
        }
        .belong{
          a{
            display block
            line-height 22px
            padding-left 26px
            background-image: url('./images/person.png');
            background-repeat: no-repeat;
            background-position: top left;
            color #666666;
            font-size 14px;
            span{
              color #222222;
              font-size 16px
            }
          }
        }
        .fault {
          p {
            padding-top 4px
            width 562px
            height 54px
            line-height 18px
            a {
              color #666666;
              font-size 14px
              display block
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              span:first-child {
                font-size 16px
                color #222222;
              }
            }
          }
        }
        .dislike {
          position absolute
          top 15px
          right 30px
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
          top 15px
          right 30px
          height 20px
          line-height 20px
          color: #c6351e;
          cursor pointer
          padding-left 26px
          background-image: url('./images/like.png');
          background-repeat: no-repeat;
          background-position: top left;
        }
        .price_box {
          position absolute
          top 78px
          left 1000px
          .price {
            min-width 18px
            height 24px
            font-size: 24px;
            color: #c6351e;
            background-image: url('./images/currency.png');
            background-repeat: no-repeat;
            background-position: top left;
            padding-left 26px
            margin-bottom 8px
          }
          .tracing {
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
          .buy {
            width 114px
            height 36px
            background-color #c6351e
            color #ffffff
            font-size 18px
            line-height 36px
            text-align center
          }
        }
        .bar{
          width 10px
          height 100%
          background-color #e25d07
          position absolute
          top 0
          right 0
        }
      }
      .fr_report:hover{
        box-shadow: 0px 0px 13px 1px rgba(218, 44, 89, 0.4);
      }
    }
  }
</style>
