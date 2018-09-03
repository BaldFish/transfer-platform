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
        toggleParam:["交易平台","转让平台"],
      }
    },
    props:{
      toggleIndex:{
        type:Number,
        default:0
      },
    },
    created() {
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {
      toggle(index){
        if(index===0){
          this.$router.push("/home")
        }else if(index===1){
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
      .active{
        background-color #ffffff
        color:#d91e01;
      }
    }
  }

</style>
