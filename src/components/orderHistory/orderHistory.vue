<template>
  <div class="nav_content">
    <div class="nav_content_title">
      <span>订单商品信息</span>
    </div>
    <table class="order_nav">
      <tr>
        <td>
          <el-select class="order_select" v-model="value" placeholder="请选择" @change="selectChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </td>
        <td>订单详情</td>
        <td>权益</td>
        <td>数量</td>
        <td>小计</td>
        <td>全部状态</td>
      </tr>
    </table>
    <div class="nav_content_table" v-for="(item,index) in dataList">
      <div class="pay_type">支付方式：{{item.pay_method_value}}</div>
      <div class="table_title">
        <span>{{item.apiname}}</span>
        <span>订单号： {{item.id}}</span>
        <span>下单日期：{{item.created_at}}</span>
      </div>
      <table>
        <tr class="img_tbody">
          <td v-if="item.apikey==='5ae04522cff7cb000194f2f4'" @click="turnDetails(item.apikey,item.assetid)">
            <img :src="item.asset_url" alt="">
            <p>{{item.assetname}}</p>
          </td>
          <td v-if="item.apikey!=='5ae04522cff7cb000194f2f4'" @click="turnDetails(item.apikey,item.assetid)">
            <p>{{item.assetname}}</p>
          </td>
          <td>{{item.sell_type}}</td>
          <td>{{item.count}}</td>
          <td>
            <img src="./images/currency.png" alt="" class="icon_currency">
            {{item.price}}
          </td>
          <td class="img_lastTd" v-if="item.order_status === 2">
            <p>已完成</p>
            <router-link to=""><p>查阅</p></router-link>
          </td>
          <td class="no_img_lastTd" v-if="item.order_status === 1">
            <p>未完成</p>
            <router-link to="" @click.native="pay(item.id)">去支付 ></router-link>
          </td>
        </tr>
      </table>
    </div>
    <div class="clearfix paging">
      <el-pagination class="my_paging"
                     layout="prev, pager, next"
                     :background=true
                     :total=total
                     :page-size=limit
                     :current-page.sync=currentPage
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import "@/common/stylus/paging.styl";
  import axios from "axios";
  import {baseURL, cardURL} from '@/common/js/public.js';
  import utils from "@/common/js/utils.js";

  const querystring = require('querystring');

  export default {
    inject: ['reload'],
    name: "orderHistory",
    components: {},
    data() {
      return {
        options: [{
          value: '1',
          label: '近三个月的订单'
        }, {
          value: '2',
          label: '今年内订单'
        }, {
          value: '3',
          label: '2017年订单'
        }],
        value: '1',
        dataList: '',
        userInfo: '',
        total: 10,//总页数
        limit: 10,//每页显示多少条
        currentPage: 1,//当前页数
        begin: this.get3MonthBefor(),//开始时间
        end: "",//结束时间
      }
    },
    mounted() {
      //获取用户信息
      let logInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
      axios({
        method: 'get',
        url: `${baseURL}/v1/users/${logInfo.user_id}`,
      }).then(res => {
        this.userInfo = res.data;
        sessionStorage.setItem("userInfo", JSON.stringify(res.data))
      }).catch(error => {
        console.log(error);
      });
      //获取表格数据
      this.getData()
    },
    methods: {
      getData() {
        let loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
        axios({
          method: 'get',
          url: `${cardURL}/v1/assets-transfer/record/orderlist/${loginInfo.user_id}?page=${this.currentPage}&limit=${this.limit}&begin=${this.begin}&end=${this.end}`,
        }).then(res => {
          for (let v of res.data.data) {
            v.created_at = utils.formatDate(new Date(v.created_at), "yyyy-MM-dd hh:mm:ss");
            v.updated_at = utils.formatDate(new Date(v.updated_at), "yyyy-MM-dd hh:mm:ss");
          }
          this.dataList = res.data.data;
          this.total = res.data.count;
          console.log(this.dataList)
        }).catch(error => {
          console.log(error);
        });
      },
      //当前页变动
      handleCurrentChange(val) {
        this.currentPage = val;
        //再次请求数据
        this.getData()
      },
      //最近三个月时间
      get3MonthBefor() {
        let resultDate, year, month, date;
        let currDate = new Date();
        year = currDate.getFullYear();
        month = currDate.getMonth() + 1;
        date = currDate.getDate();
        switch (month) {
          case 1:
          case 2:
          case 3:
            month += 9;
            year--;
            break;
          default:
            month -= 3;
            break;
        }
        month = (month < 10) ? ('0' + month) : month;
        resultDate = year + '-' + month + '-' + date;
        return resultDate;
      },
      //下拉选择
      selectChange() {
        //时间格式化
        Date.prototype.Format = function (fmt) { //author: meizz
          var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
        };
        if (this.value == 1) {
          this.begin = this.get3MonthBefor();
          this.end = new Date().Format("yyyy-MM-dd");
          //再次请求数据
          this.currentPage = 1;
          this.getData()
        } else if (this.value == 2) {
          this.begin = '2018-01-01';
          this.end = new Date().Format("yyyy-MM-dd");
          //再次请求数据
          this.currentPage = 1;
          this.getData()
        } else {
          this.begin = '2017-01-01';
          this.end = '2017-12-31';
          //再次请求数据
          this.currentPage = 1;
          this.getData()
        }
      },
      pay(val) {
        if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
          let buyInfoObj = _.find(this.dataList, function (o) {
            return o.id === val
          });
          this.getPay(buyInfoObj);
          this.$router.push("/checkOrder")
        }
      },
      getPay(val) {
        this.$store.commit("changeBuy", val);
      },
      turnDetails(apiKey, assetId) {
        if (apiKey === "5ae04522cff7cb000194f2f4") {
          let buyInfoObj=_.find(this.dataList, function (o) {
            return o.assetid === assetId
          });
          buyInfoObj.id=buyInfoObj.package_id
          this.getPropertyDetails(buyInfoObj);
        }
      },
      getCaseDetails(val) {
        this.$store.commit("changeCaseDetails", _.find(this.dataList, function (o) {
          return o.assetid === val
        }));
      },
      getFacilityDetails(val) {
        this.$store.commit("changeFacilityDetails", _.find(this.dataList, function (o) {
          return o.assetid === val
        }));
      },
      getReportDetails(val) {
        this.$store.commit("changeReportDetails", _.find(this.dataList, function (o) {
          return o.assetid === val
        }));
      },
      getPropertyDetails(val){
        this.$store.commit("changePropertyDetails",val);
        //this.$router.push("/transferDetails")
        window.open("/transferDetails","_blank")
      },
    },
  }
</script>
<style scoped lang="stylus">
  .nav_content {
    width: 1080px;
    float: right;
    .nav_content_title {
      box-sizing border-box
      width: 1080px;
      height: 50px;
      background-color: #ffffff;
      border: solid 1px #bfbfbf;
      line-height: 50px;
      font-size: 18px;
      color: #222222;
      padding-left 20px
    }
    .order_nav {
      box-sizing border-box
      width: 1080px;
      height: 40px;
      background-color: #f6f7fa;
      border: solid 1px #bfbfbf;
      margin-top: 16px;
      font-size: 16px;
      color: #222222;
      line-height: 40px;
      text-align: center;
      tr {
        td {
          width: 135px;
        }
        td:nth-child(1) {
          width 25%
          text-align: left;
          .order_select {
            width: 160px;
            margin-left: 30px;
            vertical-align top
            border: none;
          }
        }
        td:nth-child(2) {
          width 25%
        }
      }
    }

    .nav_content_table {
      box-sizing border-box
      margin-top: 12px;
      width: 1080px;
      background-color: #ffffff;
      border: solid 1px #bfbfbf;
      .pay_type {
        height 50px
        line-height 50px
        font-size: 16px;
        color: #222222;
        padding-left 46px
      }
      .table_title {
        box-sizing border-box
        width 100%
        height 40px
        line-height 40px
        background-color #f6f7fa;
        font-size 0
        padding-left 46px
        span {
          display inline-block
          font-size: 16px;
          color: #222222;
        }
        span:nth-child(1) {
          width 300px
        }
        span:nth-child(2) {
          width 400px
        }
        span:nth-child(3) {
          width 300px
        }
      }
      table {
        tr {
          text-align: center;
          height: 90px;
          td {
            font-size: 14px;
            color: #666666;
            vertical-align: middle;
            width: 135px;
            text-align: center;
            .icon_currency {
              position: relative;
              top: 4px;
              width: 13px;
              height: 18px;
            }
          }
          td:nth-child(1) {
            box-sizing border-box
            width 50%
            cursor: pointer;
            font-size 0
            text-align left
            padding-left 46px
            img {
              width: 54px;
              height: 54px;
              border: solid 1px #bfbfbf;
              display: inline-block;
              vertical-align: middle;
              margin-right 46px
            }
            p {
              width: 350px;
              text-align: left;
              line-height: 20px;
              vertical-align: middle;
              display: inline-block;
              font-size: 14px;
            }
          }
          .no_img_lastTd {
            a {
              font-size: 14px;
              color: #c6351e;
              margin-top: 10px;
              display: inline-block;
              margin-left: 14px;
            }
          }

          .img_lastTd {
            p:last-child {
              margin-top: 10px;
              color: #666666;
            }
          }
        }
      }
    }

    .paging {
      width: 1080px;
      margin: 0 auto;
      text-align: center
    }

  }
</style>
<style lang="stylus">
  .order_select {
    .el-input--suffix .el-input__inner {
      border: none;
      height: 40px !important;
      background-color: #f6f7fa;
      color #222222
      font-size: 16px;
    }
    .el-input .el-select__caret {
      color #222222
      border: none;
    }
    el-select-dropdown__item .selected {
      color #c6351e;
      span {
        color #c6351e;
      }

    }
  }


</style>
