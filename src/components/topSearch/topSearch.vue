<template>
  <div class="topBox">.
    <div class="logo">
      <a href="/">
        <p>Trusted Assets Blockchain</p>
      </a>
    </div>
    <div class="search_box">
      <div class="search">
        <el-select class="my_select" v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="line1"></div>
        <el-input class="my_input" v-model="input" placeholder="请输入您要搜索的内容" @change="search"></el-input>
        <div class="button" @click="search"></div>
      </div>
    </div>
    <div class="favorite" @click="turnFavorite">
      <span class="s_text">收藏夹</span>
      <span class="s_num">{{this.$store.state.favoriteCount}}</span>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import {baseURL, cardURL} from '@/common/js/public.js';
  
  export default {
    name: "topSearch",
    data() {
      return {
        options: [{
          value: '1',
          label: '共享维修案例'
        }, {
          value: '2',
          label: '共享维修设备'
        },
          {
            value: '3',
            label: '共享诊断报告'
          },],
        value: '1',
        input: '',
        userId: '',
        token: "",
      }
    },
    mounted() {
      if (sessionStorage.getItem("loginInfo")) {
        this.userId = JSON.parse(sessionStorage.getItem("loginInfo")).user_id;
        this.token = JSON.parse(sessionStorage.getItem("loginInfo")).token;
        this.acquireFavoriteCount();
      }
    },
    computed: {
      favoriteCount: function () {
        return this.$store.state.favoriteCount
      }
    },
    watch: {
      favoriteCount: function () {
        this.acquireFavoriteCount();
      }
    },
    methods: {
      open() {
        this.$confirm('此操作需要先登录, 是否登录?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          this.$router.push("/login")
        }).catch(() => {
        });
      },
      acquireFavoriteCount() {
        axios({
          method: "GET",
          url: `${baseURL}/v1/shopcart/count/${this.userId}`,
          headers: {
            "Content-Type": "application/json",
          }
        }).then((res) => {
          this.$store.state.favoriteCount = res.data;
        }).catch((err) => {
          console.log(err);
        })
      },
      clearInput() {
        this.input = "";
      },
      turnFavorite() {
        if (JSON.parse(sessionStorage.getItem("loginInfo"))) {
          this.$router.push("/favorite")
        } else {
          this.open()
        }
      },
      search(val, int) {
        let searchObj = {};
        searchObj.value = this.value;
        searchObj.input = this.input;
        this.getSearch(searchObj);
        if (this.value === '1') {
          this.$router.push('/searchCase')
        } else if (this.value === '2') {
          this.$router.push('/searchFacility')
        } else if (this.value === '3') {
          this.$router.push('/searchReport')
        }
      },
      getSearch(searchObj) {
        this.$store.commit("changeSearch", searchObj);
      },
    },
    components: {},
  }
</script>

<style scoped lang="stylus">
  .topBox {
    font-size 0
    box-sizing border-box
    width 1212px
    height 130px
    margin 0 auto
    .logo, .search_box, .favorite {
      display inline-block
      font-size 14px
      vertical-align top
    }
    .logo {
      margin-top 30px
      margin-left 8px
      margin-right 40px
      a {
        display inline-block
        color #d92000
        font-size 10px
        background-image: url('./images/logo.png');
        background-position: top left;
        background-repeat: no-repeat;
        width 226px
        height 58px
        position relative
        p {
          position absolute
          left 68px
          bottom 0
        }
      }
    }
    .search_box {
      width 680px
      margin-top 35px
      .search {
        margin-bottom 8px
        box-sizing border-box
        background-color #ffffff
        width: 680px;
        height 34px
        line-height 34px
        border: 1px solid #c6351e;
        font-size 0
        .line1 {
          display inline-block
          width 1px
          height 20px
          margin-top 6px
          background-color #bfbfbf;
          vertical-align top
        }
        .button {
          display inline-block
          width 70px
          height 32px
          line-height 32px
          background-color #c6351e
          vertical-align top
          background-image: url('./images/search.png');
          background-position: top 3px center;
          background-repeat: no-repeat;
          cursor pointer
        }
      }
      .keyword {
        color #acacac
        font-size 0
        li {
          display inline-block
          font-size 14px
          margin-right 10px
        }
        li:first-child {
          margin-right 0
        }
      }
    }
    .favorite {
      cursor pointer
      box-sizing border-box
      width 202px
      height 34px
      line-height 32px
      border 1px solid #c6351e
      margin-top 35px
      margin-left 54px
      padding-left 80px
      background-image: url('./images/like.png');
      background-position: top 6px left 50px;
      background-repeat: no-repeat;
      background-color #ffffff
      color #c6351e
      font-size 0
      position relative
      .s_text {
        display inline-block
        font-size 14px
      }
      .s_num {
        width 20px
        height 20px
        line-height 20px
        text-align center
        font-size 10px
        display inline-block
        color #ffffff
        background-color #c6351e
        border-radius 50%
        position absolute
        top 2px
        left 132px
      }
    }
  }
</style>
<style lang="stylus">
  .el-select.my_select {
    width 131px
    vertical-align top
    .el-input--suffix .el-input__inner {
      border-radius: 0
      color #333333
      border: none;
      height: 32px;
      line-height: 32px;
      outline: 0;
      vertical-align top
      padding 0
      padding-left 15px
    }
    .el-input .el-select__caret {
      color #333333
      vertical-align middle
    }
  }
  
  .el-input.my_input {
    display inline-block
    width 476px
    .el-input__inner {
      border: none;
      height: 32px;
      line-height: 32px;
      vertical-align top
    }
  }
</style>
