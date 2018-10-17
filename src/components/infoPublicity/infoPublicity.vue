<template>
  <div>
    <div class="container">
      <div class="title">
        <span></span>
        <p>项目发起人资质信息公示</p>
      </div>
      <div class="content">
        <ul>
          <li>
            <label>公司名称：</label>
            <span>深圳市元征科技股份有限公司北京研发公司</span>
          </li>
          <li>
            <label>联系地址：</label>
            <span>北京市朝阳区建国路93号万达广场8号楼808</span>
          </li>
          <li>
            <label>官方电话：</label>
            <span>010 - 58205388</span>
          </li>
          <li>
            <label>工作时间：</label>
            <span>工作日 09:00-17:00</span>
          </li>
        </ul>
        <div class="tips">
          <p>注：以上营业执照信息，除公司名称、联系地址和官方电话已通过认证之外，其余信息由项目方自行申报填写。如需进一步核实，请联系当地工商行政管理部门。</p>
        </div>
      </div>
      <img src="./images/infoCertificate.png" alt="">
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import {baseURL} from '@/common/js/public.js';
  import myTopSearch from "../topSearch/topSearch"
  import myToggle from "../toggle/toggle"
  
  export default {
    name: "infoPublicity",
    components: {

    },
    data() {
      return {}
    },
    created() {
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {},
  }
</script>

<style scoped lang="stylus">
  .container {
    width: 1200px;
    height: 400px;
    background-color: #ffffff;
    margin: 0 auto;
    margin-top 30px;
    margin-bottom 460px;
  }
  
  .title {
    font-size: 20px;
    color: #333333;
    height: 80px;
    width: 100%;
    border-bottom: solid 1px #eeeeee;
    line-height 80px
  }
  
  .title span {
    width: 2px;
    height: 18px;
    background-color: #d91e01;
    display: inline-block;
    float: left;
    margin-top: 32px;
    margin-right: 12px;
  }
  
  .content {
    width: 600px;
    height: 222px;
    float left;
    margin: 48px 95px;
    font-size: 17px;
    color: #333333;
    line-height: normal;
  }
  
  .content ul li {
    margin-bottom: 12px
  }
  
  .tips {
    border-top: solid 1px #eeeeee;
    font-size: 12px;
    color: #666666;
    margin-top: 30px;
    padding-top: 30px;
  }
  
  .container img {
    margin-top: 22px;
    margin-left: 60px;
  }
</style>
