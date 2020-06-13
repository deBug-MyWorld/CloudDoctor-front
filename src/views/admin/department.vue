<template>
  <div id="container">
      <div class="departmentData">
      <el-row :gutter="20" class="tool">
        <el-col :span="6">
          <el-button type="primary" @click="handleEdit(1)">新增科室</el-button>
        </el-col>
        <el-col :span="6" :offset="10" style="display:flex;">
          <el-input placeholder="请输入科室名称"  v-model="search"> </el-input>
          <el-button icon="el-icon-search" circle style="margin-left:10px;" @click="handleSearch"></el-button>
        </el-col>
      </el-row>
        <el-table :data="departmentData" stripe style="width:90%;margin:0 auto;"  height="530">
            <el-table-column type="index" :index="indexMethod" fixed="left"></el-table-column>  
            <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>           
            <el-table-column prop="department" label="大科室" ></el-table-column>
            <el-table-column prop="departmentSmall" label="小科室" ></el-table-column>
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
        :current-page="departmentParams.pageNum"
        :page-size="departmentParams.pageSize"
        layout="total,prev, pager, next, jumper"
        :total="departmentParams.total"
        style="margin-top:20px;"
        ></el-pagination>       
      </div>
    <!-- 编辑资料弹窗 -->
    <el-dialog :title="editFormTitle" :visible.sync="dialogFormVisible"  :before-close="handleClose"  width="30%">
        <el-form :model="editForm" status-icon  label-position="right" ref="editForm" :rules="editFormRules" label-width="100px" >
        <el-form-item label="大科室名称:" prop="department" style="width:400px;">
            <el-input v-model="editForm.department"  placeholder="请输入大科室名称" clearable></el-input>
        </el-form-item>        
        <el-form-item label="小科室名称:" prop="departmentSmall" style="width:400px;">
            <el-input v-model="editForm.departmentSmall"  placeholder="请输入小科室名称" clearable></el-input>
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
      departmentParams: {
        pageNum: 1,
        pageSize: 8,
        total: 0
      },
      departmentData: [],
      editFormTitle: "",
      editForm: {
        department: "",
        departmentSmall: "",
        tag: 0
      },
      search: "",
      dialogFormVisible: false,
      editFormRules: {
        department: [
          { required: true, message: "请输入大科室名称", trigger: "blur" }
        ],
        departmentSmall: [
          { required: true, message: "请输入小科室名称", trigger: "blur" }
        ],
        tag: [{ required: true, message: "请选择是否展示", trigger: "change" }]
      }
    };
  },
  created() {
    this.getDepartmentList();
  },
  methods: {
    getDepartmentList() {
      var url = "/departments/selectDepartmentByAdmin";
      this.$axios
        .get(url, {
          params: {
            pageNum: this.departmentParams.pageNum,
            pageSize: this.departmentParams.pageSize
          }
        })
        .then(res => {
          console.log(res.data.list);
          this.departmentData = res.data.list;
          this.departmentParams.total = res.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleEdit(type, index, row) {
      if (type) {
        this.editFormTitle = "新增";
        this.editForm = {
          department: "",
          departmentSmall: "",
          tag: 0
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
            departmentId: row.departmentId
          };
          this.$axios({
            method: "post",
            url: "/departments/deleteDepartmentById",
            data: postData
          }).then(res => {
            if (res.data == 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getDepartmentList();
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
    indexMethod(index) {
      return index + 1;
    },
    handleSizeChange(val) {
      this.departmentParams.pageSize = val;
      if (this.search == "") {
        this.getDepartmentList();
      } else {
        this.handleSearch();
      }
    },
    handleCurrentChange(val) {
      this.departmentParams.pageNum = val;
      if (this.search == "") {
        this.getDepartmentList();
      } else {
        this.handleSearch();
      }
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
            let postData = {
              department: this.editForm.department,
              departmentSmall: this.editForm.departmentSmall,
              createName: sessionStorage.getItem("username"),
              tag: this.editForm.tag
            };
            this.$axios({
              method: "post",
              url: "/departments/AddDepartment",
              data: postData
            }).then(res => {
              if (res.data == 1) {
                this.getDepartmentList();
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
            let postData = {
              department: this.editForm.department,
              departmentSmall: this.editForm.departmentSmall,
              createName: sessionStorage.getItem("username"),
              tag: this.editForm.tag,
              departmentId: this.editForm.departmentId
            };
            // console.log(postData);
            this.$axios({
              method: "post",
              url: "/departments/updateDepartment",
              data: postData
            }).then(res => {
              if (res.data == 1) {
                this.getDepartmentList();
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
      var url = "/departments/searchByAdmin";
      this.$axios
        .get(url, {
          params: {
            pageNum: this.departmentParams.pageNum,
            pageSize: this.departmentParams.pageSize,
            key: this.search
          }
        })
        .then(res => {
          console.log(res.data.list);
          this.departmentData = res.data.list;
          this.departmentParams.total = res.data.total;
        })
        .catch(error => {
          console.log(error);
        });
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
.departmentData {
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
</style>