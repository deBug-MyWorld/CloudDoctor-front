<template>
  <div id="container">
      <div class="content">
        <div class="basic-info">
          <el-image class="avatar" :src="ruleForm.icon" :preview-src-list="srcList" ></el-image>
          <div style="text-align:left;margin-top:15px;">
            <h2>{{ruleForm.username}}</h2>
            <div>
                <h3 style="display:inline">余额:¥{{ruleForm.money}}</h3>
                <el-button type="danger" size="small" style="height:30px;display:inline;margin-left:150px;" @click="goWallet">充值</el-button>
                <router-link :to="{path:'/account/myWallet',query:{index:'second'}}"><div style="display:inline;margin-left:20px;">明细<i class="el-icon-arrow-right"></i></div></router-link>
            </div>
          </div>
        </div>
         <div style="font-size:18px;margin-left:10px;display:flex;">个人资料</div>
         <el-divider content-position="right"><el-button type="text" @click="dialogFormVisible = true" style="font-size:15px;"><i class="el-icon-edit"></i>编辑资料</el-button></el-divider>
         <!-- 个人资料 -->
         <div class="personalInfo">
            <el-row :gutter="20">
                <el-col :span="6"><div>年龄:{{ruleForm.age}}</div></el-col>
                <el-col :span="6" :offset="6"><div>性别:{{ruleForm.sex}}</div></el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:10px;">
                <el-col :span="6"><div style="overflow: hidden;height:21px;">地区:{{ruleForm.place}}</div></el-col>
                <el-col :span="6" :offset="6"><div>生日:{{ruleForm.birthday}}</div></el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:10px;">
                <el-col :span="6"><div>手机:{{ruleForm.phone}}</div></el-col>
                <el-col :span="6" :offset="6"><div>邮箱:{{ruleForm.email}}</div></el-col>
            </el-row>
         </div>
        <!-- 编辑资料弹窗 -->
        <el-dialog :title="ruleForm.username" :visible.sync="dialogFormVisible" :before-close="handleClose" width="30%">
            <el-form :model="ruleForm" status-icon :rules="rules" label-position="right" ref="ruleForm" label-width="100px" >
            <el-form-item label="生日" required>
                <el-form-item prop="birthday" style="width:100px;">
                    <el-date-picker type="date" placeholder="选择日期" :picker-options="expireTimeOption"  @change="handleDate" value-format="yyyy-MM-dd" v-model="ruleForm.birthday" :editable="false"></el-date-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item label="性别" prop="sex" style="width:220px;">
                <el-radio-group v-model="ruleForm.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="所在地区" prop="place" style="width:300px;">
            <el-cascader :options="options" v-model="tmpPlace" clearable  style="width:300px;" @change="placeChange"></el-cascader>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone" style="width:400px;">
                <el-input v-model="ruleForm.phone"  placeholder="请输入手机号码" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" style="width:400px;">
                <el-input v-model="ruleForm.email" placeholder="请输入邮箱" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">完成</el-button>
                <el-button @click="resetForm('ruleForm')">取消</el-button>
            </el-form-item>
            </el-form>
        </el-dialog> 
        <!-- 账号设置，修改头像，修改密码 -->
         <div style="font-size:18px;margin-left:10px;display:flex;">账号设置</div>
         <el-divider></el-divider>
         <div class="account-setting">             
            <el-row>
                <el-col :span="12" style="text-align:left;">
                    <div style="font-size:40px;display:inline-block;margin-left:30px;"><i class="el-icon-picture"></i></div>
                    <div style="text-align:left;display:inline-block;">
                        <div style="font-size:15px;font-weight:bold;">修改用户头像</div>
                        <div style="font-size:12px;">选择喜欢的图片上传</div>
                    </div>   
                    <el-upload style="display:inline-block;" :action="$axios.defaults.baseURL+'/user/updateIcon'" :data="ruleForm" :on-success="succ" :on-error="error" :limit="1" :show-file-list="false" :before-upload="beforeAvatarUpload">                
                      <el-button type="warning" name plain size="small" style="margin-left:50px;">修改头像<i class="el-icon-arrow-right el-icon--right"></i></el-button>                   
                    </el-upload> 
                </el-col>
                <el-col :span="12" style="text-align:left;">
                    <div style="font-size:40px;display:inline-block;margin-left:30px;"><i class="el-icon-lock"></i></div>
                    <div style="text-align:left;display:inline-block;">
                        <div style="font-size:15px;font-weight:bold;">修改密码</div>
                        <div style="font-size:12px;">建议定期修改密码，保证账号安全</div>
                    </div>
                    <el-button type="warning" plain size="small" style="margin-left:50px;" @click="passwordFormVisible = true">修改密码<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-col>
            </el-row>
         </div>
        <!-- 修改密码弹窗 -->
        <el-dialog :title="ruleForm.username" :visible.sync="passwordFormVisible" :before-close="handleClose1" width="30%">
            <el-form :model="passwordForm" status-icon :rules="passwordRules" label-position="right" ref="passwordForm" label-width="100px" >
            <el-form-item label="原始密码" prop="password" style="width:400px;">
                <el-input type="password" v-model="passwordForm.password"  placeholder="请输入原始密码" show-password clearable></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword" style="width:400px;">
                <el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码" show-password clearable></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="newpasswordAffirm" style="width:400px;">
                <el-input type="password" v-model="passwordForm.newpasswordAffirm" placeholder="请再次确认新密码" show-password clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitPasswordForm('passwordForm')">完成</el-button>
                <el-button @click="resetPasswordForm('passwordForm')">取消</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
      </div>
  </div>
</template>

<script>
import global_ from "../../common/global.vue";
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码不能为空！"));
      }
      setTimeout(() => {
        if (value.match(/^1[3|4|5|8][0-9]\d{4,8}$/) == null) {
          callback(new Error("请正确填写手机号码！"));
        } else {
          callback();
        }
      }, 500);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (
          value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,10}$/) ==
          null
        ) {
          callback(new Error("请按照格式输入新密码"));
          this.$message({
            type: "error",
            message:
              "密码请包含大小写字母和数字组合，长度在8-10之间，不能使用特殊字符",
            duration: 6000
          });
        }
        if (this.passwordForm.newpasswordAffirm !== "") {
          this.$refs.passwordForm.validateField("newpasswordAffirm");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      srcList: [],
      expireTimeOption: {
        disabledDate(date) {
          //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      dialogFormVisible: false,
      passwordFormVisible: false,
      options: global_.options, //将引入的组件值传过来
      tmpPlace: [],
      ruleForm: {
        //用户信息表单
        username: "",
        money: "0.00",
        birthday: "",
        sex: "",
        email: "",
        phone: "",
        place: "",
        age: "",
        icon: ""
      },
      rules: {
        //用户信息校验规则
        birthday: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        // place: [{ required: true, message: "请输入所在地区", trigger: "blur" }],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      passwordForm: {
        password: "",
        newPassword: "",
        newpasswordAffirm: ""
      },
      passwordRules: {
        password: [
          { required: true, message: "请输入原始密码", trigger: "change" }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        newpasswordAffirm: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getThisUser();
  },
  methods: {
    getThisUser() {
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
            this.ruleForm = res.data;
            this.srcList = [];
            if (res.data.icon == null) {
              this.srcList.push("../../../static/info.png");
            } else {
              this.srcList.push(res.data.icon);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          let postData = {
            username: this.ruleForm.username,
            place: this.ruleForm.place,
            age: this.ruleForm.age,
            sex: this.ruleForm.sex,
            birthday: this.ruleForm.birthday,
            phone: this.ruleForm.phone,
            email: this.ruleForm.email
          };
          this.$axios({
            method: "post",
            url: "/user/updateUserByUname",
            data: postData
          }).then(res => {
            console.log("updateUsername");
            console.log(res);
          });
          this.dialogFormVisible = false;
          this.tmpPlace = [];
        } else {
          this.$message({
            message: "修改失败",
            type: "error"
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$confirm("确认关闭?")
        .then(() => {
          this.$refs[formName].resetFields();
          this.dialogFormVisible = false;
          this.tmpPlace = [];
        })
        .catch(() => {});
    },
    placeChange() {
      if (this.tmpPlace.length > 0) {
        this.ruleForm.place = this.tmpPlace[0] + " " + this.tmpPlace[1];
      } else this.ruleForm.place = "";
    },
    handleDate(value) {
      var myYear = new Date().getFullYear(); //获取当前年份
      this.ruleForm.age = myYear - Number(value.substring(0, 4));
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
          this.$refs["ruleForm"].resetFields();
          this.tmpPlace = [];
        })
        .catch(_ => {});
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    succ(response, file, fileList) {
      console.log(response);
      alert("上传成功！");
      window.location.reload();
    },
    error(err, file, fileList) {
      console.log(err);
      alert("上传失败！");
    },
    submitPasswordForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let postData = {
            username: this.ruleForm.username,
            password: this.passwordForm.password,
            newPassword: this.passwordForm.newPassword
          };
          this.$axios({
            method: "post",
            url: "/user/updatePassWord",
            data: postData
          }).then(res => {
            console.log("updatePassWord");
            console.log(res.data);
            if (res.data == "ok") {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.passwordFormVisible = false;
            }
            if (res.data == "no") {
              this.$message({
                message: "原密码错误！",
                type: "error"
              });
            }
          });
        } else {
          this.$message({
            message: "修改失败",
            type: "error"
          });
          return false;
        }
      });
    },
    resetPasswordForm(formName) {
      this.$confirm("确认关闭?")
        .then(() => {
          this.$refs[formName].resetFields();
          this.passwordFormVisible = false;
        })
        .catch(() => {});
    },
    handleClose1(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
          this.$refs["passwordForm"].resetFields();
        })
        .catch(_ => {});
    },
    goWallet() {
      this.$router.push({
        path: "/account/myWallet"
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  background-color: white;
  height: 800px;
}
.basic-info {
  display: flex;
  flex-wrap: wrap;
}
.avatar {
  /*圆形头像*/
  width: 100px;
  height: 100px;
  border-radius: 50px;
  transition: all 0.2s; /*表示所有的属性变化在0.6s的时间段内完成*/
  margin: 20px 20px 20px 20px;
}
.personalInfo {
  text-align: left;
  margin-left: 30px;
  margin-bottom: 30px;
}
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>