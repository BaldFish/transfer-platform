<template>
  <div class="facilitySource">
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
      <h4>{{facilityDetails.assetname}}</h4>
      <div :class="facilityDetails.shopcart_id?'like':'dislike'" @click="toggleLike(facilityDetails.id)">收藏</div>
      <div class="transfer_record">
        <span>资产转让记录</span>
        <ul v-for="(item,index) of facilitySource" :key="item.id">
          <li>
            <span>交易发起方</span>
            <span>：{{item.from}}</span>
          </li>
          <li>
            <span>交易接收方</span>
            <span>：{{item.to}}</span>
          </li>
          <li>
            <span>交易价格</span>
            <span>：{{item.price}}</span>
          </li>
          <li>
            <span>交易时间</span>
            <span>：{{item.updated_at}}</span>
          </li>
        </ul>
        <a href="/facilityDetails" @click="getFacilityDetails"><p class="asset_details">案例详情</p></a>
        <a href="javascript:void(0)" @click="buy(facilityDetails.id)"><p class="buy">一键购买</p></a>
      </div>
      <div class="use_record">
        <span>资产使用记录</span>
        <ul v-for="(item,index) of usageRecord" :key="item.id">
          <li>
            <span>资产ID</span>
            <span>：{{item.asset_id}}</span>
          </li>
          <li>
            <span>记录名称</span>
            <span>：{{item.name}}</span>
          </li>
          <li>
            <span>记录内容</span>
            <span>：{{item.content}}</span>
          </li>
          <li>
            <span>记录哈希</span>
            <span>：{{item.record_hash}}</span>
          </li>
          <li>
            <span>交易哈希</span>
            <span>：{{item.txn_hash}}</span>
          </li>
          <li>
            <span>记录时间</span>
            <span>：{{item.updated_at}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import myTopSearch from "../topSearch/topSearch"
  import myToggle from "../toggle/toggle"
  import {baseURL, cardURL} from '@/common/js/public.js';
  import utils from "@/common/js/utils.js";
  const querystring = require('querystring');
  
  export default {
    name: "facilitySource",
    data() {
      return {
        toggleIndex: 0,
        facilityDetails: {},
        facilitySourceTitle: "",
        facilitySource: [],
        usageRecord: [],
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
      this.assetId = JSON.parse(sessionStorage.getItem("facilitySource")).assetid;
      this.apiKey = JSON.parse(sessionStorage.getItem("facilitySource")).apikey;
      this.acquireFacilityDetails();
      this.acquireFacilitySource();
      this.acquireUsageRecord();
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
          let likeInfo=this.facilityDetails;
          this.userId=JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
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
      acquireFacilitySource() {
        axios({
          method: "GET",
          url: `${cardURL}/v1/transed-asset/${this.assetId}/apikey/${this.apiKey}?page=0&limit=1000000`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          if (res.data.data != []) {
            for(let v of res.data.data){
              v.updated_at=utils.formatDate(new Date(v.updated_at), "yyyy-MM-dd hh:mm:ss");
            }
            this.facilitySource = res.data.data
          } else {
            this.facilitySource = []
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      acquireUsageRecord() {
        axios({
          method: "GET",
          url: `${cardURL}/v1/used-asset/${this.assetId}/apikey/${this.apiKey}?page=0&limit=1000000`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          if (res.data.data != null) {
            for(let v of res.data.data){
              v.updated_at=utils.formatDate(new Date(v.updated_at), "yyyy-MM-dd hh:mm:ss");
            }
            this.usageRecord = res.data.data
          } else {
            this.usageRecord = []
          }
        }).catch((err) => {
          console.log(err);
        });
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
            }
            this.facilityDetails=res.data
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
            }
            this.facilityDetails=res.data
          }).catch((err) => {
            console.log(err);
          })
        }
      },
      getFacilityDetails(val) {
        this.$store.commit("changeFacilityDetails",this.facilityDetails);
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
          var data={};
          if(this.facilityDetails.sell_type==="收益权"){
            if(this.num===0){
              this.openLimited()
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
  .facilitySource {
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
      .transfer_record {
        box-sizing border-box
        min-height 218px
        padding 20px 30px
        background-color #ffffff
        border 1px solid #bfbfbf;
        margin-top 30px
        margin-bottom 20px
        position relative
        span {
          display inline-block
          font-size 18px
          height 18px
          line-height 18px
          color #000000
          margin-bottom 10px
        }
        ul {
          padding 8px 0
          li {
            line-height 20px
            font-size 0
            span {
              display inline-block
              font-size 16px
              vertical-align top
              color: #666666;
              margin-bottom 0px
            }
            span:first-child {
              width 96px
              color: #333333;
            }
          }
        }
        .asset_details {
          box-sizing border-box
          position absolute
          top 70px
          right 60px
          width 170px
          height 54px
          background-color #ffffff
          border 1px solid #c6351e
          color #c6351e;
          font-size 22px
          line-height 54px
          text-align center
        }
        .buy {
          position absolute
          top 134px
          right 60px
          width 170px
          height 54px
          background-color #c6351e
          color #ffffff
          font-size 22px
          line-height 54px
          text-align center
        }
      }
      .use_record {
        box-sizing border-box
        min-height 218px
        padding 20px 30px
        background-color #ffffff
        border 1px solid #bfbfbf;
        margin-top 30px
        margin-bottom 70px
        span {
          display inline-block
          font-size 18px
          //height 18px
          color #000000
          margin-bottom 10px
        }
        ul {
          padding 8px 0
          li {
            font-size 0
            padding 2px 0
            span {
              display inline-block
              font-size 16px
              vertical-align top
              color: #666666;
              margin-bottom 0px
              width 900px
              word-break: break-all;
              word-wrap: break-word;
            }
            span:first-child {
              width 86px
              color: #333333;
            }
          }
        }
      }
    }
  }
</style>
