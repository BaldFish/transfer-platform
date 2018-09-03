<template>
  <div>
    <my-topSearch></my-topSearch>
    <my-toggle :nowIndex=1></my-toggle>
    <div class="goods-container">
      <div class="goods-banner">
        <img class="show-img" :src="activeImg" alt="">
        <div class="banner-box">
          <span class="prev" @click="prevImg"></span>
          <div class="img-list">
            <ul v-bind:style="{right: toRight + 'px' }">
              <li v-for="item in bannerList" @click="showImg(item.url)">
                <input type="radio" name="showImg">
                <img :src="item.url" alt="">
              </li>
            </ul>
          </div>
          <span class="next" @click="nextImg"></span>
        </div>
      </div>
      <div class="goods-buy">
        <p class="goods-title">{{propertyDetails.name}}</p>
        <div class="goods-logo">
          <a href="/seller">
            <span>LAUNCH</span>
            <span>卖家</span>
          </a>
        </div>
        <div class="goods-details">
          <ul>
            <li class="price">
              <span class="triangle_border_nw"></span>
              <label>认购金额：</label>
              <span class="money">￥{{singleGood.price}}</span>
            </li>
            <li class="goods-list">
              <label>选择设备：</label>
              <ul class="goods-list-radio">
                <li v-for="item in goodsList" @click="getSingleGood(item)">
                  <input type="radio" name="radio" :disabled="item.status == 1?true:false" :checked="item.isChecked">
                  <div class="radio-box">
                    <img :src="item.url" alt="">
                    <p>{{item.name}}</p>
                  </div>
                </li>
              </ul>
              <div style="clear: both"></div>
            </li>
            <li class="number">
              <label>总份数：</label>
              <span class="total-num">{{singleGood.total_number}}</span>
              <label class="rest">已售：</label>
              <span>{{singleGood.complete_number}}</span>
            </li>
            <li class="number">
              <label>购买：</label>
              <template>
                <el-input-number v-model="num" size="mini" controls-position="right" @change="handleChange" :min="min" :max="max"></el-input-number>
              </template>
              <!--<label class="rest">剩余：</label>
              <span>{{max}}/{{singleGood.total_number}}</span>-->
            </li>
            <li class="progress">
              <label>当前进度：</label>
              <my-progressBar :percentage="propertyDetails.percentage"></my-progressBar>
            </li>
          </ul>
          <div style="clear: both"></div>
          <div class="btn">
            <!--<button type="button">收藏</button>-->
            <button type="button" @click="buy(singleGood)">认购</button>
          </div>
        </div>
      </div>
    </div>
    <div class="assets-container">
      <div class="tabs_nav">
        <ul class="tabs">
          <li @click="tabChange" :class="{'nav-avtive': isShow}">资产介绍</li>
          <li @click="tabChange" :class="{'nav-avtive': !isShow}">认购列表</li>
        </ul>
      </div>
      <div class="assets-table" v-if="isShow">
        <table class="table">
          <thead>
          <tr>
            <th><span class="dot"></span>资产名称</th>
            <th><span class="dot"></span>资产总额</th>
            <th><span class="dot"></span>状态</th>
            <th><span class="dot"></span>上链信息</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in goodsList">
            <td>{{item.name}}</td>
            <td>{{item.price * item.total_number}}元</td>
            <td>{{item.status==1?'已售出':'未售出'}}</td>
            <td @click="checkAssetsDetail(item)">查看</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="offer-list" v-else>
        <table class="table">
          <thead>
          <tr>
            <th><span class="dot"></span>帐号</th>
            <th><span class="dot"></span>设备名称</th>
            <th><span class="dot"></span>份数</th>
            <th><span class="dot"></span>金额</th>
            <th><span class="dot"></span>时间</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in recordList">
            <td>{{item.created_by}}</td>
            <td>{{item.assetname}}</td>
            <td>{{item.count}}</td>
            <td>{{item.price}}元</td>
            <td>{{item.updated_at}}</td>
          </tr>
          </tbody>
        </table>
        <div class="clearfix paging">
          <el-pagination class="my_paging"
                         layout="prev, pager, next"
                         :background=true
                         :total=total
                         :page-size=pageSize
                         :current-page.sync=currentPage
                         @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
    </div>
    <img class="lock" src="./images/lock.png" alt="">
    <el-dialog class="info-dialog" title="上链信息" width="760px" :visible.sync="dialogTableVisible">
      <div>
        <p class="title">资产详情</p>
        <div class="details-container">
          <img :src="facilityDetails.asseturl" alt="">
          <div class="box1-tips">
            <span class="merchant" v-if="facilityDetails.authtype==='认证商家'">{{facilityDetails.authtype}}</span>
            <span class="person" v-if="facilityDetails.authtype==='认证个人'">{{facilityDetails.authtype}}</span>
            <span class="trust" v-if="facilityDetails.creditlevel!=='未认证'">{{facilityDetails.creditlevel}}</span>
          </div>
          <ul>
            <li>
              <label>资产所属人：</label>
              <span>{{facilityDetails.assetowner}}</span>
            </li>
            <li>
              <label>权益：</label>
              <span>{{facilityDetails.sell_type}}</span>
            </li>
            <li>
              <label>设备ID：</label>
              <span>{{facilityDetails.id}}</span>
            </li>
            <li>
              <label>时间：</label>
              <span>{{facilityDetails.sell_at}}</span>
            </li>
          </ul>
          <div style="clear: both"></div>
        </div>
      </div>
      <div class="record-container1">
        <p class="title">资产转让记录</p>
        <div class="scroll-box">
          <div v-for="(item,index) of assetSource" :key="item.id">
            <p>
              <label>"交易发起方" :</label>
              <span>"{{item.from}}",</span>
            </p>
            <p>
              <label>"交易接收方" :</label>
              <span>"{{item.to}}",</span>
            </p>
            <p>
              <label>"交易价格" :</label>
              <span>"{{item.price}}",</span>
            </p>
            <p>
              <label>"交易时间" :</label>
              <span>"{{item.updated_at}}",</span>
            </p>
          </div>
        </div>
      </div>
      <div class="record-container2">
        <p class="title">资产使用记录</p>
        <div class="scroll-box">
          <div v-for="(item,index) of usageRecord" :key="item.id">
            <p>
              <label>"资产ID" :</label>
              <span>"{{item.asset_id}}",</span>
            </p>
            <p>
              <label>"记录名称" :</label>
              <span>"{{item.name}}",</span>
            </p>
            <p>
              <label>"记录内容" :</label>
              <span>"{{item.content}}",</span>
            </p>
            <p>
              <label>"记录哈希" :</label>
              <span>"{{item.record_hash}}",</span>
            </p>
            <p>
              <label>"交易哈希" :</label>
              <span>"{{item.txn_hash}}"</span>
            </p>
            <p>
              <label>"记录时间": </label>
              <span>"{{item.updated_at}}"</span>
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from "axios";
  import {baseURL, cardURL} from '@/common/js/public.js';
  import myTopSearch from "../topSearch/topSearch"
  import myToggle from "../toggle/toggle"
  import myProgressBar from "../progressBar/progressBar"
  import utils from "@/common/js/utils.js";
  
  const querystring = require('querystring');
  
  export default {
    name: "transferDetails",
    data() {
      return {
        userId: "",
        apiKey: "",
        assetId: "",
        propertyDetails: {},
        percentage: 75,
        isShow: true,
        dialogTableVisible: false,
        toRight: 0,
        bannerList: [],
        goodsList: [],
        activeImg: require('./images/02.png'),
        firstCheckedIndex: 0,//第一次出现"0未完成"数组下标
        id: 1,
        singleGood: {},
        num: 1,
        min: 1,
        max: 1,
        recordList: [],
        assetSource: [],
        usageRecord: [],
        facilityDetails: {},
        total: 10,
        pageSize: 10,
        currentPage: 1,
      }
    },
    created() {
    },
    mounted() {
      //获取资产包id
      this.id = JSON.parse(sessionStorage.getItem("propertyDetails")).id;
      //商品标题&进度条包详情信息
      this.getPropertyDetails();
      //商品图片、商品列表
      this.getGoodsDetails();
      //获取认购列表
      this.getRecordList();
    },
    methods: {
      handleChange(value) {
        console.log(value);
      },
      tabChange() {
        this.isShow = !this.isShow
      },
      //上一张图
      prevImg() {
        if (this.toRight === (this.goodsList.length - 4) * 60 || this.goodsList.length <= 4) {
          return false
        } else {
          this.toRight = this.toRight + 60
        }
      },
      //下一张图
      nextImg() {
        if (this.toRight == 0) {
          return false
        } else {
          this.toRight = this.toRight - 60
        }
      },
      //展示大图
      showImg(item) {
        this.activeImg = item
      },
      //商品标题&进度条
      getPropertyDetails() {
        axios({
          method: "GET",
          url: `${cardURL}/v1/assets-transfer/package/${this.id}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          res.data.percentage = utils.divide(res.data.complete_amount, res.data.total_amount) * 100;
          this.propertyDetails = res.data;
        }).catch((err) => {
          console.log(err);
        })
      },
      //商品图片、商品列表
      getGoodsDetails() {
        axios({
          method: "GET",
          url: `${cardURL}/v1/assets-transfer/asset/packid/${this.id}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          //获取轮播数据
          this.bannerList = res.data.data;
          this.activeImg = res.data.data[0].url;
          //获取商品数据
          this.goodsList = res.data.data;
          //判断首次出现"0未完成"位置，并添加isChecked属性
          let unDoneList = [];
          this.goodsList.forEach((value) => {
            value.isChecked = false;
            if (value.total_number - value.complete_number === 0) {
              value.status = 1
            }
            if (value.status === 0) {
              unDoneList.push(value)
            }
          });
          for (let i = 0; i < this.goodsList.length; i++) {
            if (this.goodsList[i].id === unDoneList[0].id) {
              this.firstCheckedIndex = i;
            }
          }
          this.goodsList[this.firstCheckedIndex].isChecked = true;
          this.getSingleGood(this.goodsList[this.firstCheckedIndex])
        }).catch((err) => {
          console.log(err);
        })
      },
      //点击单个商品
      getSingleGood(val) {
        this.goodsList.forEach((good) => {
          good.isChecked = false;
        });
        val.isChecked = true;
        axios({
          method: "GET",
          url: `${cardURL}/v1/assets-transfer/asset/id/${val.id}/${val.apikey}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.num = 1;
          this.max = res.data.total_number - res.data.complete_number;
          this.singleGood = res.data;
        }).catch((err) => {
          console.log(err);
        })
      },
      buy(val) {
        if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
          let buyInfoObj = val;
          this.apiKey = buyInfoObj.apikey;
          this.assetId = buyInfoObj.id;
          this.userId = JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
          let data = {};
          data.account = this.userId;
          data.apikey = this.apiKey;
          data.asset_id = this.assetId;
          data.count = this.num;
          axios({
            method: "POST",
            url: `${cardURL}/v1/assets-transfer/record/insert`,
            data: querystring.stringify(data),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-Access-Token": this.token,
            }
          }).then((res) => {
            buyInfoObj = res.data;
            this.getBuy(buyInfoObj);
            this.$router.push("/checkOrder")
          }).catch((err) => {
            console.log(err);
          })
        } else {
          this.open()
        }
      },
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
      getBuy(val) {
        this.$store.commit("changeBuy", val);
      },
      //分页变化
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getRecordList();
      },
      //获取认购列表
      getRecordList() {
        axios({
          method: "GET",
          url: `${cardURL}/v1/assets-transfer/record/${this.id}/2?page=${this.currentPage}&limit=${this.pageSize}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.recordList = res.data.data;
          this.total = res.data.count;
          this.recordList.forEach((record) => {
            record.updated_at = utils.formatDate(new Date(record.updated_at), 'yyyy-MM-dd hh:mm:ss')
          })
        }).catch((err) => {
          console.log(err);
        })
      },
      //获取弹框数据
      checkAssetsDetail(item) {
        this.dialogTableVisible = true;
        let apiKey = item.apiKey;
        let id = item.id;
        //let apiKey = "5ae04522cff7cb000194f2f4";
        //let id = "9f93a461-4ece-46ea-8ff3-2b921289ab74";
        this.acquireAssetDetails(apiKey, id);
        this.acquireUsageRecord(apiKey, id);
        this.acquireAssetSource(apiKey, id);
      },
      acquireAssetDetails(apiKey, id) {
        axios({
          method: "GET",
          url: `${baseURL}/v1/asset/${apiKey}/${id}/detail`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          res.data.sell_at = utils.formatDate(new Date(res.data.sell_at), "yyyy-MM-dd hh:mm:ss");
          res.data.assetowner = res.data.assetowner.substr(0, 13) + "..." + res.data.assetowner.substr(res.data.assetowner.length - 14, 13);
          this.facilityDetails = res.data
        }).catch((err) => {
          console.log(err);
        });
      },
      acquireUsageRecord(apiKey, id) {
        axios({
          method: "GET",
          url: `${cardURL}/v1/used-asset/${id}/apikey/${apiKey}?page=0&limit=1000000`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.usageRecord = res.data.data;
          this.usageRecord.forEach((record) => {
            record.updated_at = utils.formatDate(new Date(record.updated_at), 'yyyy-MM-dd hh:mm:ss')
          })
        }).catch((err) => {
          console.log(err);
        });
      },
      acquireAssetSource(apiKey, id) {
        axios({
          method: "GET",
          url: `${cardURL}/v1/transed-asset/${id}/apikey/${apiKey}?page=0&limit=1000000`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.assetSource = res.data.data;
          this.assetSource.forEach((record) => {
            record.updated_at = utils.formatDate(new Date(record.updated_at), 'yyyy-MM-dd hh:mm:ss')
          })
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    watch: {},
    computed: {},
    components: {
      myTopSearch,
      myToggle,
      myProgressBar,
    },
  }
</script>

<style scoped lang="stylus">
  .goods-banner {
    width: 350px
    height: 425px
    float: left
    margin-left: 30px;
    margin-top: 20px;
  }
  
  .show-img {
    width: 350px;
    height: 350px;
    border: solid 1px #eeeeee;
    margin-bottom: 20px;
  }

  .show-img:hover{
    border: 1px solid red;
  }

  .banner-box {
    height: 50px;
    width: 350px
  }
  
  .img-list {
    height: 52px;
    width: 240px;
    margin-left: 60px;
    overflow: hidden;
  }
  
  .banner-box ul {
    height: 52px;
    width: 900px;
    position: relative
  }
  
  .banner-box ul li {
    float left
    width: 50px;
    height: 50px;
    border: solid 1px #eeeeee;
    margin-right 8px
    cursor pointer
  }
  
  .banner-box ul li:hover img {
    border: solid 1px #d91e01;
  }
  
  .banner-box ul li input {
    width: 50px;
    height: 50px;
    position relative;
    z-index: 60;
    cursor pointer;
    opacity 0
  }
  
  .banner-box ul li input:checked + img {
    border: solid 1px #d91e01;
  }
  
  .banner-box ul li img {
    width: 50px;
    height: 49px;
    position: relative;
    top: -52.3px;
    border: solid 1px #eee;
    right: 1px;
  }
  
  .prev {
    width: 30px
    height: 30px
    display inline-block
    background:url("./images/pre.png") no-repeat center;
    background-size 100% 100%
    float left
    margin-top: 10px;
    cursor pointer
  }

  .prev:hover{
    background:url("./images/right_mr.png") no-repeat center;
  }

  .next {
    width: 30px
    height: 30px
    display inline-block
    background:url("./images/next.png") no-repeat center;
    background-size 100% 100%
    float right
    margin-top: -42px;
    cursor pointer
  }

  .next:hover{
    background:url("./images/left_dj.png") no-repeat center;
  }
</style>
<style scoped lang="stylus">
  .goods-container {
    width: 1200px;
    height: 500px;
    margin: 45px auto;
    background-color: #fff;
  }
  
  .goods-buy {
    width: 735px;
    float: right;
    margin-top: 21px;
    margin-right: 56px;
  }
  
  .goods-title {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
  }
  
  .total-num {
    width: 26px;
    display: inline-block;
  }

  .goods-logo {
    width: 88px;
    height: 18px;
    border: 1px solid #d91e01;
    text-align center;
    margin-top: 15px;
    margin-bottom: 12px;
    cursor pointer
  }
  
  .goods-logo span:first-child {
    font-size: 12px;
    width: 55px;
    color: #d91e01;
    line-height: 18px;
    margin: 0 auto;
    display: inline-block;
    float: left;
  }
  
  .goods-logo span:last-child {
    font-size: 12px;
    width: 33px;
    height: 20px;
    display: inline-block;
    background-color: #d91e01;
    color: #fff;
    position: relative;
    bottom: 1px;
    line-height: 20px;
    right: -1px;
  }
  
  .goods-details ul li {
    margin-bottom 15px
  }
  
  .goods-details ul li label {
    font-size: 14px;
    color: #999999;
  }


  .money {
    font-size: 18px;
    color: #d91e01;
  }
  
  .goods-list li {
    float left
    margin-right 16px
    margin-bottom 10px
    font-size: 14px;
    color: #333333;
    cursor pointer
    height: 52px
  }
  
  .goods-list li input:disabled + div {
    background-color: #eee;
  }
  
  .goods-list li input:disabled + div p {
    opacity: 0.5;
  }
  
  .goods-list li img {
    width: 40px;
    height: 40px;
    float: left;
    margin-top: 4.5px;
    margin-right: 10px;
    margin-left: 5px;
  }
  
  .goods-list li p {
    line-height 52px
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 5px;
  }
  
  .goods-list label {
    float left
    margin-right 8px
    /*height: 180px;*/
  }
  
  .goods-list li input {
    width: 200px;
    height: 50px;
    cursor: pointer;
    position: relative;
    z-index: 99
    opacity 0
  }


  .goods-list-radio li:nth-child(4){
    margin-left 78px
  }
  .goods-list-radio li:nth-child(7){
    margin-left 78px
  }
  .goods-list-radio li:nth-child(10){
    margin-left 78px
  }

  .radio-box {
    width: 200px;
    height: 50px;
    border: solid 1px #eeeeee;
    position: relative;
    bottom: 52px
  }

  .goods-details ul input:hover + .radio-box{
    border:1px solid #666666
  }

  .goods-list li input:checked + .radio-box{
    border: solid 1px #eee;
  }

  .goods-list li input:disabled + .radio-box{
    border: solid 1px #eee;
  }

  .goods-list li input:checked + .radio-box {
    background: url("./images/red_bg.png") no-repeat center;
    background-size 100% 100%
    border: solid 1px #fff;
  }
  
  .progress label {
    float left
  }
  
  .progress .progressBar {
    float left
    margin-left 6px
    margin-top: 2px;
  }

  .rest {
    margin-left 36px
  }
  
  .rest + span {
    color: #333
  }
  
  .btn button {
    width: 100px;
    height: 40px;
    border: solid 1px #d91e01;
    outline none
    background-color #fff
    font-size: 16px;
    color: #d91e01;
    margin-right 20px
    cursor pointer
  }

  .btn button:hover{
    box-shadow:0 3px 30px 5px #eee;
  }

  .btn button:first-child {
    margin-left: 76px;
    margin-top: 18px;
  }
  
  .btn button:last-child {
    background-color #d91e01
    color: #fff
  }
  
  .number label:first-child {
    width: 70px;
    display: inline-block;
    text-align: right;
    margin-right: 3px;
  }

  .price {
    height: 40px;
    background-color: #e9e9e9;
    width: 716px;
    line-height: 40px;
  }

  .triangle_border_nw{
    width: 0;
    height: 0;
    border-width: 12px 12px 0 0;
    border-style: solid;
    border-color: #d91e01 transparent transparent transparent;
    margin: 40px auto;
    position: relative;
    top: 0.5px;
    margin-right: 5px;
  }
</style>

<style scoped lang="stylus">
  .assets-container {
    width: 1200px;
    height: 420px;
    background-color #fff
    margin: 0 auto
  }
  
  .tabs_nav {
    height: 48px;
    border-bottom: solid 1px #d91e01;
  }
  
  .tabs li {
    width: 92px;
    height: 48px;
    float left;
    text-align center;
    line-height 48px
    font-size: 14px;
    color: #333333;
    cursor pointer
  }
  
  .nav-avtive {
    color: #fff !important
    background-color: #d91e01;
  }
  
  .table {
    width: 1200px
  }
  
  .table thead {
    font-size: 14px;
    color: #333333;
  }
  
  .table tbody {
    color: #666666;
  }
  
  .table thead th {
    border-right: solid 1px #eeeeee;
    border-bottom: solid 1px #eeeeee;
    height 50px
    line-height 50px
    width: 300px;
  }
  
  .table tbody td {
    border-right: solid 1px #eeeeee;
    border-bottom: solid 1px #eeeeee;
    height 36px
    line-height 36px
    cursor pointer
    padding-left: 128px;
  }

  .offer-list .table{
    text-align center
  }
  .offer-list .table tbody td{
    padding-left: 0;
  }
  
  .assets-table .table tbody tr:hover {
    color: #d91e01;
  }
  
  .dot {
    width: 6px;
    height: 6px;
    display inline-block
    border-radius 50%
    background-color: #bfbfbf;
    margin-right: 6px;
    margin-bottom: 2px;
  }
  
  .lock {
    margin: 0 auto;
    display: inherit;
    margin-top: 20px;
    margin-bottom 80px
  }
  
  .title {
    font-size: 14px;
    color: #333333;
    border-left: 1px solid #d91e01;
    padding-left 8px
    margin-bottom: 16px;
  }
  
  .details-container {
    margin-bottom 16px
  }
  
  .details-container img {
    width: 80px;
    height: 80px;
    border: solid 1px #eeeeee;
    float left
    margin-left: 10px;
  }
  
  .box1-tips span {
    width: 60px;
    height: 25px;
    display inline-block;
    color: #fff;
    font-size: 14px;
    text-align center;
    line-height 25px;
    margin-right 4px
    margin-bottom: 4px;
  }
  
  .box1-tips span:nth-child(1) {
    margin-left 10px
  }
  
  .box1-tips .merchant {
    background-color: #ffa195;
    margin-left 10px
    margin-top: 6px;
  }
  
  .box1-tips .person {
    background-color: #ffdc8f;
  }
  
  .box1-tips .trust {
    background-color: #8bc8ff;
  }
  
  .details-container ul li {
    float left;
    margin: 5px
    margin-left 10px
    font-size: 14px;
  }
  
  .details-container ul li:nth-child(odd) {
    width: 330px;
  }
  
  .details-container ul li:nth-child(even) {
    width: 240px;
  }
  
  .details-container ul li label {
    color: #999999;
  }
  
  .details-container ul li span {
    color: #666666;
  }
  
  .record-container1 .scroll-box {
    height: 85px;
  }
  
  .record-container2 .scroll-box {
    height: 220px;
  }
  
  .scroll-box {
    line-height normal;
    font-size: 12px;
    color: #999;
    margin-left: 10px
    width: 675px;
    border: solid 1px #eeeeee;
    padding-left 10px
    overflow-y: scroll;
    overflow-x: hidden;
    margin-bottom: 16px;
  }
  
  .scroll-box p:first-child {
    margin-top 15px
  }
  
  .scroll-box p:last-child {
    margin-bottom 15px
  }
  
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  .scroll-box::-webkit-scrollbar {
    width: 4px;
    height: 16px;
    background-color: #fff;
  }
  
  /*定义滚动条轨道 内阴影+圆角*/
  .scroll-box::-webkit-scrollbar-track {
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
    border-radius: 10px;
    background-color: #fff;
  }
  
  /*定义滑块 内阴影+圆角*/
  .scroll-box::-webkit-scrollbar-thumb {
    border-radius: 2px;
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);*/
    background-color: #eeeeee;
  }
</style>
<style>
  .info-dialog .el-dialog__title {
    text-align: center;
    display: inherit;
  }
  
  .info-dialog .el-dialog__body {
    padding-top: 0;
  }
  
  .info-dialog .el-dialog {
    border-radius: 30px;
    padding: 0 10px;
  }
  
  .goods-buy .el-input-number--mini {
    width: 80px;
  }
  
  .goods-buy .el-input-number.is-controls-right .el-input__inner {
    padding-left: 20px;
  }

  .progress .progress_bar_box{
    width: 625px !important;
  }

</style>
