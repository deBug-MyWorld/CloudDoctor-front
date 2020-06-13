<template>
  <div id="container">
      <div class="commentData">
      <el-row :gutter="20" class="tool">
        <el-col :span="6" :offset="2" style="display:flex;">
          <el-input placeholder="请输入用户或医生名称"  v-model="search"> </el-input>
          <el-button icon="el-icon-search" circle style="margin-left:10px;" @click="handleSearch"></el-button>
        </el-col>
      </el-row>
        <el-table :data="commentData" stripe style="width:90%;margin:0 auto;"  height="500"> 
            <el-table-column prop="createTime" label="时间" sortable width="155"></el-table-column>           
            <el-table-column prop="username" label="用户名" ></el-table-column>
            <el-table-column  label="头像" >
              <template slot-scope="scope">
                <img class="avatar" :src="scope.row.icon">
              </template>
            </el-table-column>
            <el-table-column prop="doctorId" label="医生ID" ></el-table-column>
            <el-table-column prop="doctorName" label="医生名称" ></el-table-column>
            <el-table-column prop="content" label="内容" width="250"></el-table-column>
            <el-table-column  label="评分" >
              <template slot-scope="scope">
                <el-rate v-model="scope.row.star"  disabled show-score :colors="colors" score-template="{value}"> </el-rate>                
              </template>              
            </el-table-column>
            <el-table-column label="操作" width="150">
            <template slot-scope="scope">
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
        :current-page="commentParams.pageNum"
        :page-size="commentParams.pageSize"
        layout="total,prev, pager, next, jumper"
        :total="commentParams.total"
        style="margin-top:20px;"
        ></el-pagination>       
      </div>  
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      commentParams: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      commentData: [],
      search: "",
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'] 
    };
  },
  created() {
    this.getCommentList();
  },
  methods: {
    getCommentList() {
      var url = "/comment/queryCommentByAdmin";
      this.$axios
        .get(url, {
          params: {
            pageNum: this.commentParams.pageNum,
            pageSize: this.commentParams.pageSize
          }
        })
        .then(res => {
          console.log(res.data.list);
          this.commentData = res.data.list;
          this.commentParams.total = res.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该科室信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let postData = {
            commentId: row.commentId
          };
          this.$axios({
            method: "post",
            url: "/comment/deleteCommentById",
            data: postData
          }).then(res => {
            if (res.data == 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getCommentList();
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
      this.commentParams.pageSize = val;
      if (this.search == "") {
        this.getCommentList();
      } else {
        this.handleSearch();
      }
    },
    handleCurrentChange(val) {
      this.commentParams.pageNum = val;
      if (this.search == "") {
        this.getCommentList();
      } else {
        this.handleSearch();
      }
    },
    handleSearch() {
      var url = "/comment/queryCommentByKey";
      this.$axios
        .get(url, {
          params: {
            pageNum: this.commentParams.pageNum,
            pageSize: this.commentParams.pageSize,
            key: this.search
          }
        })
        .then(res => {
          console.log(res.data.list);
          this.commentData = res.data.list;
          this.commentParams.total = res.data.total;
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
.commentData {
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
.avatar {
  /*圆形头像*/
  width: 50px;
  height: 50px;
  border-radius: 50px;
}
</style>