<template>
  <div class="nav_content">
    <div class="nav_content_title">
      <span>核对订单信息</span>
    </div>
    <div class="nav_content_table">
      <table>
        <thead>
        <tr class="img_thead">
          <th>订单详情</th>
          <th>权益</th>
          <th>数量</th>
          <th>小计</th>
        </tr>
        <tr class="th_classify">
          <th colspan="6">{{buyInfoObj.apiname}}</th>
        </tr>
        </thead>
        <tbody>
        <tr class="img_tbody">
          <td @click="turnDetails(buyInfoObj.apikey,buyInfoObj.assetid,buyInfoObj.packageId)"><img :src="buyInfoObj.asseturl" alt=""
                                                                               v-if="buyInfoObj.apikey==='5ae04522cff7cb000194f2f4'">{{buyInfoObj.assetname}}</td>
          <td>{{buyInfoObj.sell_type}}</td>
          <td>{{buyInfoObj.count}}</td>
          <td>{{total}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <p class="order_amount">订单金额：<span>{{total}}</span></p>
    <div class="check_container" v-if="next===1">
      <div class="check_info">
        <h2>确认订单</h2>
        <div class="check_title_info">
          <p v-if="walletAddress===''">未绑定钱包地址
            <router-link to="/securityCenter" class="to_bind">去绑定 ></router-link>
          </p>
          <p v-if="walletAddress!==''">钱包地址：{{walletAddress}}</p>
          <p>可信积分：{{balance}}</p>
        </div>
      </div>
      <div class="check_code">
        <div class="payment">
          <span>选择支付方式：&nbsp;&nbsp;</span>
          <span class="pay">
            <label class="pay_label">
              <input class="pay_radio" type="radio" name="pay" value=30 v-model="value">
              <span class="pay_radioInput"></span>银联
            </label>
            <label class="pay_label">
              <input class="pay_radio" type="radio" name="pay" value=10 v-model="value">
              <span class="pay_radioInput"></span>微信
            </label>
            <label class="pay_label">
              <input class="pay_radio" type="radio" name="pay" value=0 v-model="value">
              <span class="pay_radioInput"></span>可信积分
            </label>
            <label class="pay_label">
              <input class="pay_radio" type="radio" name="pay" value="20" v-model="value">
              <span class="pay_radioInput"></span>支付宝
            </label>
          </span>
        </div>
        <p>可使用可信积分，进行等价交易。</p>
        <p class="tip">提示：可用其它钱包地址支付</p>
        <button @click="acquireIntegralInfo">确认支付</button>
      </div>
    </div>
    <div class="check_container" v-if="next===2">
      <div class="check_info">
        <h2>确认订单</h2>
        <div class="check_title_info">
          <p v-if="walletAddress===''">未绑定钱包地址
            <router-link to="/securityCenter" class="to_bind">去绑定 ></router-link>
          </p>
          <p v-if="walletAddress!==''">钱包地址：{{walletAddress}}</p>
          <p>可信积分：{{balance}}</p>
        </div>
      </div>
      <div class="check_code">
        <p>可使用可信积分，进行等价交易。</p>
        <p class="tip">提示：可用其它钱包地址支付</p>
        <img class="check_code_img" :src="`data:image/png;base64,${paymentInfo.png}`" alt="" v-if="value===0">
        <a class="check_code_a" :href="paymentInfo.image_url" target="_blank" v-if="value!==0">去支付</a>
      </div>
    </div>
    <div class="check_container" v-if="next===3">
      <div class="check_info">
        <h2>确认订单</h2>
        <div class="check_title_info">
          <p v-if="walletAddress===''">未绑定钱包地址
            <router-link to="/securityCenter" class="to_bind">去绑定 ></router-link>
          </p>
          <p v-if="walletAddress!==''">钱包地址：{{walletAddress}}</p>
          <p>可信积分：{{balance}}</p>
        </div>
      </div>
      <div class="check_code">
        <div class="check_success">
          <img src="./images/payment.png" alt="">
          <p>支付成功！</p>
          <router-link to="/personalAssets" class="to_see">查看资产</router-link>
        </div>
        <div class="code_box" v-if="walletAddress===''">
          <p>您还未绑定钱包地址，请下载钱包APP生成钱包地址后，并绑定，方便在手机上查阅！</p>
          <ul class="code">
            <li>
              <img src="./images/Android_cn.png" alt="Android_cn">
              <p>Android中文版</p>
            </li>
            <li>
              <img src="./images/Android_en.png" alt="Android_en">
              <p>Android英文版</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import {baseURL, cardURL} from '@/common/js/public.js';
  import myTopSearch from "../topSearch/topSearch"
  import {BigNumber} from 'bignumber.js';
  
  const querystring = require('querystring');
  
  export default {
    name: "checkOrder",
    components: {
      myTopSearch
    },
    data() {
      return {
        paymentInfo: {},
        orderNum: "",
        userId: "",
        token: "",
        id: "",
        walletAddress: "",
        balance: 0,
        buyInfoObj: {},
        caseDetails: {},
        facilityDetails: {},
        next: 1,
        timer: "",
        phone: "",
        value: 0,
      }
    },
    mounted() {
      if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
        this.userId = JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
        this.token = JSON.parse(sessionStorage.getItem("loginInfo")).token;
        if (JSON.parse(sessionStorage.getItem("buyInfoObj"))) {
          this.orderNum = JSON.parse(sessionStorage.getItem("buyInfoObj")).orderNum
        }
        this.acquireOrderInfo();
        this.acquireUserInfo();
      }
    },
    beforeRouteLeave(to, from, next) {
      clearTimeout(this.timer);
      this.next = 1;
      next();
    },
    computed: {
      total: function () {
        return this.buyInfoObj.price
      }
    },
    methods: {
      //获取订单详情
      acquireOrderInfo() {
        axios({
          method: "GET",
          url: `${baseURL}/v1/order/detail/${this.orderNum}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.buyInfoObj = res.data;
          this.orderNum = this.buyInfoObj.orderNum;
          if (this.buyInfoObj.orderStatus === 2) {
            this.next = 3
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      //订单确认支付
      acquireIntegralInfo() {
        if (this.walletAddress) {
          //防止长时间未点击确认支付或在其它浏览器支付完成，支付前获取订单最新支付状态
          axios({
            method: "GET",
            url: `${baseURL}/v1/order/detail/${this.orderNum}`,
            headers: {
              "Content-Type": "application/json",
            }
          }).then((res) => {
            if (res.data.orderStatus === 0) {
              return
            } else if (res.data.orderStatus === 1) {
              //如果支付状态是未支付，根据支付方式请求支付信息
              axios({
                method: "POST",
                url: `${baseURL}/v1/order/pay/${this.orderNum}`,
                data: querystring.stringify({
                  pay_method: this.value
                })
              }).then((res) => {
                if (this.value === 30 || 10 || 20) {
                  this.paymentInfo = res.data.data;
                  window.open(this.paymentInfo.image_url, "_blank")
                } else if (this.value === 0) {
                  this.paymentInfo = res.data;
                }
                this.next = 2;
                this.acquireOrderStatus();
              }).catch((err) => {
                console.log(err);
              });
            } else if (res.data.orderStatus === 2) {
              clearTimeout(this.timer);
              this.next = 3
            }
          }).catch((err) => {
            console.log(err);
          });
        } else {
          this.open()
        }
      },
      //查询订单支付状态（共用获取订单详情接口）
      acquireOrderStatus() {
        axios({
          method: "GET",
          url: `${baseURL}/v1/order/detail/${this.orderNum}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          if (res.data.orderStatus === 0) {
            clearTimeout(this.timer);
            return
          } else if (res.data.orderStatus === 1) {
            clearTimeout(this.timer);
            let that = this;
            this.timer = window.setTimeout(function () {
              that.acquireOrderStatus()
            }, 5000);
          } else if (res.data.orderStatus === 2) {
            clearTimeout(this.timer);
            this.next = 3
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      //获取用户信息
      acquireUserInfo() {
        axios({
          method: "GET",
          url: `${baseURL}/v1/users/${this.userId}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.phone = res.data.phone.substr(3, 3) + "***" + res.data.phone.substr(10, 4);
          this.walletAddress = res.data.wallet_address;
          if (this.walletAddress) {
            this.acquireBalance()
          } else {
            this.balance = 0
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      //获取钱包地址余额
      acquireBalance() {
        axios({
          method: "POST",
          url: `${cardURL}/`,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            "jsonrpc": "2.0",
            "method": "eth_getBalance",
            "params": [this.walletAddress, "latest"],
            "id": 1
          },
        }).then((res) => {
          if (res.data.error) {
            this.balance = 0
          } else {
            this.balance = new BigNumber(Number(res.data.result)).dividedBy(1e+18).toFormat(2);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      //提示框
      open() {
        this.$confirm('此操作需要先绑定钱包地址, 是否绑定?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          this.$router.push("/securityCenter")
        }).catch(() => {
        });
      },
      turnDetails(apiKey, assetId,packageId) {
        if(packageId===""){
          if (apiKey === "5a6be74a55aaf50001a5e250") {
            this.getCaseDetails(assetId);
            //this.$router.push("/caseDetails");
            window.open("/caseDetails","_blank");
          } else if (apiKey === "5ae04522cff7cb000194f2f4") {
            this.getFacilityDetails(assetId);
            //this.$router.push("/facilityDetails");
            window.open("/facilityDetails","_blank");
          }else if(apiKey === "5b18a5b9cff7cb000194f2f7"){
            window.open("/reportDetails", "_blank");
          }
        }else{
          this.getPropertyDetails(packageId);
        }
      },
      getCaseDetails(val) {
        this.$store.commit("changeCaseDetails", this.buyInfoObj);
      },
      getFacilityDetails(val) {
        this.$store.commit("changeFacilityDetails", this.buyInfoObj);
      },
      getPropertyDetails(val){
        this.$store.commit("changePropertyDetails", this.buyInfoObj);
        //this.$router.push("/transferDetails")
        window.open("/transferDetails","_blank")
      },
    },
  }
</script>
<style scoped>
  .nav_content {
    width: 1080px;
    float: right;
  }
  
  .nav_content_title {
    width: 1078px;
    height: 50px;
    background-color: #ffffff;
    border: solid 1px #bfbfbf;
    line-height: 50px;
    font-size: 18px;
    color: #222222;
  }
  
  .nav_content_title span {
    padding-left: 20px;
  }
  
  .nav_content_table {
    margin-top: 12px;
    width: 1078px;
    background-color: #ffffff;
    border: solid 1px #bfbfbf;
  }
  
  .nav_content_table thead th {
    font-size: 16px;
    color: #222222;
  }
  
  .nav_content_table tbody td {
    font-size: 14px;
    color: #666666;
  }
  
  .nav_content_table tbody tr {
    border-bottom: 1px solid #d2d2d2;
    text-align: center;
    height: 90px;
  }
  
  .nav_content_table tbody tr td {
    vertical-align: middle;
  }
  
  .nav_content_table tbody tr:last-child {
    border-bottom: none;
  }
  
  .no_img_thead {
    height: 50px;
    line-height: 50px;
  }
  
  .no_img_thead th:nth-child(1) {
    width: 480px;
    text-align: left;
    padding-left: 46px;
  }
  
  .no_img_thead th {
    width: 154px;
  }
  
  .th_classify th {
    width: 1080px;
    height: 40px;
    background-color: #f6f7fa;
    text-align: left;
    line-height: 40px;
    padding-left: 46px;
  }
  
  .no_img_tbody td:nth-child(1) {
    text-align: left;
    padding-left: 46px;
    line-height: 20px;
  }
  
  .quick_buy_td button {
    width: 64px;
    height: 28px;
    border-radius: 4px;
    border: solid 1px #c6351e;
    background-color: #ffffff;
    outline: none;
    cursor: pointer;
    font-size: 14px;
    color: #c6351e;
    margin: 0 30px;
  }
  
  .img_thead {
    height: 50px;
    line-height: 50px;
  }
  
  .img_thead th:first-child {
    padding-left: 46px;
    text-align: left;
    width: 470px;
  }
  .img_thead th {
    width: 150px;
  }
  
  .img_tbody td:nth-child(1) {
    padding-left: 46px;
    text-align: left;
    cursor: pointer;
  }
  
  .img_tbody td:nth-child(1) img {
    width: 54px;
    height: 54px;
    border: solid 1px #bfbfbf;
    display: inline-block;
    vertical-align: middle;
    margin-right: 46px;
  }
  
  .order_amount {
    text-align: right;
    font-size: 18px;
    color: #222222;
    margin-top: 20px;
    margin-bottom: 60px;
  }
  
  .order_amount span {
    color: #c6351e;
  }
</style>
<style scoped lang="stylus">
  .check_container {
    box-sizing border-box
    width: 1080px;
    background-color: #ffffff;
    border-top: 6px solid #c6351e;
    margin-bottom: 112px;
    .check_info {
      h2 {
        font-size: 18px;
        color: #222222;
        margin: 18px;
        margin-bottom: 10px;
      }
      .check_title_info {
        font-size: 14px;
        color: #666666;
        margin-left: 18px;
        line-height: 22px;
        .to_bind {
          font-size: 14px;
          color: #c6351e;
        }
      }
    }
    .check_code {
      text-align center
      font-size: 16px;
      color: #333333;
      margin: 0 auto;
      .payment {
        margin-top 10px
        margin-bottom 38px
        color: #333333;
        .pay {
          .pay_label {
            margin-right 26px
            display: inline-block
          }
          .pay_radio {
            display: none
          }
          .pay_radioInput {
            border: 1px solid #7d7d7d;
            border-radius: 50%;
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 6px;
            vertical-align: middle;
            line-height: 1
          }
          .pay_radio:checked + .pay_radioInput:after {
            background-color: #d91e01;
            border-radius: 50%;
            content: "";
            display: inline-block;
            width: 12px;
            height: 12px;
            margin 2px
          }
          .pay_checkbox.pay_radioInput, .pay_radio:checked + .pay_checkbox.pay_radioInput:after {
            border-radius: 0
          }
        }
      }
      p {
        text-align center
        line-height 36px
        color: #222222;
      }
      .tip {
        font-size 14px
      }
      button {
        width: 100px;
        height: 30px;
        margin 0 auto
        color: #ffffff;
        line-height: 30px;
        background-color: #c6351e;
        outline: none;
        border: none;
        cursor: pointer;
        margin-top 24px
        margin-bottom 20px
      }
      .check_code_img {
        width: 100px;
        height: 100px;
        border: 1px solid #cccccc;
        display: inline-block;
        margin-top 24px
        margin-bottom 20px
      }
      .check_code_a {
        width: 100px;
        height: 30px;
        display: inline-block;
        margin-top 24px
        margin-bottom 20px
        margin-left 0
        margin-right 0
        line-height 30px
        font-size: 16px;
        background-color: #c6351e;
        color: #ffffff;
      }
      .check_success {
        text-align: center;
        font-size: 16px;
        color: #c6351e;
        margin-top: 4px;
        .to_see {
          width: 130px;
          height: 30px;
          display: inline-block;
          background-color: #c6351e;
          color: #ffffff;
          line-height: 30px;
          margin-top 10px
          margin-bottom 10px
        }
      }
      .code_box {
        p {
          font-size 14px
          color: #666666;
        }
        .code {
          font-size 0
          li {
            margin 10px
            font-size 14px
            color: #666666;
            display inline-block
            text-align center
            img {
              vertical-align top
            }
          }
        }
      }
    }
  }
</style>
