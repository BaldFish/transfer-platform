<template>
  <el-pagination class="my_paging"
                 layout="prev, pager, next"
                 :background=true
                 :total=total
                 :page-size=pageSize
                 :current-page.sync=currentPage
                 @current-change="handleCurrentChange">
  </el-pagination>
</template>

<script>
  export default {
    name: "paging",
    data() {
      return {
      }
    },
    props:{
      total:{
        type:Number,
        default:10
      },
      pageSize:{
        type:Number,
        default:5
      },
      currentPage:{
        type:Number,
        default:1
      }
    },
    methods:{
      handleCurrentChange(val){
        console.log(val)
        this.$emit("w",val)
      },
    }
  }
</script>

<style scoped lang="stylus">

</style>
<style lang="stylus">
  .el-pagination.my_paging {
    white-space: nowrap;
    padding: 20px 0 30px;
    color: #666666;
    font-weight: normal;
  }
</style>
