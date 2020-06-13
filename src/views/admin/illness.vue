<template>
  <div id="container">
      <div class="IllnessData">
      <el-row :gutter="20" class="tool">
        <el-col :span="6">
          <el-button type="primary" @click="handleEdit(1)">新增疾病信息</el-button>
        </el-col>
        <el-col :span="6" :offset="10" style="display:flex;">
          <el-input placeholder="请输入疾病名称"  v-model="search"> </el-input>
          <el-button icon="el-icon-search" circle style="margin-left:10px;" @click="getIllnessList"></el-button>
        </el-col>
      </el-row>
        <el-table :data="illnessData" stripe style="width:90%;margin:0 auto;"  height="530">
            <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>           
            <el-table-column prop="illness" label="疾病名称" ></el-table-column>
            <el-table-column prop="img" label="图片" >
              <template slot-scope="scope">
                <img style="width:60px;height:60px;" :src="scope.row.img">
              </template>
            </el-table-column>
            <el-table-column prop="createName" label="创建者" ></el-table-column>
            <el-table-column prop="tag" label="是否展示" 
            :filters="[{ text: '展示', value: 0 }, { text: '不展示', value: 1 }]"
            :filter-method="filterTag"
            filter-placement="bottom-end">
              <template slot-scope="scope">
                  <el-tag :type="scope.row.tag==0?'success':'danger'" >{{scope.row.tag==0?'展示':'不展示'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
            <template slot-scope="scope">
                <el-button
                size="mini"
                icon="el-icon-edit"
                @click="handleEdit(0,scope.$index, scope.row)">编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>      
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="illnessParams.pageNum"
        :page-size="illnessParams.pageSize"
        layout="total,prev, pager, next, jumper"
        :total="illnessParams.total"
        style="margin-top:20px;"
        ></el-pagination>       
      </div>
    <!-- 编辑资料弹窗 -->
    <el-dialog :title="editFormTitle" :visible.sync="dialogFormVisible"  :before-close="handleClose"  width="70%">
        <el-form :model="editForm" status-icon  label-position="right" ref="editForm" :rules="editFormRules" label-width="100px" >
        <el-form-item label="疾病名称:" prop="illness" style="width:400px;">
            <el-input v-model="editForm.illness"  placeholder="请输入疾病名称" clearable></el-input>
        </el-form-item>        
        <el-form-item label="疾病图片:" style="width:400px;" required>
          <el-upload  :action="$axios.defaults.baseURL+'/illness/illnessImg'" :show-file-list="false" list-type="picture-card" style="text-align:left;"
             :on-success="handleAvatarSuccess"
             :before-upload="beforeAvatarUpload">
            <img v-if="editForm.img" :src=" editForm.img" style="width:148px;height:148px;">
            <i v-else class="el-icon-plus"></i>
          </el-upload>  
        </el-form-item>
        <el-form-item label="图片链接:" prop="img" style="width:400px;">
            <el-input v-model="editForm.img"  disabled></el-input>
        </el-form-item>
        <el-form-item label="概述:" prop="summarize">
          <quill-editor v-model="editForm.summarize" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="病因:" prop="causeDisease">
          <quill-editor v-model="editForm.causeDisease" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="症状:" prop="symptoms">
          <quill-editor v-model="editForm.symptoms" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="检查:" prop="illnessCheck">
          <quill-editor v-model="editForm.illnessCheck" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="治疗:" prop="treatment">
          <quill-editor v-model="editForm.treatment" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="并发症:" prop="complications">
          <quill-editor v-model="editForm.complications" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="预防:" prop="prevention">
          <quill-editor v-model="editForm.prevention" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="饮食:" prop="diet">
          <quill-editor v-model="editForm.diet" :options="editorOption"></quill-editor>
        </el-form-item>        
        <el-form-item label="是否展示:" prop="tag" style="width:400px;">
            <el-radio-group v-model="editForm.tag">
            <el-radio :label="0">展示</el-radio>
            <el-radio :label="1">不展示</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('editForm')">完成</el-button>
            <el-button @click="resetForm('editForm')">取消</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>   
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      illnessParams: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      illnessData: [],
      editFormTitle: "",
      editForm: {
        illness: "",
        img: "",
        summarize: "",
        causeDisease: "",
        symptoms: "",
        illnessCheck: "",
        treatment: "",
        complications: "",
        prevention: "",
        diet: "",
        tag: 0
      },
      search: "",
      dialogFormVisible: false,
      editFormRules: {
        illness: [
          { required: true, message: "请输入疾病名称", trigger: "blur" }
        ],
        img: [
          { required: true, message: "请输入上传疾病图片", trigger: "blur" }
        ],
        tag: [{ required: true, message: "请选择是否展示", trigger: "change" }]
      },
      editorOption: {
        placeholder: "请编辑内容",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
            ["blockquote", "code-block"], //引用，代码块
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], //上下标
            [{ indent: "-1" }, { indent: "+1" }], //缩进
            [{ size: ["small", false, "large", "huge"] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }]
          ]
        }
      }
    };
  },
  created() {
    this.getIllnessList();
  },
  methods: {
    getIllnessList() {
      var url = "/illness/queryIllnessByAdmin";
      this.$axios
        .get(url, {
          params: {
            pageNum: this.illnessParams.pageNum,
            pageSize: this.illnessParams.pageSize,
            key: this.search
          }
        })
        .then(res => {
          console.log(res.data.list);
          this.illnessData = res.data.list;
          this.illnessParams.total = res.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleEdit(type, index, row) {
      if (type) {
        this.editFormTitle = "新增";
        this.editForm = {
          illness: "",
          img: "",
          summarize: "",
          causeDisease: "",
          symptoms: "",
          illnessCheck: "",
          treatment: "",
          complications: "",
          prevention: "",
          diet: "",
          tag: 0,
          createName: sessionStorage.getItem("username")
        };
      } else {
        this.editFormTitle = "修改";
        this.editForm = Object.assign({}, row); //直接赋值他们会自动绑定到一起
      }
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该科室信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let postData = {
            illnessId: row.illnessId
          };
          this.$axios({
            method: "post",
            url: "/illness/deleteIllnessById",
            data: postData
          }).then(res => {
            if (res.data == 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getIllnessList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleSizeChange(val) {
      this.illnessParams.pageSize = val;
      this.getIllnessList();
    },
    handleCurrentChange(val) {
      this.illnessParams.pageNum = val;
      this.getIllnessList();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
          this.$refs["editForm"].resetFields();
        })
        .catch(_ => {});
    },
    submitForm(formName) {
      if (this.editFormTitle == "新增") {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$message({
              message: "新增科室信息成功",
              type: "success"
            });
            this.$axios({
              method: "post",
              url: "/illness/addIllness",
              data: this.editForm
            }).then(res => {
              if (res.data == 1) {
                this.getIllnessList();
              }
            });
            this.dialogFormVisible = false;
          }
        });
      }
      if (this.editFormTitle == "修改") {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$message({
              message: "修改科室信息成功",
              type: "success"
            });
            this.$axios({
              method: "post",
              url: "/illness/updateIllnessById",
              data: this.editForm
            }).then(res => {
              if (res.data == 1) {
                this.getIllnessList();
              }
            });
            this.dialogFormVisible = false;
          }
        });
      }
    },
    resetForm(formName) {
      this.$confirm("确认关闭?")
        .then(() => {
          this.$refs[formName].resetFields();
          this.dialogFormVisible = false;
        })
        .catch(() => {});
    },
    handleAvatarSuccess(res, file) {
      if (res == "ok") {
        this.editForm.img = "../../static/images/illness/" + file.name;
      }
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  position: relative;
  top: 40px;
}
.IllnessData {
  width: 1450px;
  margin: 0 auto;
  height: 680px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.tool {
  padding-top: 20px;
  height: 80px;
}
/* .quill-editor{
  height: 200px;
} */
</style>