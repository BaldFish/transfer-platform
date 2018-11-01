<template>
  <div class="developer">
    <div class="dev"></div>
  </div>
</template>

<script>
  export default {
    name: "developer",
    components: {},
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
  .developer{
    .dev{
      max-width 1920px
      height 1080px
      margin 0 auto
      background-image: url('./images/developer.png');
      background-repeat: no-repeat;
      background-position: top center;
    }
  }
</style>
