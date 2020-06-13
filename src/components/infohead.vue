<template>
  <!-- 包含顶部信息栏和搜索框 -->
  <div id="container">
    <div id="context">
      <div class="head">
        <div class="go-home">
          <div class="time">
            <i class="el-icon-alarm-clock"></i>
            <el-tag type="info" style="font-size:16px;background: rgb(217, 232, 233);">{{date |formatDateTime}}</el-tag>            
          </div>
          <el-button plain style="font-size:14px;" @click="home" icon="el-icon-s-home" type="success">首页</el-button>
        </div>
        <div id="my-info" v-show="loginSuccess">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <img :src="user.icon">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="个人中心" >个人中心</el-dropdown-item>
              <el-dropdown-item command="我的医生" >我的医生</el-dropdown-item>
              <el-dropdown-item command="我的钱包" >我的钱包</el-dropdown-item>
              <el-dropdown-item command="后台管理" v-if="user.isAdmin==1" >后台管理</el-dropdown-item>
              <el-dropdown-item command="注销" divided >注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div id="choice">
          <ul>
            <li v-if="!loginSuccess">
              <router-link :to="{name:'login'}">
                <a>登录</a>
              </router-link>
            </li>
            <li v-else>
                <a>{{user.username}}</a>
            </li>
            <li>
              <a href="https://www.baidu.com" target="_blank">关于我们</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="search">
        <div class="my-logo">
          <a href="http://localhost:8082/index">
          <img style="width:200px;height:100px;" src="../../static/myLogo.png">
          </a>
        </div>
        <div class="search-input">
          <el-input 
            slot="reference"
            placeholder="请输入疾病名称、医生或科室"
            v-model="input"
            class="input-with-select"
            style="width:650px;"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </div>
      </div>
      <div class="my-adv">
         <a >
           <img src="../../static/askFree.png">
         </a>
      </div>      
    </div>
		 <!-- 提示音 -->
		 <audio id="audio" src="../../static/audio/msg.mp3" ref="hintAudio"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginSuccess: false,
      user: {},
      date: new Date(),
      input: "",
    };
  },
  filters: {
    formatDateTime(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  },
  mounted() {
    let _this = this;
    this.timer = setInterval(() => {
      _this.date = new Date();
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  created() {
    this.getThisUser();
  },
  methods: {
    home() {
      this.$router.push({
        name: "index"
      });
    },
    logout() {
      sessionStorage.clear();
      location.reload();
    },
    getThisUser() {
      // console.log(sessionStorage.getItem('username'))
      let username = sessionStorage.getItem("username");
      if (username != null) {
        this.$axios
          .get("/user/queryUserByUname", {
            params: {
              username: username
            }
          })
          .then(res => {
            console.log(res.data);
            this.user = res.data;
            this.loginSuccess = true;
            this.$emit("user", this.user);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    handleCommand(command) {
      if (command == "个人中心") {
        this.$router.push({
          path: "/account"
        });
      }
      if (command == "我的医生") {
        this.$router.push({
          path: "/account/myDoctor"
        });
      }
      if (command == "我的钱包") {
        this.$router.push({
          path: "/account/myWallet"
        });
      }
      if (command == "后台管理") {
        this.$router.push({
          path: "/admin"
        });
      }
      if (command == "注销") {
        this.logout();
      }
    },
    handleSearch() {
      var path = this.$route.path;
      console.log(path);
      if (this.input != "") {
        var re = /[\u4e00-\u9fa5]/;
        if (re.test(this.input)) {
          this.$router.push({
            path: "/search",
            query: {
              keyword: this.input
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "内容不合法",
            duration: 6000
          });
        }
      }
    },
    hint() {
      this.$refs.hintAudio.play();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  position: relative;
  border-bottom: 1px solid #24bda3;
  margin-top: -3.75rem;
  margin-left: auto;
  margin-right: auto;
  height: 160px;
  width: 1800px;
  background-color: white;
}
.head {
  background: rgb(217, 232, 233);
  height: 40px;
  width: 1800px;
}
.go-home {
  position: relative;
  left: 250px;
  height: 40px;
  width: 400px;
}
.time {
  float: left;
}
#my-info {
  width: 60px;
  height: 60px;
  position: relative;
  float: right;
  right: 480px;
  top: -30px;
}
#my-info img {
  /*圆形头像*/
  width: 50px;
  height: 50px;
  border-radius: 50px;
  cursor: pointer; /*光标呈现为指示链接的指针*/
  transition: all 0.2s; /*表示所有的属性变化在0.6s的时间段内完成*/
}
#my-info img:hover {
  transform: scale(1.4); /*表示在鼠标放到图片上的时候图片按比例放大1.4倍*/
}
#choice {
  position: relative;
  top: -40px;
  float: right;
  width: 400px;
  /* margin-right: 50px; */
}
#choice ul {
  padding-left: 0px;
  margin: 0px;
  height: 40px;
}
#choice li {
  padding: 10px;
  padding-right: 15px;
  float: left;
  list-style: none; /*设置列表标记的 默认会是实心圆点 设成none就是没有标记*/
}
#choice a:hover,
a:active {
  color: black; /*鼠标移动过来颜色变黑*/
}
#choice a {
  color: rgb(255, 0, 149);
  font-size: 16px;
}
a {
  text-decoration: none; /*不显示链接的下划线*/
}
.my-logo {
  position: relative;
  width: 200px;
  height: 100px;
}

.search {
  top: 15px;
  position: relative;
  height: 100px;
  width: 1000px;
  left: 300px;
}
.search-input {
  position: relative;
  margin-top: -60px;
  width: 750px;
  margin-left: 200px;
}
.my-adv {
  position: relative;
  width: 200px;
  float: right;
  top: -75px;
  margin-right: 300px;
}
</style>