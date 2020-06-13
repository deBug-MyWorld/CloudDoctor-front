<template>
  <div id="container">
    <div id="illness-menu">
    <el-menu class="el-menu-vertical-demo" @select="handleSelect">
      <el-menu-item index="1"><i class="el-icon-tickets"></i>概述</el-menu-item>
      <el-menu-item index="2"><i class="el-icon-question"></i>病因</el-menu-item>
      <el-menu-item index="3"><i class="el-icon-coordinate"></i>症状</el-menu-item>
      <el-menu-item index="4"><i class="el-icon-add-location"></i>检查</el-menu-item>
      <el-menu-item index="5"><i class="el-icon-first-aid-kit"></i>治疗</el-menu-item>
      <el-menu-item index="6"><i class="el-icon-chat-dot-round"></i>并发症</el-menu-item>
      <el-menu-item index="7"><i class="el-icon-cloudy"></i>预防</el-menu-item>
      <el-menu-item index="8"><i class="el-icon-food"></i>饮食</el-menu-item>
    </el-menu>
    </div>
    <div id="context">
      <info-head style="margin-top:0.1rem;" ref="infoHead" @user="userListen"></info-head>  
      <div class="information">
        <h1 style="color:blue">{{illnessInfo.illness}}</h1>
        <el-divider></el-divider>
        <img style="width:250px;height:180px;" :src="illnessInfo.img">
        <h2 style="width:50px;" id="1">概述</h2>
        <el-divider></el-divider>
        <div class="message" v-html="illnessInfo.summarize"></div>
        <h2 style="width:50px;" id="2">病因</h2>
        <el-divider></el-divider>
        <div class="message" v-html="illnessInfo.causeDisease"></div>
        <h2 style="width:50px;" id="3">症状</h2>
        <el-divider></el-divider>
        <div class="message"  v-html="illnessInfo.symptoms"></div>
        <h2 style="width:50px;" id="4">检查</h2>
        <el-divider></el-divider>
        <div class="message" v-html="illnessInfo.illnessCheck"></div>	      
        <h2 style="width:50px;" id="5">治疗</h2>
        <el-divider></el-divider>
        <div class="message" v-html="illnessInfo.treatment"></div>		
        <h2 style="width:80px;" id="6">并发症</h2>
        <el-divider></el-divider>
        <div class="message" v-html="illnessInfo.complications"></div>			
        <h2 style="width:50px;" id="7">预防</h2>
        <el-divider></el-divider>
        <div class="message"  v-html="illnessInfo.prevention"></div>		
        <h2 style="width:50px;" id="8">饮食</h2>
        <el-divider></el-divider>
        <div class="message" v-html="illnessInfo.diet"></div>		
    </div> 
    <foot></foot> 
    </div>
  </div>
</template>

<script>
import infoHead from "../components/infohead.vue";
import foot from "../components/foot.vue"
export default {
  components: {
    infoHead,foot
  },
  data() {
    return {
      illnessInfo: {},
      user:{}
    };
  },
  created() {
    this.getIllnessInfo(this.$route.params.id);
  },
  mounted () {//给window添加一个滚动滚动监听事件
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {//离开该页面需要移除这个监听的事件
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    userListen(value) {
      this.user = value;
      console.log("index这是首页");
      console.log(this.user);
    },
    getIllnessInfo(id) {
      var url = "/illness/selectIllnessById";
      this.$axios
        .get(url, {
          params: {
            illnessId: id
          }
        })
        .then(res => {
          // console.log(res.data);
          this.illnessInfo = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳转
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      document.getElementById(key).scrollIntoView();
    },
    handleScroll(){
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      var offsetTop = document.querySelector('#illness-menu').offsetTop;
      if(scrollTop<=4550){
          offsetTop =300 + Number(scrollTop);
          document.querySelector('#illness-menu').style.top = offsetTop+'px';
        }else{
          document.querySelector('#illness-menu').style.top = '4550px';
        }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#context {
  /* background-color: whitesmoke; */
  width: 1800px;
  margin: 0 auto;
}
.message{
  text-align:left;
  width: 1200px;
}
.information {
  position: relative;
  width: 1200px;
  left: 300px;
  top: 20px;
  height: auto;
}
#illness-menu{
  position: absolute;
  height:450px;
  z-index: 999;
  top: 300px;
  left: 1600px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>