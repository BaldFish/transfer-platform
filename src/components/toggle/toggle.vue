<template>
  <div class="toggle">
    <ul>
      <li v-for="(item,index) of toggleParam" @click="toggle(index)" :class="{active:index===toggleIndex}">{{item}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "toggle",
    components: {},
    data() {
      return {
        toggleParam: ["交易平台", "转让平台"],
      }
    },
    props: {
      toggleIndex: {
        type: Number,
        default: 0
      },
    },
    created() {
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {
      toggle(index) {
        if (index === 0) {
          window.open('http://47.92.98.66:5000')
          /*          if(JSON.parse(sessionStorage.getItem("loginInfo"))&&JSON.parse(sessionStorage.getItem("userInfo"))){
            let info={};
            info.loginInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
            info.userInfo=JSON.parse(sessionStorage.getItem("userInfo"));
            console.log(info);
            let popup = window.open('http://10.0.0.123:5000',"title");
            setTimeout(function () {
              popup.postMessage(info, 'http://10.0.0.123:5000');
            }, 2000);
          }else{
            window.open('http://10.0.0.123:5000')
          }*/
        } else if (index === 1) {
          this.$router.push("/transferPlatform")
        }
      }
    },
  }
</script>

<style scoped lang="stylus">
  .toggle {
    width 100%
    border 1px solid #d91e01
    background-color #d91e01
    ul {
      width 1212px
      margin 0 auto
      font-size 0
      padding-left 34px
      li {
        display inline-block
        margin-right 20px
        text-align center
        width 106px
        height 48px
        line-height 48px
        font-size: 16px;
        color: #f3f3f3;
        cursor pointer
      }
      li:active {
        background-color #ffffff
        color: #d91e01;
      }
      .active {
        background-color #ffffff
        color: #d91e01;
      }
    }
  }

</style>
