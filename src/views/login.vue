<template>
  <div id="container">
      <div v-if="value" id="Form">
          <h1 >{{tip}}</h1>
          <div id="input">
              <el-input v-model="username" @blur="userNameBlur()"  prefix-icon="el-icon-s-custom" placeholder="Username" clearable></el-input>
              <br>
              <br>
              <br>
              <el-input placeholder="Password" @blur="passWordBlur()" prefix-icon="el-icon-lock" v-model="password" show-password clearable></el-input>
              <br>
              <br>
              <br>
              <el-input v-model="validatecode" prefix-icon="el-icon-folder-checked" placeholder="Validatecode" @blur="checkCode()" style="width:150px;float:left;" clearable></el-input>
              <el-button type="info" plain style="width:130px;float:right" @click="generatedCode()">{{validatecode2}}</el-button>
          </div>
          <div id="btn">
              <el-button type="primary" :loading="loading" style="width:300px;font-size:20px;" @click="Login()" round>Login</el-button>
          </div>
          <div id="other">
              <div id="goRegister" style="float:left">
                 <el-link style="font-size:15px;" @click="change()">没有账号？去注册</el-link>
              </div>
          </div>
      </div>
      <div v-else id="Form">
          <h1>{{tip}}</h1>
          <div id="input">
              <el-input v-model="username" @blur="userNameBlur()"  prefix-icon="el-icon-s-custom" placeholder="Username" clearable></el-input>
              <br>
              <br>
              <br>
              <el-input placeholder="Password" @blur="passWordBlur()" prefix-icon="el-icon-lock" v-model="password" show-password clearable></el-input>
              <br>
              <br>
              <br>
              <el-input placeholder="passwordAffirm"  prefix-icon="el-icon-lock" v-model="passwordAffirm" show-password clearable></el-input>
              <br>
              <br>
              <br>
          </div>
          <div id="btn">
              <el-button type="primary" :loading="loading" style="width:300px;font-size:20px;" @click="Register()" round>Register</el-button>
          </div>
           <el-link style="font-size:16px;margin-top:1em;" @click="change()">返回登录页</el-link>
      </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      value: true, //登录与注册页面切换
      tip: "Login",
      username: "", //用户名
      password: "", //密码
      validatecode: "", //验证码
      validatecode2: "", //匹配验证码
      loading: false,
      passwordAffirm: "", //再次输入密码
      registerFlag: false //注册页面成功后进入下一个页面
    };
  },
  created() {
    this.generatedCode();
    this.username = "";
    this.password = "";
    this.validatecode = "";
    this.passwordAffirm = "";
  },
  methods: {
    userNameBlur() {
      if (this.username == "") {
        this.$message({
          type: "error",
          message: "请输入用户名！",
          duration: 6000
        });
      } else {
        var nRE = /^[\u4E00-\u9FA5A-Za-z0-9]{2,15}$/;
        if (!nRE.test(this.username)) {
          this.$message({
            type: "error",
            message: "用户名为字母数字或汉字组合，长度在2-15之间",
            duration: 6000
          });
        }
      }
    },
    passWordBlur() {
      if (this.password == "") {
        this.$message({
          type: "error",
          message: "请输入密码！",
          duration: 6000
        });
      } else {
        var pwdRE = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,10}$/;
        if (!pwdRE.test(this.password)) {
          this.$message({
            type: "error",
            message:
              "密码请包含大小写字母和数字组合，长度在8-10之间，不能使用特殊字符",
            duration: 6000
          });
        }
      }
    },
    generatedCode() {
      const random = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ];
      var code = "";
      for (var i = 0; i < 4; i++) {
        var index = Math.floor(Math.random() * 36);
        code += random[index];
      }
      this.validatecode2 = code;
    },
    checkCode() {
      if (this.validatecode != this.validatecode2) {
        this.$message({
          type: "error",
          message: "请正确输入验证码",
          duration: 6000
        });
        this.validatecode = "";
        this.generatedCode();
      }
    },
    change() {
      this.value = !this.value;
      this.generatedCode();
      if (this.value == true) {
        this.tip = "Login";
      } else {
        this.tip = "Register";
        const h = this.$createElement;
        this.$notify({
          title: "用户名",
          message: h(
            "i",
            { style: "color: teal" },
            "用户名为字母数字或汉字组合，并且长度在2-15之间"
          ),
          duration: 0
        });
        setTimeout(() => {
          this.$notify({
            title: "密码",
            message: h(
              "i",
              { style: "color:teal" },
              "密码请包含大小写字母和数字组合，长度在8-10之间，不能使用特殊字符"
            ),
            duration: 0
          });
        }, 800);
      }
      this.loading = false;
      this.username = "";
      this.password = "";
      this.validatecode = "";
      this.passwordAffirm = "";
    },
    checkLogin() {
      let me = this;
      if (me.username == "") {
        this.$message({
          type: "error",
          message: "请输入用户名！",
          duration: 6000
        });
        return false;
      }
      if (me.password == "") {
        this.$message({
          type: "error",
          message: "请输入密码！",
          duration: 6000
        });
        return false;
      }
      if (!this.registerFlag) {
        if (me.validatecode == "") {
          this.$message({
            type: "error",
            message: "请输入验证码！",
            duration: 6000
          });
          return false;
        }
      }
      return true;
    },
    checkRegister() {
      let me = this;
      if (me.username == "") {
        this.$message({
          type: "error",
          message: "请输入用户名！",
          duration: 6000
        });
        return false;
      }
      if (me.password == "") {
        this.$message({
          type: "error",
          message: "请输入密码！",
          duration: 6000
        });
        return false;
      }
      if (me.passwordAffirm == "" || me.password != me.passwordAffirm) {
        this.$message({
          type: "error",
          message: "两次密码必须相同",
          duration: 6000
        });
        return false;
      }
      return true;
    },
    Login() {
      console.log("点击登录");
      console.log(this.registerFlag);
      let postData = {
        username: this.username,
        password: this.password
      };
      if (this.checkLogin()) {
        this.loading = !this.loading;
        this.$axios({
          method: "post",
          url: "/user/login",
          data: postData
        })
          .then(res => {
            console.log(res.data);
            if (res.data == "no") {
              this.$message({
                message: "用户名不存在！",
                duration: 6000
              });
            }
            if (res.data == "error") {
              this.$message({
                type: "error",
                message: "密码错误，请重新输入！",
                duration: 6000
              });
            }
            if (res.data == "ok") {
              sessionStorage.setItem("username", this.username);
              this.username = "";
              this.password = "";
              this.passwordAffirm = "";
              this.validatecode = "";
              this.$message({
                type: "success",
                message: "登陆成功！",
                duration: 6000
              });
              if (this.$route.query.redirect) {
                let redirect = decodeURIComponent(this.$route.query.redirect);
                // let redirect=this.$router.query.redirect;
                this.$router.push(redirect);
              } else {
                this.$router.push({ name: "index" });
              }
            }
            this.loading = !this.loading;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    Register() {
      console.log("点击注册");
      let postData = {
        username: this.username,
        password: this.password
      };
      if (this.checkRegister()) {
        this.loading = !this.loading;
        this.$axios
          .get("/user/queryUserByUname", {
            params: {
              username: this.username
            }
          })
          .then(res => {
            console.log("判断用户是否存在。");
            console.log(res.data);
            if (res.data == "") {
              console.log("该用户不存在。开始注册！");
              this.$axios({
                method: "post",
                url: "/user/addUser",
                data: postData
              })
                .then(Response => {
                  console.log("注册成功！");
                  console.log(Response.data);
                  alert("注册成功！");
                  this.registerFlag = true;
                  this.Login();
                })
                .catch(error => {
                  console.log(error);
                });
            } else {
              console.log("该用户已存在。");
              console.log(res.data);
              this.$message({
                type: "error",
                message: "该用户已存在。",
                duration: 6000
              });
            }
            this.loading = !this.loading;
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>

<style scoped>
#container {
  background: url(../assets/bg.jpg);
  background-position: center center;
  background-size: 100% auto;
  width: 99%;
  height: 900px;
  position: absolute;
}
#Form {
  position: relative;
  margin: 0 auto;
  padding-top: 30px;
  margin-top: 250px;
  height: 400px;
  width: 420px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 15px;
}
#Form h1 {
  width: 100px;
  line-height: 50px;
  margin: 0 auto;
  margin-top: 0px;
  padding-bottom: 20px;
}
#input {
  margin: 0 auto;
  width: 300px;
  height: 220px;
}
#btn {
  width: 100px;
  margin: 0 auto;
  margin-right: 16em;
}
#other {
  width: 300px;
  margin: 0 auto;
  margin-top: 1em;
}
</style>
