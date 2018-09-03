<template>
  <div class="home">
    <my-topSearch></my-topSearch>
    <my-toggle :toggleIndex="toggleIndex"></my-toggle>
    <div class="carousel">
      <el-carousel :interval="3000" arrow="always">
        <el-carousel-item v-for="item in bannerList" :key="item.link_url">
          <a :href="item.link_url" target="_blank"><img :src="item.picture_url" alt=""></a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="list">
      <div class="headline" style="margin-top: 30px">
        <p></p>
        <span>诊断报告</span>
        <p></p>
      </div>
      <div class="report clearfix">
        <div class="fl fl_bg">
          <h3>诊断报告</h3>
          <a href="/moreReport">查看更多</a>
        </div>
        <div class="fr fr_report" v-for="(item,index) of reportList" :key="item.id" >
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
          <!--<div class="belong">
            <a href="/reportDetails" @click="getReportDetails(item.id)"><span>所属人：</span>{{item.assetowner}}</a>
          </div>-->
          <!--<div class="fault">
            <p>
              <a href="/caseDetails" @click="getCaseDetails(item.id)">
                <span>故障现象：</span>{{item.assetcontent}}
              </a>
            </p>
          </div>-->
          <div class="price_box">
            <a href="/reportDetails" @click="getReportDetails(item.id)"><p class="price">{{item.price}}</p></a>
            <a href="/reportDetails" @click="getReportDetails(item.id)"><p class="tracing">可信溯源</p></a>
          </div>
          <div class="bar"></div>
        </div>
      </div>
      <div class="headline">
        <p></p>
        <span>维修设备</span>
        <p></p>
      </div>
      <div class="facility clearfix">
        <div class="fl fl_bg">
          <h3>维修设备</h3>
          <a href="/moreFacility">查看更多</a>
        </div>
        <div class="fr fr_facility">
          <div class="fl facility_info" v-for="(item,index) of facilityList" :key="item.id">
            <a href="/facilityDetails" @click="getFacilityDetails(item.id)"><h4>{{item.assetname}}</h4></a>
            <div class="belong">
              <a href="/facilityDetails" @click="getFacilityDetails(item.id)">
                <span>所属人：</span>{{item.assetowner}}
              </a>
            </div>
            <div class="putaway">
              <a class="time" href="/facilityDetails" @click="getFacilityDetails(item.id)"><span>上架时间：</span>{{item.sell_at}}</a>
              <a class="equity" href="/facilityDetails" @click="getFacilityDetails(item.id)"><span>权益：</span>{{item.sell_type}}</a>
            </div>
            <div class="fl price_box">
              <a href="/facilityDetails" @click="getFacilityDetails(item.id)"><p class="price">{{item.price}}</p></a>
              <a href="/facilitySource" @click="getFacilitySource(item.id)"><p class="tracing">可信溯源</p></a>
            </div>
            <div class="fr facility_img">
              <a href="/facilityDetails" @click="getFacilityDetails(item.id)"><img :src="item.asseturl" alt=""></a>
            </div>
            <div class="attestation clearfix">
              <span class="merchant" v-if="item.authtype==='认证商家'">{{item.authtype}}</span>
              <span class="person" v-if="item.authtype==='认证个人'">{{item.authtype}}</span>
              <span class="trust" v-if="item.creditlevel!=='未认证'">{{item.creditlevel}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="headline">
        <p></p>
        <span>维修案例</span>
        <p></p>
      </div>
      <div class="case clearfix">
        <div class="fl fl_bg">
          <h3>维修案例</h3>
          <a href="/moreCase">查看更多</a>
        </div>
        <div class="fr fr_case" v-for="(item,index) of caseList" :key="item.id">
          <h4><a href="/caseDetails" @click="getCaseDetails(item.id)">{{item.assetname}}</a></h4>
          <div class="attestation">
            <span class="merchant" v-if="item.authtype==='认证商家'">{{item.authtype}}</span>
            <span class="person" v-if="item.authtype==='认证个人'">{{item.authtype}}</span>
            <span class="trust" v-if="item.creditlevel!=='未认证'">{{item.creditlevel}}</span>
          </div>
          <div class="putaway">
            <a class="time" href="/caseDetails" @click="getCaseDetails(item.id)"><span>上架时间：</span>{{item.sell_at}}</a>
            <a class="equity" href="/caseDetails" @click="getCaseDetails(item.id)"><span>权益：</span>{{item.sell_type}}</a>
          </div>
          <div class="belong">
            <a href="/caseDetails" @click="getCaseDetails(item.id)">
              <span>所属人：</span>{{item.assetowner}}
            </a>
          </div>
          <div class="fault">
            <p>
              <a href="/caseDetails" @click="getCaseDetails(item.id)">
                <span>故障现象：</span>{{item.assetcontent}}
              </a>
            </p>
          </div>
          <div class="price_box">
            <a href="/caseDetails" @click="getCaseDetails(item.id)"><p class="price">{{item.price}}</p></a>
            <a href="/caseSource" @click="getCaseSource(item.id)"><p class="tracing">可信溯源</p></a>
          </div>
          <div class="bar"></div>
        </div>
      </div>
      <div class="partner clearfix">
        <div class="fl fl_bg">
          <h3>合作伙伴</h3>
        </div>
        <div class="fr fr_partner">
          <div class="fl partner_img">
            <img src="./images/06.png" alt="">
          </div>
          <div class="fl partner_img">
            <img src="./images/06.png" alt="">
          </div>
          <div class="fl partner_img">
            <img src="./images/06.png" alt="">
          </div>
          <div class="fl partner_img">
            <img src="./images/07.png" alt="">
          </div>
          <div class="fl partner_img">
            <img src="./images/07.png" alt="">
          </div>
          <div class="fl partner_img">
            <img src="./images/07.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import _ from "lodash";
  import {baseURL, cardURL} from '@/common/js/public.js';
  import utils from "@/common/js/utils.js";
  import myTopSearch from "../topSearch/topSearch"
  import myToggle from "../toggle/toggle"
  
  export default {
    name: "home",
    components: {
      myTopSearch,
      myToggle,
    },
    data() {
      return {
        reportPage:1,
        reportLimit:3,
        casePage: 1,
        caseLimit: 3,
        facilityPage: 1,
        facilityLimit: 6,
        reportList:[],
        caseList: [],
        facilityList: [],
        userId: "",
        token: "",
        //用webpack搭建的项目不能直接使用绝对路径，要用require，如果不使用这个，必须是线上图片。http类型的
        bannerList: [
          {link_url: 'javascript:void(0)', picture_url: require('./images/banner.png')},
          {link_url: '/publicityPage', picture_url: require('./images/banner_002.png')},
        ],
        toggleIndex: 0,
      }
    },
    mounted() {
      this.acquireReportList();
      this.acquireCaseList();
      this.acquireFacilityList();
      //获取banner图
      axios({
        method: 'get',
        url: `${cardURL}/v1/broadcast/s?type_id=5b572fa8a4cc0d6ea8ba5484`
      }).then(res => {
        this.bannerList = res.data
      }).catch(error => {
        console.log(error)
      });
    },
    watch: {},
    computed: {},
    methods: {
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
      //获取维修设备列表
      acquireFacilityList() {
        axios({
          method: "GET",
          url: `${baseURL}/v1/asset/device?page=${this.facilityPage}&limit=${this.facilityLimit}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          for (let v of res.data.data) {
            v.sell_at = utils.formatDate(new Date(v.sell_at), "yyyy-MM-dd hh:mm:ss");
          }
          this.facilityList = res.data.data
        }).catch((err) => {
        })
      },
      //获取维修案例列表
      acquireCaseList() {
        axios({
          method: "GET",
          url: `${baseURL}/v1/asset/casus?page=${this.casePage}&limit=${this.caseLimit}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          for (let v of res.data.data) {
            v.sell_at = utils.formatDate(new Date(v.sell_at), "yyyy-MM-dd hh:mm:ss");
          }
          this.caseList = res.data.data;
        }).catch((err) => {
          console.log(err)
        })
      },
      getCaseDetails(val) {
        this.$store.commit("changeCaseDetails", _.find(this.caseList, function (o) {
          return o.id === val
        }));
      },
      getCaseSource(val) {
        this.$store.commit("changeCaseSource", _.find(this.caseList, function (o) {
          return o.id === val
        }));
      },
      getFacilityDetails(val) {
        this.$store.commit("changeFacilityDetails", _.find(this.facilityList, function (o) {
          return o.id === val
        }));
      },
      getFacilitySource(val) {
        this.$store.commit("changeFacilitySource", _.find(this.facilityList, function (o) {
          return o.id === val
        }));
      },
      getReportDetails(val){
        this.$store.commit("changeReportDetails", _.find(this.reportList, function (o) {
          return o.id === val
        }));
      },
    },
  }
</script>

<style scoped lang="stylus">
  .home {
    /*    .banner {
          box-sizing border-box
          height 600px
          background-image: url('./images/banner.png');
          background-position: top center;
          background-repeat: no-repeat;
          background-size: cover;
          !*background-size:contain;*!
          !*background-size:auto;*!
        }*/
    .list {
      width 1212px
      margin 0 auto
      padding-bottom 88px
      .headline {
        font-size 0;
        color: #333333;
        text-align center
        height 22px
        line-height 22px
        margin-bottom 30px
        p {
          display inline-block
          width: 40px;
          height: 2px;
          background-color: #333333
          vertical-align middle
        }
        span {
          font-family: PangMenZhengDao;
          font-size: 22px;
          display inline-block
          padding 0 15px
          vertical-align middle
        }
      }
      .fl_bg {
        width 346px
        background-position: top center;
        background-repeat: no-repeat;
        text-align center
        h3 {
          color #ffffff
          font-size 30px
          margin 285px 80px 18px 96px
          padding 20px
          border 1px solid #ffffff
        }
        a {
          padding 5px 0
          color #ffffff
          border-bottom 1px solid #ffffff
        }
      }
      .report {
        .fl_bg {
          height 734px
          background-image: url('./images/04.png');
        }
        .fr_report {
          margin 0 auto
          margin-bottom 18px
          position relative
          box-sizing border-box
          width 854px
          height 220px
          background-color rgba(255, 255, 255, 0.8)
          /*opacity: 0.8;*/
          padding 15px 20px
          h4 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            a {
              color: #222222;
              font-size: 20px;
            }
          }
          .attestation {
            box-sizing border-box
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
          .belong {
            a {
              display block
              line-height 22px
              padding-left 26px
              background-image: url('./images/person.png');
              background-repeat: no-repeat;
              background-position: top left;
              color #666666;
              font-size 14px;
              span {
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
          .price_box {
            position absolute
            top 78px
            left 700px
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
          box-shadow: 0px 0px 9px 1px rgba(0, 0, 0, 0.34);
        }
      }
      .facility {
        .fl_bg {
          height 734px
          background-image: url('./images/02.png');
        }
        .fr_facility {
          width 854px
          .facility_info {
            margin-bottom 20px
            margin-right 12px
            box-sizing border-box
            width 276px
            height 340px
            padding 22px 15px 0
            background-color #ffffff
            h4 {
              color: #222222;
              font-size: 18px;
              height 40px
              line-height 20px
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            .belong {
              a {
                width 210px
                display block
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                line-height 22px
                padding-left 26px
                background-image: url('./images/person.png');
                background-repeat: no-repeat;
                background-position: top left;
                color #666666;
                font-size 14px;
                span {
                  color #222222;
                  font-size 16px
                }
              }
            }
            .putaway {
              margin-top 12px
              a {
                display block
                padding-left 26px
                padding-top 2px
                padding-bottom 2px
                color #666666;
                font-size 14px
                background-repeat: no-repeat;
                background-position: top left;
                span {
                  color #222222;
                  font-size 16px
                }
              }
              .time {
                background-image: url('./images/time.png');
                padding-bottom 12px
              }
              .equity {
                background-image: url('./images/Profit.png');
              }
            }
            .price_box {
              margin-top 43px
              .price {
                a {
                  display block
                }
                min-width 18px
                height 24px
                font-size: 24px;
                color: #c6351e;
                background-image: url('./images/currency.png');
                background-repeat: no-repeat;
                background-position: top left;
                padding-left 26px
                margin-bottom 10px
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
              }
            }
            .facility_img {
              display: table-cell;
              vertical-align: middle;
              text-align: center;
              img {
                vertical-align: middle;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                max-width 90px
                max-height 90px
              }
              a {
                display block
                width 92px
                height 92px
                border 1px solid #eeeeee
              }
            }
            .attestation {
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
                margin-top 30px
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
          }
          .facility_info:nth-child(3n) {
            margin-right 0
          }
          .facility_info:hover {
            box-shadow: -1px 1px 25px 2px rgba(98, 98, 98, 0.19);
          }
        }
      }
      .case {
        .fl_bg {
          height 734px
          background-image: url('./images/01.png');
        }
        .fr_case {
          margin-bottom 18px
          position relative
          box-sizing border-box
          width 854px
          height 220px
          background-color rgba(255, 255, 255, 0.8)
          padding 15px 20px
          h4 {
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
            a {
              padding-left 26px
              padding-top 2px
              padding-bottom 2px
              color #666666;
              font-size 14px
              margin-right 43px
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
            }
            .equity {
              background-image: url('./images/Profit.png');
            }
          }
          .belong {
            a {
              display block
              line-height 22px
              padding-left 26px
              background-image: url('./images/person.png');
              background-repeat: no-repeat;
              background-position: top left;
              color #666666;
              font-size 14px;
              span {
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
          .price_box {
            position absolute
            top 78px
            left 700px
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
            }
          }
          .bar{
            width 10px
            height 100%
            background-color #ff3b0b
            position absolute
            top 0
            right 0
          }
        }
        .fr_case:hover{
          box-shadow: 2px 1px 17px 1px rgba(98, 98, 98, 0.28);
        }
      }
      .partner {
        .fl_bg {
          height 330px
          background-image: url('./images/cooperation.png');
          background-position: top left 16px;
          h3 {
            margin-top 132px
          }
        }
        .fr_partner {
          width 854px
          .partner_img {
            box-sizing border-box
            background-color: #ffffff;
            margin-bottom 14px
            margin-right 12px
            display: table-cell;
            width: 276px;
            height: 158px;
            vertical-align: middle;
            text-align: center;
            img {
              vertical-align: middle;
              position: relative;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          .partner_img:nth-child(3n) {
            margin-right 0
          }
        }
      }
      
    }
    
  }
</style>
<style lang="stylus">
  .carousel {
    max-width 1920px
    //min-width 1212px
    height 600px
    margin 0 auto
    .el-carousel {
      width 100%
      height 100%
      .el-carousel__container {
        width 100%
        height 100%
        .el-carousel__arrow {
          width: 50px;
          height: 50px;
          font-size: 30px;
        }
        .el-carousel__item {
          width 100%
          height 100%
          text-align center
          a {
            img {
              width: 1920px;
              height 600px
              /*Firefox*/
              margin: 0 -moz-calc(50% - 1212px);
              /*chrome safari*/
              margin: 0 -webkit-calc(50% - 1212px);
              /*Standard */
              margin: 0 calc(50% - 1212px);
            }
          }
        }
      }
      .el-carousel__indicators {
        .el-carousel__indicator {
          padding: 20px 6px;
          .el-carousel__button {
            width: 36px;
          }
        }
      }
    }
  }
  
</style>
