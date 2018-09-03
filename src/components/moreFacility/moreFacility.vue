<template>
  <div class="moreFacility">
    <my-topSearch></my-topSearch>
    <my-toggle :toggleIndex="toggleIndex"></my-toggle>
    <div class="site_box">
      <div class="site">
        <ul>
          <li>当前位置 ：</li>
          <li><a href="/">首页</a></li>
          <li>&nbsp;>&nbsp;</li>
          <li><a href="/moreCase">维修设备</a></li>
        </ul>
      </div>
    </div>
    <div class="facility_list">
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
    <div class="clearfix paging">
      <el-pagination class="my_paging"
                     layout="prev, pager, next"
                     :background=true
                     :total=total
                     :page-size=facilityLimit
                     :current-page.sync=facilityPage
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
  import utils from "@/common/js/utils.js";
  import myTopSearch from "../topSearch/topSearch"
  import myToggle from "../toggle/toggle"
  
  export default {
    name: "moreFacility",
    data() {
      return {
        toggleIndex: 0,
        facilityPage: 1,
        facilityLimit: 12,
        total:12,
        facilityList: [],
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
      this.acquireFacilityList();
    },
    methods: {
      acquireFacilityList() {
        if(JSON.parse(sessionStorage.getItem("loginInfo"))){
          axios({
            method: "GET",
            url: `${baseURL}/v1/asset/device?page=${this.facilityPage}&limit=${this.facilityLimit}&userid=${this.userId}`,
            headers: {
              "Content-Type": "application/json",
            }
          }).then((res) => {
            for(let v of res.data.data){
              v.sell_at=utils.formatDate(new Date(v.sell_at), "yyyy-MM-dd hh:mm:ss");
            }
            this.total=res.data.count;
            this.facilityList = res.data.data
          }).catch((err) => {
            console.log(err)
          })
        }else {
          axios({
            method: "GET",
            url: `${baseURL}/v1/asset/device?page=${this.facilityPage}&limit=${this.facilityLimit}`,
            headers: {
              "Content-Type": "application/json",
            }
          }).then((res) => {
            for(let v of res.data.data){
              v.sell_at=utils.formatDate(new Date(v.sell_at), "yyyy-MM-dd hh:mm:ss");
            }
            this.total=res.data.count;
            this.facilityList = res.data.data
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      handleCurrentChange(val){
        this.facilityPage=val;
        this.acquireFacilityList();
      },
      getFacilityDetails(val) {
        this.$store.commit("changeFacilityDetails",_.find(this.facilityList,function (o) {
          return o.id===val
        }));
      },
      getFacilitySource(val) {
        this.$store.commit("changeFacilitySource",_.find(this.facilityList,function (o) {
          return o.id===val
        }));
      },
    },
    components: {
      myTopSearch,
      myToggle
    },
  }
</script>

<style scoped lang="stylus">
  .moreFacility {
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
    .facility_list {
      padding-top 36px
      width 1212px
      margin 0 auto
      .facility_info {
        margin-bottom 20px
        margin-right 22px
        box-sizing border-box
        width 286px
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
        .belong{
          a{
            width 210px
            display block
            text-overflow:ellipsis;
            white-space:nowrap;
            overflow:hidden;
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
      .facility_info:nth-child(4n) {
        margin-right 0
      }
      .facility_info:hover {
        box-shadow: -1px 1px 25px 2px rgba(98, 98, 98, 0.19);
      }
    }
  }
</style>
