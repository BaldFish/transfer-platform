<template>
    <div>
      <my-topSearch></my-topSearch>
      <div class="publicity">
        <div class="title">
          <h2>
            <span></span>
            可信链如何打造资产全流程可信机制？
          </h2>
          <p>随着区块链技术的日益火热，可信化的实现成为人人关注的焦点。作为一家专注于区块链底层技术架构搭建及产业落地的团队，可信链一直在思考如何将区块链技术的可信性优势实现最大化的发挥。</p>
          <p>按照可信链的计划中，未来在可信链平台上展示的所有资产，都将完全实现 “区块链技术可信+上链数据安全+上链过程可信”的真正的全流程可信机制。</p>
        </div>
        <section>
          <img src="./images/one.png" alt="">
          <div class="sec-text">
            <h3>区块链技术可信 ——不可篡改的天然技术屏障</h3>
            <p>众所周知，大热的区块链技术具备去中心化、信息不可篡改、可溯源的特性，数据一旦上链，将无法被更正，不存在被篡改的可能。</p>
            <p>基于此，区块链技术向来被誉为“打造信任的机器”，在金融、农业、汽车、公益等各个行业得以实现落地应用布局。</p>
            <p>极具革新性的技术令众多区块链从业者血脉喷张，何其颠覆，未来可期！</p>
          </div>
        </section>
        <section>
          <img src="./images/two.png" alt="">
          <div class="sec-text">
            <h3>上链数据安全——可信设备解决方案是区块链落地的前提</h3>
            <p>区块链技术的天然属性可保障上链后的数据不被篡改，可数据上链前的可信化，如何保证？</p>
            <p>可信链认为，“在虚拟资产上链前的可信机制无法确立之前，区块链技术的落地应用将无从谈起，正如缺乏稳固地基的高楼大厦，盖得越高，越存在倾塌的可能。所以，对于区块链从业者而言，可以说一切避开可信设备空谈技术落地应用的都是‘耍流氓’。”</p>
            <p>可信链技术团队拥有世界顶尖的数据安全研究团队，并已经在上链数据安全方向开展了卓有成效的研究工作，通过将金融安全级别的SE安全芯片搭载在区块链终端设备上，可以检测虚拟资产上链过程的安全及可信性，每一部终端设备都将安装此芯片。</p>
            <br>
            <br>
            <p>目前，可信链打造的可信设备上链解决方案已经在汽车领域获得了初步应用。在刚刚面向市场上线的元征科技基于区块链技术的共享维修站上，元链已为每一台共享维修设备配备带有SE安全芯片的可信设备终端——可信盾，以确保上链数据安全可信及上链数据的真实性溯源。</p>
          </div>
        </section>
        <section>
          <img src="./images/01.png" alt="" class="img-01">
          <img src="./images/02.png" alt="">
          <div class="sec-text">
            <h3>上链过程可信——公安部司法机构监管加持</h3>
            <p>可除增加可信设备提升上链数据可信性之外，我们还联合公安部第一研究所电子数据取证与鉴定技术实验室，以及北京网络行业协会电子数据司法鉴定中心，共同成立区块链联合实验室，共同制定具有法律效应的可信上链流程。</p>
            <p>通过成立区块链联合实验室，可有效保障区块链研究的稳步推进，未来可对区块链上链环节提供全程技术支持与监管。这也将为基于区块链技术的落地应用平台的稳定有效运作提供大力保障，有效提升流程运作的合法性和可信度。</p>
            <p>基于区块链联合实验室，我们正在打造一个集“区块链不可篡改保障+司法鉴定机构支持监管+实名认证+保险赔付先行赔付保障”等多重保障的“区块链超级保障体系”，并有望应用在区块链体系全流程中，保障上链过程可信化。</p>
          </div>
        </section>
        <section>
          <img src="./images/last.png" alt="">
          <div class="sec-text last-text">
            <p>我们认为，打造可信设备势在必行，这将是区块链技术下一步发展的必然趋势。唯有可信设备上链，从源头加强上链的可信性，加之司法鉴定机构的监管加持，区块链技术的不可篡改等优势特点才能做到有的放矢，其颠覆性革新功能才能得以最大化发挥。</p>
            <p>区别于以往区块链项目大肆鼓吹的“局地可信”，我们讲给所有用户呈现的将是真正的“全流程可信”的区块链全新服务。</p>
          </div>
        </section>
      </div>
    </div>
</template>

<script>
  import myTopSearch from "../topSearch/topSearch"

  export default {
    name: "publicityPage",
    data() {
        return {}
    },
    created() {
    },
    mounted() {
    },
    methods: {},
    watch: {},
    computed: {},
    components: {
      myTopSearch
    },
  }
</script>

<style scoped lang="stylus">
  .publicity{
    width:1212px;
    margin:0 auto;
  }
  .title h2{
    text-align: center;
    font-size: 28px;
    color: #333333;
    margin: 38px auto;
  }
  .title h2 span{
    width: 16px;
    height: 17px;
    background-color: #c6351e;
    display: inline-block;
    margin-right: 6px;
  }
  .title p{
    text-indent: 2em;
    line-height: normal;
    font-size: 14px;
    color: #333333;
  }
  section{
    margin-top: 30px;
    text-align: center;
  }
  section .sec-text h3{
    text-align: left;
    line-height: normal;
    font-size: 20px;
    color: #333333;
    margin-top: 30px;
    margin-bottom: 6px;
  }
  section .sec-text p{
    text-indent: 2em;
    text-align: left;
    line-height: normal;
    font-size: 14px;
    color: #333333;
  }
  .last-text{
    margin-top: 30px;
    margin-bottom: 60px;
  }
  .img-01{
    margin-right: 55px;
  }
</style>
