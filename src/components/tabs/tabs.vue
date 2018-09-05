<template>
  <div class="tabs">
    <div class="nav_body">
      <div class="nav_mid">
        <nav class="nav_tab">
          <ul>
            <li>
              <router-link to="/personalAssets">
                <span></span>
                <p>个人资产</p>
              </router-link>
            </li>
            <li>
              <router-link to="/favorite">
                <span></span>
                <p>收藏夹</p>
              </router-link>
            </li>
            <li>
              <router-link to="/orderHistory">
                <span></span>
                <p>历史订单</p>
              </router-link>
            </li>
            <li>
              <router-link to="/securityCenter">
                <span></span>
                <p>安全中心</p>
              </router-link>
            </li>
          </ul>
        </nav>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import myPaging from "../paging/paging"
  import {baseURL,cardURL} from '@/common/js/public.js';
  export default {
    name: "tabs",
    components: {
      myPaging,
    },
    data() {
      return {
        toggleIndex: 0,
      }
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
  .nav_body{
    background-color: #f3f3f3;
    padding-top 20px
  }
  .nav_mid{
    width: 1212px;
    margin:0 auto;
  }
  .nav_tab{
    font-size: 18px;
    width: 100px;
    height: 128px;
    float: left;
  }
  .nav_tab p{
    color: #222222;
    line-height: 34px;
  }
  .nav_tab span{
    width: 14px;
    height: 14px;
    background-color: #7d7d7d;
    display: inline-block;
    float: left;
    margin-top: 10px;
    margin-right: 10px;
  }
</style>
