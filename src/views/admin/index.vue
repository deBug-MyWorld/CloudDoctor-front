<template>
  <div id="container">
    <div class="admin-head">
      <div class="admin-title" @click="isCollapse=!isCollapse"><i :class="isCollapse?'el-icon-setting':'el-icon-s-tools'"></i>云医社后台管理系统</div>
      <div class="admin-info">
        <img :src="user.icon" class="imgsize">
        <el-dropdown class="admin-name" @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            {{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="我的信息">我的信息</el-dropdown-item>
            <el-dropdown-item command="注销" divided>注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="admin-menu">
        <el-menu
        :default-active="this.$route.path=='/admin'?'/admin':this.$route.path" 
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        :router="true"
        :collapse="isCollapse"
        active-text-color="rgb(32, 160, 255)">
        <el-menu-item :index="'/admin'"><i class="el-icon-s-home"></i> <span slot="title">系统首页</span></el-menu-item>        
        <el-menu-item :index="'/admin/Account'"><i class="el-icon-user"></i><span slot="title">账户管理</span></el-menu-item>
        <el-menu-item :index="'/admin/Illness'"><i class="el-icon-first-aid-kit"></i><span slot="title">疾病管理</span></el-menu-item>
        <el-menu-item :index="'/admin/Doctor'"><i class="el-icon-s-custom"></i><span slot="title">医生管理</span></el-menu-item>
        <el-menu-item :index="'/admin/Department'"><i class="el-icon-school"></i><span slot="title">科室管理</span></el-menu-item>
        <el-submenu index='6'>
          <template slot="title">
            <i class="el-icon-place"></i>
            <span slot="title">用户操作管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="'/admin/Comment'">评论管理</el-menu-item>
            <el-menu-item :index="'/admin/Chat'">咨询管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item :index="'/admin/Order'"><i class="el-icon-notebook-2"></i><span slot="title">流水账信息</span></el-menu-item>
        </el-menu>  
        <div class="content">
          <div v-if="this.$route.path=='/admin'&&this.user.isAdmin == 1" class="welcome">
            <h1>welcome</h1>
            <img :src="user.icon" >
            <div style="font-size:30px;margin-top:10px;">{{user.username}}</div>
          </div>
          <router-view v-if="this.user.isAdmin == 1"></router-view>
        </div>           
    </div>  
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      user: {},
      isCollapse: false
    };
  },
  created() {
    this.getThisUser()
  },
  methods: {
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
            if (this.user.isAdmin == 0) {
              this.$alert("权限不允许！！！", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.$router.go(-1);
                }
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    handleCommand(command) {
      if (command == "我的信息") {
        this.$router.push({
          path: "/account"
        });
      }
      if (command == "注销") {
        sessionStorage.clear();
        location.reload();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.admin-head {
  height: 60px;
  width: 1843px;
  background-color: #242f42;
}
.admin-title {
  text-align: left;
  margin-left: 10px;
  font-size: 21px;
  color: white;
  cursor: pointer;
  padding-top: 10px;
  width: 210px;
}
.admin-info {
  position: relative;
  text-align: left;
  width: 150px;
  float: right;
  top: -30px;
  display: flex;
}
.imgsize {
  width: 50px;
  height: 50px;
  border-radius: 50px;
}
.admin-name {
  color: white;
  padding-top: 15px;
  margin-left: 10px;
}
.admin-menu {
  position: relative;
  top: -27px;
  height: 830px;
  width: 1843px;
  display: flex;
}
.el-menu-vertical-demo.el-menu {
  height: 830px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
  min-height: 400px;
  text-align: left;
}
.el-dropdown-link {
  cursor: pointer;
}
.content {
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
}
.welcome {
  position: relative;
  top: 100px;
  width: 500px;
  height: 220px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-image: linear-gradient(to top, #5ee7df 0%, #b490ca 100%);
}
.welcome img {
  width: 100px;
  height: 100px;
  border-radius: 50px;
}
</style>