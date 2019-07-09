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
        <!--<img :src="assetsDetails.store_picture" alt="">-->
        <img class="show-img" :src="activeImg" alt="">
        <div class="banner-box">
          <span class="prev" @click="prevImg"></span>
          <div class="img-list">
            <ul v-bind:style="{right: toRight + 'px' }">
              <li v-for="item in bannerList" @click="showImg(item)">
                <input type="radio" name="showImg">
                <img :src="item" alt="">
              </li>
            </ul>
          </div>
          <span class="next" @click="nextImg"></span>
        </div>
      </div>
      <div class="goods-buy">
        <div class="title-box">
          <div class="title-info">
            <p class="goods-title" :class="{'is-benefit':!assetsDetails.benefit}">{{assetsDetails.name}}</p>
            <div class="attestation" v-if="assetsDetails.benefit">
              <span class="merchant">{{assetsDetails.benefit}}</span>
              <!--<span class="person">认证个人</span>
              <span class="trust">未认证</span>-->
              <!--<span class="trust" v-if="reportDetails.creditlevel!=='未认证'">{{reportDetails.creditlevel}}</span>-->
            </div>
          </div>
          <p class="btn-buy" :class="{'is-emp':assetsDetails.benefit}" @click="toBuy">一键购买</p>
        </div>
        <div class="goods-details">
          <ul>
            <li class="price">
              <span class="triangle_border_nw"></span>
              <label>此资产价格：</label>
              <span class="money">{{assetsDetails.price}}</span>
            </li>
          </ul>
          <div style="clear: both"></div>
          <div class="details-box">
            <div class="details-left">
              <span class="details-dot"></span>
              <ul>
                <li>
                  <label>创建时间</label>
                  <span>：{{assetsDetails.created_at}}</span>
                </li>
                <li>
                  <label>员工人数</label>
                  <span>：{{assetsDetails.employee_number}}</span>
                </li>
                <li>
                  <label>资产所属人</label>
                  <span class="owner">：{{assetsDetails.owner_address}}</span>
                </li>
              </ul>
            </div>
            <div class="details-right">
              <span class="details-dot"></span>
              <ul>
                <li>
                  <label>位置</label>
                  <span>：{{location}}</span>
                </li>
                <li>
                  <label>具体地址</label>
                  <span style="float: right;width: 276px;padding-right: 10px">：{{address}}</span>
                  <div style="clear: both"></div>
                </li>
                <li>
                  <label>面积</label>
                  <span>：{{assetsDetails.area}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div style="clear: both"></div>
          <div class="detail-amount">
            <span class="details-dot"></span>
            <ul>
              <li>
                <label>认购数量</label>
                <span>
                  ：
                  <el-input-number size="mini" :min="0" :max="assetsDetails.amount" v-model="num4"></el-input-number>
                </span>
                <p>剩余&nbsp;<span>{{assetsDetails.amount}}</span>&nbsp;份</p>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>

    <div style="clear: both"></div>
    <div class="title">
      <span class="title-source case"></span>
      <span class="title-text">资产详情</span>
    </div>
    <div class="transfer-record">
      <p>{{assetsDetails.description}}</p>
    </div>

    <div class="title">
      <span class="title-source"></span>
      <span class="title-text">可信溯源</span>
      <!--<span class="check-more">显示更多</span>-->
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
            <span>：{{assetsChains.from}},</span>
          </li>
          <li>
            <label>"交易接收方"</label>
            <span>：{{assetsChains.to}},</span>
          </li>
          <li>
            <label>"交易哈希"</label>
            <span>：{{assetsChains.hash}},</span>
          </li>
          <li>
            <label>"交易时间"</label>
            <span>：{{assetsChains.created_at}},</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="title">
      <span class="title-source flow"></span>
      <span class="title-text">交易流水</span>
      <div class="notice">
        <div class="block">
          <span>时间范围：</span>
          <span>{{flowList.start_time}}</span>
          <span>&nbsp;~&nbsp;</span>
          <span>{{flowList.end_time}}</span>
        </div>
        <p>月平均收益：<span>￥{{monthly_average_income}}</span></p>
      </div>
    </div>
    <div class="transfer-record">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="订单号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
          align="center"
          width="310">
        </el-table-column>
        <el-table-column
          prop="company_name"
          label="名称"
          align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="pay_way"
          align="center"
          label="支付方式">
        </el-table-column>
        <el-table-column
          prop="price"
          align="center"
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
        assetsDetails: {},
        assetsChains: {},
        flowList: {},
        isShow: true,
        total: 10,
        pageSize: 10,
        currentPage: 1,
        tableData: [],
        monthly_average_income: 0,
        num4: 1,
        location: "" ,//位置
        address:"",// 具体地址
        toRight: 0,
        activeImg: "",
        bannerList: [],
        token:"",
        user_id:"",
        authentication:"", //1 未认证 2 已认证


      }
    },

    mounted() {
      if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
        this.token = JSON.parse(sessionStorage.getItem("loginInfo")).token;
        this.user_id = JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
        this.authentication = JSON.parse(sessionStorage.getItem("userInfo")).authentication;

        console.log(sessionStorage.getItem("userInfo"))
      }
      this.getAssetsDetails();
      this.getAssetsChains();
      this.getFlow();
    },
    methods: {
      handleChange(value) {
        console.log(value);
      },
      /*tabChange() {
        this.isShow = !this.isShow
      },*/
      //上一张图
      prevImg() {
          if (this.toRight == 0) {
          return false
        } else {
          this.toRight = this.toRight - 60
        }
      },
      //下一张图
      nextImg() {
        if (this.toRight === (this.bannerList.length - 1) * 60 || this.bannerList.length <= 4){
          return false
        } else {
          this.toRight = this.toRight + 60
        }
      },
      //展示大图
      showImg(item) {
        this.activeImg = item
      },
      //获取资产详情信息
      getAssetsDetails(){
        axios({
          method: "GET",
          url: `${baseURL}/v1/asset-show/assets/${this.$route.query.asset_id}/desc?type=${this.$route.query.type_id}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.assetsDetails = res.data.data;
          this.location = res.data.data.company_info.area;
          this.address = res.data.data.company_info.address;
          //轮播
          for (let index in res.data.data.company_info.img_url){
            this.bannerList.push(res.data.data.company_info.img_url[index])
          }
          this.activeImg = this.bannerList[0];
        }).catch((err) => {
          console.log(err);
        })
      },
      //一键购买
      toBuy(){

        console.log(3333)

        console.log(this.authentication)
        if (this.authentication == 1){
          this.$confirm('您还未实名认证，是否前往认证?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$router.push("/securityCenter")
          }).catch(() => {
          })
        } else {
          //判断是否绑定支付宝
          axios({
            method: "GET",
            url: `${baseURL}/v1/asset-show/alipay/${this.user_id}`,
            headers: {
              "Content-Type": "application/json",
            }
          }).then((res) => {

            alert(6666)

          }).catch((err) => {
            this.$confirm('您还未绑定支付宝，是否前往绑定?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.$router.push("/securityCenter")
            }).catch(() => {
            })

          })

        }


      },
      //获取资产上链的信息
      getAssetsChains(){
        axios({
          method: "GET",
          url: `${baseURL}/v1/asset-show/assets/${this.$route.query.asset_id}/chain-info`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.assetsChains = res.data.data;
        }).catch((err) => {
          console.log(err);
        })
      },
      //获取餐厅类资产的交易流水
      getFlow(){
        axios({
          method: "GET",
          url: `${baseURL}/v1/asset-show/assets/${this.$route.query.asset_id}/records?page=${this.currentPage}&limit=${this.pageSize}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          res.data.data.start_time = utils.formatDate(new Date(res.data.data.start_time), 'yyyy-MM-dd hh:mm:ss');
          res.data.data.end_time = utils.formatDate(new Date(res.data.data.end_time), 'yyyy-MM-dd hh:mm:ss');
          res.data.data.lists.forEach((item) => {
            item.created_at = utils.formatDate(new Date(item.created_at), 'yyyy-MM-dd hh:mm:ss')
          });
          this.total = res.data.data.count;
          this.flowList = res.data.data;
          this.tableData = res.data.data.lists;
          //获取获取月平均收入
          this.getMonthlyAvgIncome();
        }).catch((err) => {
          console.log(err);
        })
      },
      //获取获取月平均收入
      getMonthlyAvgIncome(){
        let postData = {
          asset_id: this.$route.query.asset_id.toString(),
          begin_date: Number(parseInt(new Date(this.flowList.start_time).getTime()/1000)),
          end_date: Number(parseInt(new Date(this.flowList.end_time).getTime()/1000)),
        };
        axios({
          method: "POST",
          url: `http://39.108.80.66:20018/api/v1/finance/monthly_average_income`,
          data: querystring.stringify(postData)
        }).then((res) => {
          this.monthly_average_income = res.data.data.monthly_average_income;
        }).catch((err) => {
          console.log(err);
        })
      },
      //分页变化
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getFlow();
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
    height: 340px;
    margin: 24px auto;
    .goods-banner {
      width: 312px;
      height: 370px
      float: left
      .show-img {
        width: 270px;
        height: 270px;
        border: solid 1px #eeeeee;
        margin-bottom: 20px;
        margin-left: 20px;
      }
      .show-img:hover{
        border: 1px solid red;
      }
      .banner-box {
        height: 50px;
        width: 312px
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
      .img-list {
        height: 52px;
        width: 240px;
        margin-left: 40px;
        overflow: hidden;
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
    }
  }

  .attestation {
    width 850px
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
      margin-bottom 16px
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
        font-size 16px
        color: #666
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
    height: 130px;
    background-color: #ffffff;
    border-radius: 10px;
  }

  .details-left {
    float left
  }

  .owner{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 260px
    display inline-block
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

  .detail-amount{
    width: 100%;
    height: 70px;
    background-color: #fff;
    border-radius: 10px;
    margin-top 18px
    ul{
      margin-left: 30px;
      li{
        display: flex;
        flex-direction: row;
        align-items: baseline;
        label{
          width: 110px;
          display: inline-block;
          font-size: 14px !important
        }
        p{
          margin-left 38px
          font-size: 16px;
          color: #999999;
          span{
            font-size: 18px;
            color: #333333;
          }
        }
      }
    }
  }

  .goods-buy {
    width: 880px;
    height: 270px
    float: right;
  }

  .title-box{
    display flex
    flex-direction row
    justify-content space-between
    align-items baseline
    .title-info{
      width: 500px
    }
    .btn-buy{
      width: 110px;
      height: 40px;
      line-height 40px
      text-align center
      background-color: #c82c13;
      border-radius: 4px;
      font-size 18px
      color: #ffffff
      cursor pointer
      margin-bottom: 10px;
    }
    .is-emp{
      position relative
      top:24px
    }
  }

  .goods-title {
    font-size: 20px;
    color: #222;
    font-weight: bold;
    margin-bottom 16px
  }

  .is-benefit{
    margin-top 10px
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
  .el-input-number--mini{
    width: 100px ;
  }
  .el-input-number__decrease:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled), .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled){
    border-color: #dcdfe6;
  }
  .el-input-number__decrease:hover, .el-input-number__increase:hover{
    color: #666;
  }
</style>
