 <template>
  <div id="container">
    <div id="content">
        <div v-if="!isDoctor">
        <div class="title">请填写相关信息并和管理员联系完成医生认证</div>  
        <el-divider></el-divider> 
        <el-form :model="certifyForm" status-icon :rules="rules" label-position="right" ref="certifyForm" label-width="100px" style="margin-left:150px;">
            <el-form-item label="真实姓名" prop="trueName" style="width:400px;">
                <el-input v-model="certifyForm.trueName"  placeholder="请输入真实姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="所在大科室" prop="department_big" style="width:400px;">
                <el-input v-model="certifyForm.department_big" placeholder="请输入大科室" clearable></el-input>
            </el-form-item>
            <el-form-item label="所在小科室" prop="department_small" style="width:400px;">
                <el-input v-model="certifyForm.department_small" placeholder="请输入小科室" clearable></el-input>
            </el-form-item>
            <el-form-item label="个人简介" prop="description" style="width:400px;">
                <el-input type="textarea" v-model="certifyForm.description" autosize placeholder="请输入个人简介" clearable></el-input>
            </el-form-item>
            <el-form-item label="个人擅长" prop="good_at" style="width:400px;">
                <el-input type="textarea" v-model="certifyForm.good_at" autosize placeholder="请输入个人擅长" clearable></el-input>
            </el-form-item>
        </el-form>       
        <el-button type="primary" @click="submitForm('certifyForm')">完成</el-button>
        <el-button @click="resetForm('certifyForm')">取消</el-button>    
        </div> 
        <div v-else>
            <div class="successInfo">已完成医生认证</div>
            <img src="../../../static/success.png" style="width:300px;height:350px;margin-top:100px;">
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      certifyForm: {
        //医生认证表单
        trueName: "",
        department_big: "",
        department_small: "",
        description: "",
        good_at: ""
      },
      rules: {
        trueName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        department_big: [
          { required: true, message: "请输入大科室", trigger: "blur" }
        ],
        department_small: [
          { required: true, message: "请输入小科室", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入个人简介", trigger: "blur" }
        ],
        good_at: [
          { required: true, message: "请输入个人擅长", trigger: "blur" }
        ]
      },
      isDoctor: false
    };
  },
  created() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("表单填写完成,请和管理员联系!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#content {
  background-color: white;
  height: 800px;
}
.title {
  text-align: left;
  font-size: 18px;
  padding-top: 20px;
  margin-left: 10px;
  font-weight: bold;
}
.successInfo {
  font-size: 20px;
  padding-top: 20px;
  font-weight: bold;
}
</style>