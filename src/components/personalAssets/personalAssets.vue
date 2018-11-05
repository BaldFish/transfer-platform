<template>
  <div class="nav_content">
    <div class="assets_summary">
      <p>{{phone}}</p>
      <p v-if="walletAddress===''">未绑定钱包地址
        <router-link to="/securityCenter" class="to_bind">去绑定 ></router-link>
      </p>
      <p v-if="walletAddress!==''">钱包地址：{{walletAddress}}</p>
      <p>数据豆：{{balance}}</p>
    </div>
    <div class="nav_content_title">
      <span>已购资产</span>
    </div>
    <div class="nav_content_table" v-if="assetList.length>0">
      <table>
        <thead>
        <tr class="content_thead">
          <th>名称</th>
          <th>权益</th>
          <th>数量</th>
          <th>小计</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr class="classify" v-if="reportList.length>0">
          <td colspan="5">诊断报告</td>
        </tr>
        <tr class="content_tbody" v-for="(item,index) of reportList" :key="item.id">
          <td @click="turnDetails(item.apikey,item.assetid)">{{item.assetname}}</td>
          <td>{{item.sell_type}}</td>
          <td>{{item.count}}</td>
          <td>{{item.price}}</td>
          <td class="quick_buy_td">
            <button>查看</button>
          </td>
        </tr>
        <tr class="classify" v-if="facilityList.length>0">
          <td colspan="5">维修设备</td>
        </tr>
        <tr class="content_tbody" v-for="(item,index) of facilityList" :key="item.id">
          <td @click="turnDetails(item.apikey,item.assetid)"><span><img :src="item.asset_url" alt=""></span>{{item.assetname}}</td>
          <td>{{item.sell_type}}</td>
          <td>{{item.count}}</td>
          <td>{{item.price}}</td>
          <td class="quick_buy_td">
            <button>查看</button>
          </td>
        </tr>
        <tr class="classify" v-if="caseList.length>0">
          <td colspan="5">维修案例</td>
        </tr>
        <tr class="content_tbody" v-for="(item,index) of caseList" :key="item.id">
          <td @click="turnDetails(item.apikey,item.assetid)">{{item.assetname}}</td>
          <td>{{item.sell_type}}</td>
          <td>{{item.count}}</td>
          <td>{{item.price}}</td>
          <td class="quick_buy_td">
            <button>查看</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="clearfix paging" v-if="assetList.length>0">
      <el-pagination class="my_paging"
                     layout="prev, pager, next"
                     :background=true
                     :total=total
                     :page-size=pageSize
                     :current-page.sync=currentPage
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <div class="no_assets_content" v-if="assetList.length===0">
      <div class="no_assets_box">
        <img src="./images/empty.png" alt="">
        <p>暂时没有资产</p>
        <router-link to="/" class="to_buy">去购买 ></router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import _ from "lodash";
  import "../../common/stylus/paging.styl";
  import {baseURL,loginPlatform} from '@/common/js/public.js';
  import {BigNumber} from 'bignumber.js';
  import utils from "@/common/js/utils.js";
  export default{
    name: "personalAssets",
    components: {},
    data(){
      return {
        total: 10,
        pageSize: 10,
        currentPage: 1,
        assetList:[],
        userId:"",
        token:"",
        phone:"",
        walletAddress:"",
        balance:0,
      }
    },
    computed:{
      reportList: function () {
        return this.assetList.filter(function (value, index, array) {
          return value.apikey==="5b18a5b9cff7cb000194f2f7"
        })
      },
      caseList: function () {
        return this.assetList.filter(function (value, index, array) {
          return value.apikey==="5a6be74a55aaf50001a5e250"
        })
      },
      facilityList:function () {
        return this.assetList.filter(function (value, index, array) {
          return value.apikey==="5ae04522cff7cb000194f2f4"
        })
      },
    },
    mounted() {
      if(JSON.parse(sessionStorage.getItem("loginInfo"))){
        this.userId=JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
        this.token=JSON.parse(sessionStorage.getItem("loginInfo")).token;
        this.walletAddress=JSON.parse(sessionStorage.getItem("userInfo")).wallet_address;
        if (this.walletAddress) {
          this.acquireBalance()
        } else {
          this.balance = 0
        }
        this.acquireAssetList();
      }
    },
    methods:{
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
          this.login();
        }).catch(() => {
        });
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.acquireAssetList();
      },
      /*acquireUserInfo(){
          axios({
            method: "GET",
            url: `${baseURL}/v1/users/${this.userId}`,
            headers: {
              "Content-Type": "application/json",
            }
          }).then((res) => {
            this.phone=res.data.phone.substr(3,3)+"***"+res.data.phone.substr(10,4);
            this.walletAddress=res.data.wallet_address;
            if(this.walletAddress){
              this.acquireBalance()
            }else{
              this.balance=0
            }
          }).catch((err) => {
            console.log(err);
          });
      },*/
      acquireBalance() {
        //获取数据豆余额
        axios({
          method:"GET",
          url:`${baseURL}/v1/token/TSD/balance?address=${this.walletAddress}`,
        }).then((res)=>{
          res.data.result="0x"+res.data.result;
          this.balance = new BigNumber(Number(res.data.result)).dividedBy(1e+18).toFormat(2);
        }).catch((err)=>{
          console.log(err)
        });
        //获取Gas余额
        /*axios({
          method: "POST",
          url: `${baseURL}/`,
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
        });*/
      },
      acquireAssetList() {
        axios({
          method: "GET",
          url: `${baseURL}/v1/assets-transfer/record/orderlist/payed/${this.userId}?page=${this.currentPage}&limit=${this.pageSize}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.total = res.data.count;
          for(let v of res.data.data){
            v.created_at=utils.formatDate(new Date(v.created_at), "yyyy-MM-dd hh:mm:ss");
            v.updated_at=utils.formatDate(new Date(v.updated_at), "yyyy-MM-dd hh:mm:ss");
          }
          this.assetList = res.data.data;
        }).catch((err) => {
          console.log(err);
        });
      },
      turnDetails(apiKey, assetId) {
        if (apiKey === "5ae04522cff7cb000194f2f4") {
          let buyInfoObj=_.find(this.facilityList, function (o) {
            return o.assetid === assetId
          });
          buyInfoObj.id=buyInfoObj.package_id
          this.getPropertyDetails(buyInfoObj);
        }
      },
      getCaseDetails(val) {
        this.$store.commit("changeCaseDetails", _.find(this.assetList, function (o) {
          return o.assetid === val
        }));
      },
      getFacilityDetails(val) {
        this.$store.commit("changeFacilityDetails", _.find(this.assetList, function (o) {
          return o.assetid === val
        }));
      },
      getReportDetails(val) {
        this.$store.commit("changeReportDetails", _.find(this.assetList, function (o) {
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
<style scoped>
  .nav_content{
    width: 1078px;
    float: right;
  }
  .nav_content_title{
    width: 1078px;
    height: 50px;
    background-color: #ffffff;
    border: solid 1px #bfbfbf;
    line-height: 50px;
    font-size: 18px;
    color: #222222;
  }
  .assets_summary{
    width: 1080px;
    height: 100px;
    background-color: #ffffff;
    font-size: 14px;
    color: #666666;
    margin-bottom: 24px;
  }
  .assets_summary p{
    font-size: 14px;
    color: #666666;
    margin-left: 20px;
  }
  .assets_summary p:first-child{
    font-size: 18px;
    color: #222222;
    padding: 16px 0;
  }
  .assets_summary p:nth-child(2){
    margin-bottom: 10px;
  }
  .to_bind{
    font-size: 14px;
    color: #c6351e;
    margin-left: 10px;
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
  .content_thead {
    font-size: 16px;
    color: #222222;
    height: 50px;
    line-height: 50px;
  }
  .content_thead th {
    width: 110px;
  }
  .content_thead th:first-child {
    text-align: left;
    padding-left: 46px;
    width: 640px;
  }
  .classify td {
    background-color: #f6f7fa;
    text-align: left;
    line-height: 40px;
    padding-left: 46px;
    font-size: 16px;
    color: #222222;
  }
  .content_tbody{
    border-bottom: 1px solid #d2d2d2;
  }
  .content_tbody td {
    font-size: 14px;
    color: #666666;
    text-align: center;
    height: 90px;
    vertical-align: middle;
  }
  .content_tbody td span{
    box-sizing: border-box;
    display: inline-block;
    width: 54px;
    height: 54px;
    vertical-align: middle;
    border: solid 1px #bfbfbf;
    margin-right: 40px;
  }
  .content_tbody td span img{
    vertical-align: middle;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    max-width: 52px;
    max-height: 52px;
  }
  .content_tbody td:first-child{
    text-align: left;
    padding-left: 46px;
    cursor: pointer;
  }
  tbody tr:first-child {
    border-top: 1px solid #d2d2d2;
  }
  tbody tr:last-child {
    border-bottom: none;
  }
  .quick_buy_td button {
    box-sizing: border-box;
    width: 80px;
    height: 28px;
    border-radius: 4px;
    border: solid 1px #c6351e;
    background-color: #ffffff;
    outline: none;
    cursor: pointer;
    font-size: 14px;
    color: #c6351e;
    margin: 0 10px;
  }


  .no_assets_content{
    margin-top: 12px;
    width: 1078px;
    height: 542px;
    background-color: #ffffff;
    border: solid 1px #bfbfbf;
    margin-bottom: 40px;
  }
  .no_assets_box img{
    float: left;
  }
  .no_assets_box{
    width: 186px;
    height:70px;
    margin: 0 auto;
    position: relative;
    top: 236px;
  }
  .no_assets_box p{
    font-size: 18px;
    color: #222222;
    float:right;
    padding: 14px 0;
    padding-top: 8px;
  }
  .to_buy{
    font-size: 18px;
    color: #c6351e;
    margin-left: 12px;
  }
</style>
