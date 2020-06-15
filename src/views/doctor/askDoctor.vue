<template>
  <div id="container">
    <div id="context">
        <info-head style="margin-top:0.1rem;" ref="infoHead" @user="userListen"></info-head>      
        <div class="ask-form">
          <div class="guide">
            <img :src="doctor.icon">
            <div class="guide-info">
              <div>医生{{doctor.doctorName}}</div>
              <div style="color:gray;margin-top:10px;">请描述你的性别年龄、症状、就诊经历，我将竭诚为你治疗，并保证你的隐私安全</div>
            </div>
          </div>
          <el-divider></el-divider>
          <el-form ref="form" :model="form" :rules="rules"  label-width="80px">
            <el-form-item label="标题:" prop="title">
              <el-input v-model="form.title" placeholder="请输入本次问诊的主要内容"></el-input>
            </el-form-item>   
            <el-form-item label="详情:" prop="textarea">
              <el-input type="textarea" :rows="5" placeholder="请详细描述你的个人信息、就诊经历等" v-model="form.textarea"   maxlength="500" show-word-limit></el-input>
            </el-form-item>  
            <el-form-item label="添加图片，辅助病情描述(限制5张):">
              <el-upload action="http://localhost:8080/PicsUpload" list-type="picture-card" ref="upload" style="text-align:left;"
               :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                :http-request="uploadFile"
                accept="image/jpeg"
                :before-upload="beforeAvatarUpload"
                multiple
                :auto-upload="false"
                :limit="5">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>              
            </el-form-item>       
          </el-form>    
           <el-button type="success" icon="el-icon-upload" @click="submitUpload">提交</el-button>    
           <!-- <el-button type="success"  @click="goChatRoom">聊天页</el-button>   -->
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
      user: {},
      doctor: {},
      form: {
        title: "",
        textarea: ""
      },
      rules: {
        title: [{ required: true, message: "请输入本次问诊的主要内容", trigger: "blur" }],
        textarea: [
          { required: true, message: "请详细描述你的个人信息，就诊经历等", trigger: "blur" }
        ]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      formData: ""
    };
  },
  created() {
    this.getDoctorInfo();
  },
  mounted() {},
  methods: {
    userListen(value) {
      this.user = value;
      console.log("用户信息");
      console.log(this.user);
    },
    getDoctorInfo() {
      var url = "/doctor/getDoctorInfoById";
      this.$axios
        .get(url, {
          params: {
            doctorId: this.$route.params.id
          }
        })
        .then(res => {
          this.doctor = res.data;
          console.log(this.doctor);
          if (this.doctor.tag == 1) {
            this.$alert("医生不在线！！！", "提示", {
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
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleRemove(file, fileList) {
      console.log("handleRemove");
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    uploadFile(file) {
      this.formData.append("file", file.file);
    },
    submitUpload() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formData = new FormData();
          this.$refs.upload.submit();
          this.formData.append("title", this.form.title);
          this.formData.append("message", this.form.textarea);
          this.formData.append("fromId", this.user.id);
          this.formData.append("fromName", this.user.username);
          this.formData.append("toId", this.doctor.doctorId);
          this.formData.append("toName", this.doctor.doctorName);
          var url = "http://localhost:8080/chatSubject/PicsUpload";
          this.$myAxios
            .post(url, this.formData)
            .then(res => {
              console.log(res.data);
              this.$message({
                message: "上传成功！",
                type: "success"
              });
              const loading = this.$loading({
                lock: true,
                text: "上传成功！,页面跳转中。。。。。",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              setTimeout(() => {
                loading.close();
                this.goChatRoom();
              }, 2000);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    goChatRoom() {
      this.$router.push({
        path: "/chatRoom/" + this.$route.params.id,
        query: {
          sendUser: this.user.id,
          toUser: this.$route.params.id
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ask-form {
  width: 800px;
  margin: 0 auto;
}
.guide {
  display: flex;
  margin-top: 10px;
}
.guide img {
  width: 60px;
  height: 60px;
  border-radius: 50px;
}
.guide-info {
  margin-top: 5px;
  text-align: left;
  margin-left: 20px;
}
</style>