<template>
  <div id="container">
      <div class="userData">
        <el-table ref="filterTable" :data="tableData.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))"
             stripe style="width:100%;margin-top:20px;height:500px;">
            <el-table-column type="index" :index="indexMethod" fixed="left"></el-table-column>             
            <el-table-column prop="username" label="姓名" fixed></el-table-column>
            <el-table-column  label="头像" >
            <template slot-scope="scope">
              <img class="avatar" :src="scope.row.icon">
            </template>
            </el-table-column>
            <el-table-column prop="money" label="账户余额" ></el-table-column>
            <el-table-column prop="place" label="所在地" ></el-table-column>
            <el-table-column prop="age" label="年龄" ></el-table-column>
            <el-table-column prop="sex" label="性别" ></el-table-column>
            <el-table-column prop="birthday" label="生日" ></el-table-column>
            <el-table-column prop="phone" label="电话" ></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="tag" label="账户类型" width="100"
            :filters="[{ text: '普通用户', value: '普通用户' }, { text: '医生', value: '医生' },{text: '管理员', value: '管理员'}]"
            :filter-method="filterTag"
            filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.type" >{{scope.row.tag}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="right" fixed="right" width="250">
            <template slot="header" slot-scope="scope">
                <el-input prefix-icon="el-icon-search" v-model="search" placeholder="用户名"/>
            </template>
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        :current-page="accountParams.pageNum"
        :page-size="accountParams.pageSize"
        layout="total,prev, pager, next, jumper"
        :total="accountParams.total"
        style="margin-top:20px;"
        ></el-pagination>       
      </div>
    <!-- 编辑资料弹窗 -->
    <el-dialog :title="editForm.username" :visible.sync="dialogFormVisible"  :before-close="handleClose"  width="30%">
        <el-form :model="editForm" status-icon  label-position="right" ref="editForm" label-width="100px" >
        <el-form-item label="生日:">
            <el-form-item  style="width:100px;">
                <el-date-picker type="date" placeholder="选择日期" :picker-options="expireTimeOption"  @change="handleDate" value-format="yyyy-MM-dd" v-model="editForm.birthday" :editable="false"></el-date-picker>
            </el-form-item>
        </el-form-item>
        <el-form-item label="性别:" prop="sex" style="width:220px;">
            <el-radio-group v-model="editForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="所在地区:" prop="place" style="width:300px;">
        <el-cascader :options="options" v-model="tmpPlace" clearable  style="width:300px;" @change="placeChange"></el-cascader>
        </el-form-item>
        <el-form-item label="账户余额:" prop="money" style="width:400px;">
            <el-input v-model="editForm.money" type="number" placeholder="请输入账户余额" clearable></el-input>
        </el-form-item>        
        <el-form-item label="手机号码:" prop="phone" style="width:400px;">
            <el-input v-model="editForm.phone"  placeholder="请输入手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email" style="width:400px;">
            <el-input v-model="editForm.email" placeholder="请输入邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item label="账户类型:" style="width:400px;text-align:left;">
          <el-popover placement="top" width="400" trigger="click">
            <div>
              <div style="font-size:16px;font-weight: bold;">权限修改</div>
              <el-radio-group v-model="radio" @change="radioChange">
                <el-radio label="普通用户">普通用户</el-radio>
                <el-radio label="医生">医生</el-radio>
                <el-radio label="管理员">管理员</el-radio>
              </el-radio-group>
              <div v-if="radio=='医生'">
                <div style="margin-top:10px;">绑定医生账号:</div>
                <el-input  v-model="editForm.isDoctor" @input="editForm.isDoctor=editForm.isDoctor.replace(/[^\d]/g,'')" placeholder="输入绑定的医生id" clearable></el-input>
              </div>
            </div>
            <el-button slot="reference">{{radio}}</el-button>
          </el-popover>
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
import global_ from "../../common/global.vue";
export default {
  components: {},
  data() {
    return {
      expireTimeOption: {
        disabledDate(date) {
          //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      dialogFormVisible: false,
      options: global_.options, //将引入的组件值传过来
      tableData: [], //展示数据
      tmpPlace: [],
      search: "",
      accountParams: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      editForm: {
        username: "",
        isDoctor: 0,
        isAdmin: 0,
        money: 0,
        place: "",
        age: 0,
        sex: "",
        birthday: "",
        email: "",
        phone: ""
      },
      radio: ""
    };
  },
  created() {
    this.queryAllUser();
  },
  methods: {
    radioChange() {
      if (this.radio == "管理员") {
        this.editForm.isAdmin = 1;
      } else if (this.radio == "普通用户") {
        this.editForm.isDoctor = 0;
        this.editForm.isAdmin = 0;
      } else {
        this.editForm.isAdmin = 0;
      }
    },
    queryAllUser() {
      var url = "/user/queryAllUser";
      this.$axios
        .get(url, {
          params: {
            pageNum: this.accountParams.pageNum,
            pageSize: this.accountParams.pageSize
          }
        })
        .then(res => {
          console.log(res.data.list);
          this.tableData = res.data.list;
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].isAdmin == 1) {
              this.tableData[i].tag = "管理员";
              this.tableData[i].type = "danger";
            } else if (this.tableData[i].isDoctor != 0) {
              this.tableData[i].tag = "医生";
              this.tableData[i].type = "success";
            } else {
              this.tableData[i].tag = "普通用户";
              this.tableData[i].type = "primary";
            }
          }
          this.accountParams.total = res.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.editForm = Object.assign({}, row); //直接赋值他们会自动绑定到一起
      this.radio = this.editForm.tag;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let postData = {
            id: row.id
          };
          this.$axios({
            method: "post",
            url: "/user/deleteUserByAdmin",
            data: postData
          }).then(res => {
            if (res.data == 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryAllUser();
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
    indexMethod(index) {
      return index + 1;
    },
    handleSizeChange(val) {
      this.accountParams.pageSize = val;
      this.queryAllUser();
    },
    handleCurrentChange(val) {
      this.accountParams.pageNum = val;
      this.queryAllUser();
    },
    placeChange() {
      if (this.tmpPlace.length > 0) {
        this.editForm.place = this.tmpPlace[0] + " " + this.tmpPlace[1];
      } else this.editForm.place = "";
    },
    handleDate(value) {
      var myYear = new Date().getFullYear(); //获取当前年份
      this.editForm.age = myYear - Number(value.substring(0, 4));
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
          this.$refs["editForm"].resetFields();
          this.tmpPlace = [];
        })
        .catch(_ => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          let postData = {
            username: this.editForm.username,
            place: this.editForm.place,
            age: this.editForm.age,
            sex: this.editForm.sex,
            birthday: this.editForm.birthday,
            phone: this.editForm.phone,
            email: this.editForm.email,
            isDoctor: Number(this.editForm.isDoctor),
            isAdmin: this.editForm.isAdmin,
            money: Number(this.editForm.money)
          };
          // console.log(postData);
          this.$axios({
            method: "post",
            url: "/user/updateUserByAdmin",
            data: postData
          }).then(res => {
            if (res.data == 1) {
              // this.queryAllUser();
              location.reload()
            }
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
.userData {
  /* border: 1px solid red; */
  width: 1550px;
  margin: 0 auto;
  height: 560px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.avatar {
  /*圆形头像*/
  width: 50px;
  height: 50px;
  border-radius: 50px;
}
</style>