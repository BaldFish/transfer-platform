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
        <img :src="assetsDetails.store_picture" alt="">
      </div>
      <div class="goods-buy">
        <p class="goods-title" :class="{'is-benefit':!assetsDetails.benefit}">{{assetsDetails.name}}</p>
        <div class="attestation" v-if="assetsDetails.benefit">
          <span class="merchant">{{assetsDetails.benefit}}</span>
          <!--<span class="person">认证个人</span>
          <span class="trust">未认证</span>-->
          <!--<span class="trust" v-if="reportDetails.creditlevel!=='未认证'">{{reportDetails.creditlevel}}</span>-->
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
                  <span>：{{assetsDetails.location}}</span>
                </li>
                <li>
                  <label>具体地址</label>
                  <span>：{{assetsDetails.address}}</span>
                </li>
                <li>
                  <label>面积</label>
                  <span>：{{assetsDetails.area}}</span>
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
        monthly_average_income: 0
      }
    },

    mounted() {
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
        }).catch((err) => {
          console.log(err);
        })
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
          /*headers: {
            "Content-Type": "application/json",
          },*/
          data: querystring.stringify(postData)
        }).then((res) => {
          console.log(res.data)
          this.monthly_average_income = res.data.monthly_average_income;
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
    height: 114px;
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

  .goods-buy {
    width: 910px;
    height: 270px
    float: right;
  }

  .goods-title {
    font-size: 20px;
    color: #222;
    font-weight: bold;
    margin-bottom 16px
  }

  .is-benefit{
    margin-top 20px
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
