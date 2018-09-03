<template>
  <div class="progressBar">
    <div class="progress_bar_box">
      <div class="progress_bar" :style="progressBar"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "progressBar",
    components: {},
    props:{
      percentage:{
        type: Number,
        default: 0,
        required: true,
      }
    },
    data() {
      return {}
    },
    created() {
    },
    mounted() {
    },
    watch: {},
    computed: {
      progressBar(){
        let style={};
        style.width=this.percentage + "%";
        return style
      }
    },
    methods: {},
  }
</script>

<style scoped lang="stylus">
  .progressBar{
    .progress_bar_box{
      width 260px
      height 8px
      background-color: #e5e5e5;
      border-radius: 4px;
      .progress_bar{
        height: 8px;
        background-image: linear-gradient(270deg, #4b85b0 0%, #a54373 0%, #ff0036 0%, #a00031 100%)
        linear-gradient(#d91e01, #d91e01);
        border-radius: 4px;
      }
    }
  }
</style>
