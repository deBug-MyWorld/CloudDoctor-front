<template>
  <div id="container">
      <div class="doctorData">
      <el-row :gutter="20" class="tool">
        <el-col :span="6">
          <el-button type="primary" @click="handleEdit(1)">新增医生</el-button>
        </el-col>
        <el-col :span="6" :offset="10" style="display:flex;">
          <el-input placeholder="请输入医生名称"  v-model="search"> </el-input>
          <el-button icon="el-icon-search" circle style="margin-left:10px;" @click="handleSearch"></el-button>
        </el-col>
      </el-row>
        <el-table :data="doctorData" stripe style="width:100%;margin:0 auto;"  height="560">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline>
                  <el-form-item label="个人描述">
                    <span>{{ props.row.description }}</span>
                  </el-form-item>
                  <el-form-item label="个人擅长">
                    <span>{{ props.row.goodAt }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable width="150"></el-table-column>  
            <el-table-column prop="doctorName" label="医生名称" width="120"></el-table-column>
            <el-table-column prop="doctorId" label="医生ID" width="100"></el-table-column>
            <el-table-column  label="医生头像" width="100">
              <template slot-scope="scope">
                <img class="avatar" :src="scope.row.icon">
              </template>
            </el-table-column>         
            <el-table-column prop="departmentBig" label="大科室" width="120"></el-table-column>
            <el-table-column prop="departmentSmall" label="小科室" width="120"></el-table-column>
            <el-table-column prop="price" label="服务价格" sortable width="100"></el-table-column>
            <el-table-column prop="isFree" label="是否免费" width="100">
              <template slot-scope="scope">
                  <el-tag :type="scope.row.isFree==1?'warning':'danger'" >{{scope.row.isFree==1?'免费':'收费'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="rate" label="评分" sortable width="100"></el-table-column>
            <el-table-column prop="recommend" label="是否推荐" width="100">
              <template slot-scope="scope">
                  <el-tag :type="scope.row.recommend==1?'primary':'danger'" >{{scope.row.recommend==1?'推荐':'不推荐'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createName" label="创建者" width="100"></el-table-column>
            <el-table-column prop="tag" label="是否在线" >
              <template slot-scope="scope">
                  <el-tag :type="scope.row.tag==0?'success':'info'" >{{scope.row.tag==0?'在线':'离线'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
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
        :current-page="doctorParams.pageNum"
        :page-size="doctorParams.pageSize"
        layout="total,prev, pager, next, jumper"
        :total="doctorParams.total"
        style="margin-top:20px;"
        ></el-pagination>       
      </div>
    <!-- 编辑资料弹窗 -->
    <el-dialog :title="editFormTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model="editForm" status-icon  label-position="right" ref="editForm" :rules="editFormRules" label-width="100px" >
        <el-form-item label="医生名称" prop="doctorName" style="width:400px;">
          <el-input v-model="editForm.doctorName" :disabled="Isupdate"></el-input>
        </el-form-item>
        <el-form-item label="大科室名称:" prop="departmentBig" style="width:400px;">
            <el-input v-model="editForm.departmentBig"  placeholder="请输入大科室名称" clearable></el-input>
        </el-form-item>        
        <el-form-item label="小科室名称:" prop="departmentSmall" style="width:400px;">
            <el-input v-model="editForm.departmentSmall"  placeholder="请输入小科室名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="医生头像:" style="width:400px;" required>
          <el-upload  :action="$axios.defaults.baseURL+'/doctor/doctorIcon'" :show-file-list="false" list-type="picture-card" style="text-align:left;"
             :on-success="handleAvatarSuccess"
             :before-upload="beforeAvatarUpload">
            <img v-if="editForm.icon" :src=" editForm.icon" style="width:148px;height:148px;">
            <i v-else class="el-icon-plus"></i>
          </el-upload>          
        </el-form-item>
        <el-form-item label="icon链接:" prop="icon" style="width:500px;">
          <el-input v-model="editForm.icon" :disabled="Isupdate"></el-input>
        </el-form-item>
        <el-form-item label="服务价格:" prop="price" style="width:400px;">
            <el-input v-model="editForm.price"  placeholder="请输入服务价额" type="number" ></el-input>
        </el-form-item>
        <el-form-item label="评分:" prop="rate" style="width:400px;text-align:left;">
            <el-rate v-model="editForm.rate" :colors="colors" style="margin-top:10px;" show-score></el-rate>
        </el-form-item>   
        <el-form-item label="是否推荐:" prop="recommend" style="width:400px;text-align:left;">
            <el-radio-group v-model="editForm.recommend">
            <el-radio :label="1">推荐</el-radio>
            <el-radio :label="0">不推荐</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="个人描述:" prop="description" >
            <el-input v-model="editForm.description" type="textarea" :rows="7"  placeholder="请输入个人描述" clearable></el-input>
        </el-form-item>
        <el-form-item label="个人擅长:" prop="goodAt" >
            <el-input v-model="editForm.goodAt" type="textarea" :rows="5" placeholder="请输入个人擅长" clearable></el-input>
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
      doctorParams: {
        pageNum: 1,
        pageSize: 6,
        total: 0
      },
      doctorData: [],
      editFormTitle: "",
      editForm: {
        doctorName: "",
        departmentBig: "",
        departmentSmall: "",
        tag: 0,
        icon: "",
        description: "",
        goodAt: "",
        price: 0,
        isFree: 1, //是否免费由监听price实现
        rate: 0,
        recommend: 0,
        doctorId:''
      },
      search: "",
      dialogFormVisible: false,
      Isupdate: false,
      editFormRules: {
        departmentBig: [
          { required: true, message: "请输入大科室名称", trigger: "blur" }
        ],
        icon: [{ required: true, message: "请上传医生头像", trigger: "blur" }],
        price: [
          { required: true, message: "请输入医生服务价格", trigger: "blur" }
        ],
        rate: [{ required: true, message: "请选择医生评分", trigger: "blur" }],
        recommend: [
          { required: true, message: "请选择是否推荐该医生", trigger: "blur" }
        ],
        doctorName: [
          { required: true, message: "请输入医生名称", trigger: "blur" }
        ]
      },
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"]
    };
  },
  created() {
    this.getDoctorList();
  },
  watch: {
    "editForm.price"(newVal, oldVal) {
      if (Number(newVal) > 0) {
        this.editForm.isFree = 0;
      } else {
        this.editForm.isFree = 1;
      }
    }
  },
  methods: {
    getDoctorList() {
      var url = "/doctor/selectAllDoctor";
      this.$axios
        .get(url, {
          params: {
            pageNum: this.doctorParams.pageNum,
            pageSize: this.doctorParams.pageSize
          }
        })
        .then(res => {
          console.log(res.data.list);
          this.doctorData = res.data.list;
          this.doctorParams.total = res.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleEdit(type, index, row) {
      if (type) {
        this.editFormTitle = "新增";
        this.editForm = {
          doctorName: "",
          departmentBig: "",
          departmentSmall: "",
          tag: 1,
          icon: "",
          description: "",
          goodAt: "",
          price: 0,
          isFree: 1,
          rate: 0,
          recommend: 0,
          createName:sessionStorage.getItem("username")
        };
        this.Isupdate = false;
      } else {
        this.editFormTitle = "编辑 " + row.doctorName;
        this.editForm = Object.assign({}, row); //直接赋值他们会自动绑定到一起
        this.Isupdate = true;
      }
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除改医生信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let postData = {
            doctorId: row.doctorId
          };
          this.$axios({
            method: "post",
            url: "/doctor/deleteDoctorById",
            data: postData
          }).then(res => {
            if (res.data == 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getDoctorList();
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
    handleSizeChange(val) {
      this.doctorParams.pageSize = val;
      this.getDoctorList();
    },
    handleCurrentChange(val) {
      this.doctorParams.pageNum = val;
      this.getDoctorList();
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
      this.editForm.price = Number(this.editForm.price);
      if (this.editFormTitle == "新增") {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$message({
              message: "新增科室信息成功",
              type: "success"
            });
            console.log(this.editForm);
            this.$axios({
              method: "post",
              url: "/doctor/addDoctor",
              data: this.editForm
            }).then(res => {
              if (res.data == 1) {
                this.getDoctorList();
              }
            });
            this.dialogFormVisible = false;
          }
        });
      }
      if (this.editFormTitle.substring(0, 2) == "编辑") {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$message({
              message: "修改科室信息成功",
              type: "success"
            });
            // console.log(this.editForm);
            this.$axios({
              method: "post",
              url: "/doctor/updateDoctor",
              data: this.editForm
            }).then(res => {
              if (res.data == 1) {
                this.getDoctorList();
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
    handleSearch() {
      var url = "/doctor/selectDoctorByAdmin";
      this.$axios
        .get(url, {
          params: {
            pageNum: this.doctorParams.pageNum,
            pageSize: this.doctorParams.pageSize,
            key: this.search
          }
        })
        .then(res => {
          console.log(res.data.list);
          this.doctorData = res.data.list;
          this.doctorParams.total = res.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleAvatarSuccess(res, file) {
      if (res == "ok") {
        this.editForm.icon = "../../static/images/doctors/"+file.name;
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
.doctorData {
  width: 1550px;
  margin: 0 auto;
  height: 700px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.tool {
  padding-top: 20px;
  height: 80px;
}
.avatar {
  /*圆形头像*/
  width: 50px;
  height: 50px;
  border-radius: 50px;
}
</style>