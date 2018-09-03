<template>
  <div class="nav_content">
    <div class="nav_content_title">
      <span>收藏夹</span>
    </div>
    <div class="nav_content_table" v-if="favoriteList.length>0">
      <table>
        <thead>
        <tr class="content_thead">
          <th>名称</th>
          <th>权益</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr class="classify" v-if="caseList.length!==0">
          <td colspan="5">维修案例</td>
        </tr>
        <tr class="content_tbody" v-for="(item,index) of caseList" :key="item._id">
          <td @click="turnDetails(item.apikey,item.assetid)">{{item.assetname}}</td>
          <td>{{item.sell_type}}</td>
          <td class="quick_buy_td" @click="cancel(item._id)">
            <button>取消收藏</button>
          </td>
        </tr>
        <tr class="classify" v-if="facilityList.length!==0">
          <td colspan="5">维修设备</td>
        </tr>
        <tr class="content_tbody" v-for="(item,index) of facilityList" :key="item._id">
          <td @click="turnDetails(item.apikey,item.assetid)"><span><img :src="item.asseturl" alt=""></span>{{item.assetname}}</td>
          <td>{{item.sell_type}}</td>
          <td class="quick_buy_td" @click="cancel(item._id)">
            <button>取消收藏</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="clearfix paging" v-if="favoriteList.length>0">
      <el-pagination class="my_paging"
                     layout="prev, pager, next"
                     :background=true
                     :total=total
                     :page-size=pageSize
                     :current-page.sync=currentPage
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <div class="no_assets_content" v-if="favoriteList.length===0">
      <div class="no_assets_box">
        <img src="./images/empty.png" alt="">
        <p>暂时没有资产</p>
        <router-link to="/" class="to_buy">去收藏 ></router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from "axios";
  import "../../common/stylus/paging.styl";
  import {baseURL, cardURL} from '@/common/js/public.js';
  import utils from "@/common/js/utils.js";
  
  export default {
    name: "favorite",
    components: {},
    data() {
      return {
        total: 10,
        pageSize: 10,
        currentPage: 1,
        favoriteList: [],
        userId: '',
        id: "",
        token: "",
      }
    },
    computed: {
      caseList: function () {
        return this.favoriteList.filter(function (value, index, array) {
          return value.apikey === "5a6be74a55aaf50001a5e250"
        })
      },
      facilityList: function () {
        return this.favoriteList.filter(function (value, index, array) {
          return value.apikey === "5ae04522cff7cb000194f2f4"
        })
      },
    },
    mounted() {
      if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
        this.userId = JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
        this.token = JSON.parse(sessionStorage.getItem("loginInfo")).token;
      }
      this.acquireFavoriteList();
    },
    methods: {
      handleCurrentChange(val) {
        this.currentPage = val;
        this.acquireFavoriteList();
      },
      acquireFavoriteList() {
        if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
          axios({
            method: "GET",
            url: `${baseURL}/v1/shopcart/list/${this.userId}?page=${this.currentPage}&limit=${this.pageSize}`,
            headers: {
              "Content-Type": "application/json",
            }
          }).then((res) => {
            this.total = res.data.count;
            for(let v of res.data.data){
              v.created_at=utils.formatDate(new Date(v.created_at), "yyyy-MM-dd hh:mm:ss");
              v.updated_at=utils.formatDate(new Date(v.updated_at), "yyyy-MM-dd hh:mm:ss");
            }
            this.favoriteList = res.data.data;
          }).catch((err) => {
            console.log(err);
          });
        } else {
          this.favoriteList = []
        }
      },
      cancel(val) {
        this.id = val;
        axios({
          method: "DELETE",
          url: `${baseURL}/v1/shopcart/${this.userId}/${this.id}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Access-Token": this.token
          }
        }).then((res) => {
          this.acquireFavoriteList();
          this.subtractCollection()
        }).catch((err) => {
          console.log(err);
        });
      },
      subtractCollection() {
        this.$store.commit("subtractCollection")
      },
      turnDetails(apiKey, assetId) {
        if (apiKey === "5a6be74a55aaf50001a5e250") {
          this.getCaseDetails(assetId);
          this.$router.push("/caseDetails")
        } else if (apiKey === "5ae04522cff7cb000194f2f4") {
          this.getFacilityDetails(assetId);
          this.$router.push("/facilityDetails")
        }
      },
      getCaseDetails(val) {
        this.$store.commit("changeCaseDetails", _.find(this.favoriteList, function (o) {
          return o.assetid === val
        }));
      },
      getFacilityDetails(val) {
        this.$store.commit("changeFacilityDetails", _.find(this.favoriteList, function (o) {
          return o.assetid === val
        }));
      },
    }
  }
</script>
<style scoped>
  .nav_content {
    width: 1078px;
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
  
  .content_thead {
    font-size: 16px;
    color: #222222;
    height: 50px;
    line-height: 50px;
  }
  
  .content_thead th {
    width: 140px;
  }
  
  .content_thead th:first-child {
    text-align: left;
    padding-left: 46px;
    width: 800px;
  }
  
  .classify td {
    background-color: #f6f7fa;
    text-align: left;
    line-height: 40px;
    padding-left: 46px;
    font-size: 16px;
    color: #222222;
  }
  
  .content_tbody {
    border-bottom: 1px solid #d2d2d2;
  }
  
  .content_tbody td {
    font-size: 14px;
    color: #666666;
    text-align: center;
    height: 90px;
    vertical-align: middle;
  }
  
  .content_tbody td span {
    box-sizing: border-box;
    display: inline-block;
    width: 54px;
    height: 54px;
    vertical-align: middle;
    border: solid 1px #bfbfbf;
    margin-right: 40px;
  }
  
  .content_tbody td span img {
    vertical-align: middle;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    max-width: 52px;
    max-height: 52px;
  }
  
  .content_tbody td:first-child {
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
  
  .no_assets_content {
    margin-top: 12px;
    width: 1078px;
    height: 542px;
    background-color: #ffffff;
    border: solid 1px #bfbfbf;
    margin-bottom: 40px;
  }
  
  .no_assets_box img {
    float: left;
  }
  
  .no_assets_box {
    width: 186px;
    height: 70px;
    margin: 0 auto;
    position: relative;
    top: 236px;
  }
  
  .no_assets_box p {
    font-size: 18px;
    color: #222222;
    float: right;
    padding: 14px 0;
    padding-top: 8px;
  }
  
  .to_buy {
    font-size: 18px;
    color: #c6351e;
    margin-left: 12px;
  }
</style>
