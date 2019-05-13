<template>
  <div>
    <div class="site_box">
      <div class="site">
        <ul>
          <li>当前位置 ：</li>
          <li><a href="/home">首页</a></li>
          <li>&nbsp;>&nbsp;</li>
          <li><a href="javascript:void(0);">详情</a></li>
        </ul>
      </div>
    </div>
    <div class="goods-container">
      <div class="goods-banner">
        <img src="./images/lock.png" alt="">
      </div>
      <div class="goods-buy">
        <p class="goods-title">{{propertyDetails.name}}</p>
        <div class="attestation">
          <span class="merchant">认证商家</span>
          <span class="person">认证个人</span>
          <span class="trust">未认证</span>
          <!--<span class="trust" v-if="reportDetails.creditlevel!=='未认证'">{{reportDetails.creditlevel}}</span>-->
        </div>
        <div class="goods-details">
          <ul>
            <li class="price">
              <span class="triangle_border_nw"></span>
              <label>此资产价格：</label>
              <span class="money">{{singleGood.price}}</span>
            </li>
          </ul>
          <div style="clear: both"></div>
          <div class="details-box">
            <div class="details-left">
              <span class="details-dot"></span>
              <ul>
                <li>
                  <label>创建时间</label>
                  <span>：{{"资产所属人"}}</span>
                </li>
                <li>
                  <label>员工人数</label>
                  <span>：{{"资产所属人"}}</span>
                </li>
                <li>
                  <label>资产所属人</label>
                  <span>：{{"资产所属人"}}</span>
                </li>
              </ul>
            </div>
            <div class="details-right">
              <span class="details-dot"></span>
              <ul>
                <li>
                  <label>位置</label>
                  <span>：{{"资产所属人"}}</span>
                </li>
                <li>
                  <label>具体地址</label>
                  <span>：{{"资产所属人"}}</span>
                </li>
                <li>
                  <label>面积</label>
                  <span>：{{"资产所属人"}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="title">
      <span class="title-source case"></span>
      <span class="title-text">设备简介</span>
    </div>
    <div class="transfer-record">
      <p>m ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridi</p>
    </div>

    <div class="title">
      <span class="title-source"></span>
      <span class="title-text">可信溯源</span>
      <span class="check-more">显示更多</span>
  <!--    <span class="check-more" v-if="!isShow" @click="reportSource != ''?isShow = true:isShow = false">显示更多</span>
      <span class="check-more" v-if="isShow" @click="reportSource != ''?isShow = false:isShow = true">收起更多</span>-->
    </div>
    <div class="transfer-record">
      <div class="transfer-title">
        <span class="transfer-dot"></span>
        <label>资产转让记录</label>
      </div>
      <div class="transfer-container">
        <ul>
          <li>
            <label>"交易发起方"</label>
            <span>："交易发起方",</span>
          </li>
          <li>
            <label>"交易接收方"</label>
            <span>："交易接收方",</span>
          </li>
          <li>
            <label>"交易价格"</label>
            <span>："交易价格",</span>
          </li>
          <li>
            <label>"交易时间"</label>
            <span>："交易时间"</span>
          </li>
        </ul>
        <ul>
          <li>
            <label>"交易发起方"</label>
            <span>："交易发起方",</span>
          </li>
          <li>
            <label>"交易接收方"</label>
            <span>："交易接收方",</span>
          </li>
          <li>
            <label>"交易价格"</label>
            <span>："交易价格",</span>
          </li>
          <li>
            <label>"交易时间"</label>
            <span>："交易时间"</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="title">
      <span class="title-source flow"></span>
      <span class="title-text">交易流水</span>
      <div class="notice">
        <div class="block">
          <span class="demonstration">时间范围：</span>
          <el-date-picker
            v-model="value6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <p>月平均收益：<span>￥519.00</span></p>
      </div>
    </div>
    <div class="transfer-record">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="订单号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="创建时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="address"
          label="支付方式">
        </el-table-column>
        <el-table-column
          prop="address"
          label="金额">
        </el-table-column>
      </el-table>

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
</template>

<script>
  import axios from "axios";
  import {baseURL,loginPlatform} from '@/common/js/public.js';
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
        activeImg: "",
        firstCheckedIndex: 0,//第一次出现"0未完成"数组下标
        id: "",
        fav_id:"",//收藏id
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
        value6:'',
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },

    mounted() {
      //获取资产包id
      this.id = JSON.parse(sessionStorage.getItem("propertyDetails")).id;
      //判断userId
      if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
        this.userId = JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
      } else {
        this.userId = ''
      }
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
          url: `${baseURL}/v1/assets-transfer/package/${this.id}`,
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
          url: `${baseURL}/v1/assets-transfer/asset/packid/${this.id}?userid=${this.userId}`,
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
          url: `${baseURL}/v1/assets-transfer/asset/detail/${val.assetid}/${val.apikey}?userid=${this.userId}`,
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
          this.assetId = buyInfoObj.assetid;
          this.userId = JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
          let data = {};
          data.userid = this.userId;
          data.apikey = this.apiKey;
          data.assetid = this.assetId;
          data.count = this.num;
          axios({
            method: "POST",
            url: `${baseURL}/v1/assets-transfer/record/insert`,
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
      login() {
        let redirectURL = window.location.href;
        let url=`?redirectURL=${redirectURL}`;
        window.location.href=`${loginPlatform}${url}`;
      },
      open() {
        this.$confirm('此操作需要先登录, 是否登录?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          this.login()
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
          url: `${baseURL}/v1/assets-transfer/record/${this.id}/2?page=${this.currentPage}&limit=${this.pageSize}`,
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
        let apiKey = item.apikey; //注意apikey中kK大小写
        let id = item.assetid;

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
          url: `${baseURL}/v1/used-asset/${id}/apikey/${apiKey}?page=0&limit=1000000`,
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
          url: `${baseURL}/v1/transed-asset/${id}/apikey/${apiKey}?page=0&limit=1000000`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.assetSource = res.data.data;
          this.assetSource.forEach((record) => {
            record.trans_at = utils.formatDate(new Date(record.trans_at), 'yyyy-MM-dd hh:mm:ss')
          })
        }).catch((err) => {
          console.log(err);
        });
      },
      //是否收藏
      toggleLike(val){
        if(sessionStorage.getItem("loginInfo")){
          let likeInfo=this.singleGood;
          this.apikey=likeInfo.apikey;
          this.assetid=likeInfo.assetid;
          if(likeInfo.fav_id===""){
            axios({
              method: "POST",
              url: `${baseURL}/v1/assets-transfer/favorites/insert`,
              data: querystring.stringify({
                userid: this.userId,
                assetid:this.assetid,
                apikey:this.apikey
              })
            }).then((res) => {
              this.fav_id=res.data.fav_id;
              likeInfo.fav_id=this.fav_id;
              this.addCollection()
            }).catch((err) => {
              console.log(err);
            });
          }else if(likeInfo.fav_id!==""){
            this.fav_id=likeInfo.fav_id;
            axios({
              method: "DELETE",
              url: `${baseURL}/v1/assets-transfer/favorites/delete/${this.userId}/${this.fav_id}`,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Access-Token":this.token
              }
            }).then((res) => {
              likeInfo.fav_id="";
              this.subtractCollection()
            }).catch((err) => {
              console.log(err);
            });
          }
        }else {
          this.open()
        }
      },
      addCollection(){
        this.$store.commit("addCollection")
      },
      subtractCollection(){
        this.$store.commit("subtractCollection")
      },


    },
    watch: {},
    computed: {},
    components: {
      myProgressBar,
    },
  }
</script>

<style scoped lang="stylus">
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
          a {
            color: #666666;
          }
        }
      }
    }
  }
  .goods-container {
    width: 1200px;
    height: 270px;
    margin: 24px auto;
    .goods-banner {
      width: 270px;
      height: 270px;
      float: left
      img {
        width: 270px;
        height: 270px;
      }
    }
  }

  .attestation {
    width 850px
    height 62px
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

  .title {
    width: 1200px;
    height: 45px;
    margin: 0 auto
    background-color: #ffffff;
    border-radius: 10px 10px 0 0;
    border: solid 1px #e5e5e5;
    margin-top 15px
    margin-bottom 4px
    line-height 45px
    font-size: 18px;
    color: #c82c13;
    .title-source {
      width: 18px;
      height: 20px;
      background: url("./images/belive.png") no-repeat center
      display: inline-block;
      margin-left: 10px;
      margin-right: 3px;
      position: relative;
      top: 4px;
    }
    .case{
      background: url("./images/case.png") no-repeat center
    }
    .flow{
      background: url("./images/jiaoyiliushui.png") no-repeat center
    }
    .check-more {
      font-size: 14px;
      color: #666666;
      cursor pointer
      float right
      margin-right 24px
    }
    .notice{
      float right
      .block{
        float left
        margin-right 80px
        .demonstration{
          font-size 16px
          color: #666
        }
      }
      p{
        float right
        margin-right 50px
        font-size 16px
        color: #666
        span{
          font-size 18px
          color #d81e06
        }
      }
    }
  }

  .transfer-record {
    width: 1200px;
    height: auto;
    margin 0 auto
    background-color: #ffffff;
    border-radius: 0 0 10px 10px;
    border: solid 1px #e5e5e5;
    margin-bottom 20px
    overflow: hidden;
    p {
      font-size 16px
      padding: 20px 20px;
      color: #666
    }
    .transfer-title {
      height: 54px
      line-height 54px
      .transfer-dot {
        width: 8px;
        height: 8px;
        background-color: #dcdcdc;
        display: inline-block;
        border-radius: 50%;
        margin-left: 18px;
        margin-right: 2px;
        margin-bottom: 2px;
      }
      label {
        font-size: 18px;
        color: #333333;
      }
    }
    .transfer-container {
      margin-left 30px
      line-height normal
      margin-bottom: 27px;
      ul {
        margin-bottom 27px
        li {
          label {
            color: #333333
            width: 84px;
            display: inline-block;
          }
          span {
            color: #666666;
          }
        }
      }
    }
  }

  .details-box ul {
    margin-left: 30px;
    font-size 14px
  }

  .details-box ul li {
    margin-bottom 18px
  }

  .details-box ul li label {
    width: 110px;
    display: inline-block;
    font-size 14px !important
  }

  .details-box ul li span {
    color: #222;
    font-size 16px
  }

  .details-left, .details-right {
    width: 430px;
    height: 114px;
    background-color: #ffffff;
    border-radius: 10px;
  }

  .details-left {
    float left
  }

  .details-right {
    float right
  }

  .details-dot {
    width: 10px;
    height: 10px;
    display inline-block
    background-color: #f3f3f3;
    border-radius 50%
    margin: 10px
    margin-bottom 0
  }

  .goods-buy {
    width: 910px;
    height: 270px
    float: right;
  }

  .goods-title {
    font-size: 20px;
    color: #222;
    font-weight: bold;
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
    font-size: 18px;
    color: #666;
  }


  .money {
    font-size: 24px;
    color: #d91f00;
  }

  .goods-details ul input:hover + .radio-box{
    border:1px solid #666666
  }

  .rest {
    margin-left 36px
  }

  .rest + span {
    color: #333
  }

  .price {
    height: 60px;
    line-height 60px
    background-color: #e9e9e9;
    width: 100%;
  }

  .triangle_border_nw{
    width: 0;
    height: 0;
    border-width: 12px 12px 0 0;
    border-style: solid;
    border-color: #d91e01 transparent transparent transparent;
    margin: 40px auto;
    position: relative;
    top: -10.5px;
    margin-right: 5px;
  }
</style>
<style>
  .el-table{
    padding: 10px
  }
  .el-table::before{
    height: 0;
  }
  .has-gutter .cell{
    font-size: 18px;
    color: #333333;
  }
</style>
