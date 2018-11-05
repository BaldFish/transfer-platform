<template>
  <div class="nav_content">
    <div class="assets_summary">
      <p>186***4168</p>
      <p>未绑定钱包地址
        <router-link to="" class="to_bind">去绑定 ></router-link>
      </p>
      <p>数据豆：0.00</p>
    </div>

    <div class="nav_content_title">
      <span>已购资产</span>
    </div>

    <div class="no_assets_content">
      <div class="no_assets_box">
        <img src="./images/empty.png" alt="">
        <p>暂时没有资产</p>
        <router-link to="" class="to_buy">去购买 ></router-link>
      </div>
    </div>

  </div>
</template>

<script>
  export default{
    name: "noAssets",
    components: {},
    data(){
      return {
      }
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
    background-color: #f6f8fa;
    border: solid 1px #bfbfbf;
    border-bottom: none;
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
  .nav_content_title span{
    padding-left: 20px;
  }
  .no_assets_content{
    width: 1078px;
    height: 542px;
    background-color: #ffffff;
    border: solid 1px #bfbfbf;
    border-top: none;
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
