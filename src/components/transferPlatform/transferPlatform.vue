<template>
  <div class="transferPlatform">
    <div class="carousel">
      <!--<el-carousel :interval="3000" arrow="never" indicator-position="none">-->
      <el-carousel :interval="3000" arrow="always">
        <el-carousel-item v-for="item in bannerList" :key="item.link_url">
          <a :href="item.link_url"><img :src="item.picture_url" alt=""></a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="tabs_nav">
      <ul class="tabs">
        <li class="tabs_li" v-for="(item,index) of tabsParam" @click="toggleTabs(index)" :class="{active:index!=nowIndex}">{{item}}</li>
      </ul>
    </div>
    <div class="tabs_content" v-show="nowIndex===0">
      <ul class="content">
        <li v-for="item of propertyList" :key="item.packageId" @click="getPropertyDetails(item.id)">
          <div class="content_img">
            <img :src="item.url" alt="">
          </div>
          <h4 class="content_title">{{item.name}}</h4>
          <my-progressBar :percentage="item.percentage"></my-progressBar>
          <p class="price">&yen;{{item.total_amount}}&nbsp;<span>起</span></p>
        </li>
      </ul>
    </div>
    <div class="tabs_content" v-show="nowIndex===1">
      <ul class="content">
        <li v-for="item of finishedList" :key="item.id">
          <div class="content_img">
            <img :src="item.url" alt="">
          </div>
          <h4 class="content_title">{{item.name}}</h4>
          <my-progressBar :percentage="item.percentage"></my-progressBar>
          <p class="price">&yen;{{item.total_amount}}&nbsp;<span>起</span></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import _ from "lodash";
  import {baseURL, cardURL} from '@/common/js/public.js';
  import utils from "@/common/js/utils.js";
  import myProgressBar from "../progressBar/progressBar"
  
  export default {
    name: "transferPlatform",
    components: {
      myProgressBar,
    },
    data() {
      return {
        bannerList: [
          {link_url: 'javascript:void(0)', picture_url: require('./images/01.png')},
        ],
        tabsParam: ["最新上线", "已结束"],
        nowIndex: 0,
        percentage: 75,
        propertyList: [],
        propertySum: 0,
        finishedList:[],
        finishedSum: 0,
        toggleIndex:1,
      }
    },
    created() {
    },
    mounted() {
      this.acquirePropertyList();
      this.acquireFinishedList();
    },
    watch: {},
    computed: {},
    methods: {
      toggleTabs(index) {
        this.nowIndex = index;
      },
      acquirePropertyList() {
        axios({
          method: "GET",
          url: `${cardURL}/v1/assets-transfer/package/status?status=0`,
          headers: {
            "Content-Type": "application/json",
            "charset":"UTF-8",
          }
        }).then((res) => {
          for (let v of res.data.data) {
            v.complete_time = utils.formatDate(new Date(v.complete_time), "yyyy-MM-dd hh:mm:ss");
            v.online_time = utils.formatDate(new Date(v.online_time), "yyyy-MM-dd hh:mm:ss");
            v.percentage=utils.divide(v.complete_amount,v.total_amount)*100
          }
          this.propertyList = res.data.data;
          this.propertySum = res.data.count
        }).catch((err) => {
        })
      },
      acquireFinishedList() {
        axios({
          method: "GET",
          url: `${cardURL}/v1/assets-transfer/package/status?status=1`,
          headers: {
            "Content-Type": "application/json",
            "charset":"UTF-8",
          }
        }).then((res) => {
          for (let v of res.data.data) {
            v.complete_time = utils.formatDate(new Date(v.complete_time), "yyyy-MM-dd hh:mm:ss");
            v.online_time = utils.formatDate(new Date(v.online_time), "yyyy-MM-dd hh:mm:ss");
            v.percentage=utils.divide(v.complete_amount,v.total_amount)*100
          }
          this.finishedList = res.data.data;
          this.finishedSum = res.data.count
        }).catch((err) => {
        })
      },
      getPropertyDetails(val){
        this.$store.commit("changePropertyDetails", _.find(this.propertyList, function (o) {
          return o.id === val
        }));
        //this.$router.push("/transferDetails")
        window.open("/transferDetails","_blank")
      },
    },
  }
</script>

<style scoped lang="stylus">
  .transferPlatform {
    .tabs_nav {
      width 1212px
      margin 0 auto
      .tabs {
        width 1200px
        margin 20px auto
        font-size 0
        background-color: #ffffff;
        box-shadow: 0px 4px 17px 1px rgba(98, 98, 98, 0.24);
        .tabs_li {
          box-sizing border-box
          display inline-block
          width 160px
          height 50px
          line-height 50px
          font-size 16px
          color #ffffff
          background-color: #d91e01;
          cursor pointer
          text-align center
        }
        .active {
          background-color: #ffffff;
          color #d91e01
        }
      }
    }
    .tabs_content {
      box-sizing border-box
      width 1212px
      margin 0 auto
      padding 0 6px;
      .content {
        width 1198px
        margin 0 auto
        font-size: 0;
        li {
          box-sizing border-box
          display inline-block
          width 280px
          height 370px
          margin-right 26px
          margin-bottom 16px
          background-color #ffffff
          font-size: 14px;
          color: #000033;
          cursor pointer
          vertical-align middle
          padding 10px
          .content_img {
            width 260px
            height 260px
            display: table-cell;
            text-align center
            img {
              vertical-align: middle;
              position: relative;
              top: 50%;
              transform: translateY(-50%);
              max-width 260px
              max-height 260px
            }
          }
          .content_title {
            color: #000033
            font-size 14px
            line-height 34px
            text-indent 2px
            margin-bottom 16px
          }
          .price {
            margin-top 7px
            font-size 16px
            color #e90031;
            line-height 26px
            span {
              font-size: 12px;
              color: #666666;
            }
          }
        }
        li:nth-child(4n) {
          margin-right 0
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
