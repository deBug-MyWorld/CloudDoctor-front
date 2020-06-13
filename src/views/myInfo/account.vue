<template>
  <div id="container">
    <div id="context">
        <info-head style="margin-top:0.1rem;" ref="infoHead" @user="userListen"></info-head>      
        <div class="account-menu">
            <el-menu
            :default-active="this.$route.path=='/account'?'/account/information':this.$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            :router="true"
            active-text-color="#ffd04b">
            <el-menu-item-group>
              <div style="color:white">个人中心</div>
              <el-menu-item :index="'/account/information'"><i class="el-icon-document"></i>我的信息</el-menu-item>
              <el-menu-item :index="'/account/myWallet'"><i class="el-icon-wallet"></i>我的钱包</el-menu-item>
              <el-menu-item :index="'/account/myDoctor'"><i class="el-icon-star-on"></i>我的医生</el-menu-item>
              <el-menu-item :index="'/account/myAnswer/'+user.isDoctor" v-if="user.isDoctor!=0"><i class="el-icon-s-opportunity"></i>我的回答</el-menu-item>
              <el-menu-item :index="'/account/doctorCertify'"><i class="el-icon-s-custom"></i>医生认证</el-menu-item>
              <el-menu-item :index="'/doctorChatRoom/D'+user.isDoctor" v-if="user.isDoctor!=0"><i class="el-icon-chat-round"></i>聊天室</el-menu-item>
              <el-menu-item :index="'/admin'" v-if="user.isAdmin==1"><i class="el-icon-s-tools"></i>后台管理</el-menu-item>
            </el-menu-item-group>
            </el-menu>  
            <div class="content"><router-view></router-view></div>           
        </div>  
        <foot></foot>      
    </div>
  </div>
</template>

<script>
import infoHead from "../../components/infohead.vue";
import foot from "../../components/foot.vue";
export default {
  components: {
    infoHead,
    foot
  },
  data() {
    return {
      user: {}
    };
  },
  created() {},
  methods: {
    userListen(value) {
      this.user = value;
      console.log("index这是账号页");
      console.log(this.user);
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#context {
  background-color: whitesmoke;
  width: 1800px;
  margin: 0 auto;
}
.account-menu {
  position: relative;
  width: 1200px;
  left: 350px;
  top: 20px;
  height: auto;
  /* border: 1px solid red; */
  display: flex;
  flex-wrap: nowrap;
}
.el-menu-vertical-demo {
  width: 15%;
  position: relative;
}
.el-menu-vertical-demo.el-menu {
  height: 800px;
}
.content {
  /* border: 1px solid red; */
  width: 900px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>