<template>
  <div id="container">
    <div id="content">
      <div style="margin-left:20px;">
        <div class="my-favorite">收藏的医生</div>  
        <el-divider></el-divider>
        <el-table
          :data="tableData.filter(data => !search || data.doctorName.toLowerCase().includes(search.toLowerCase()))"
           height="400"
          style="width: 90%;margin-left:20px;">
          <el-table-column label="医生头像">
            <template slot-scope="scope">
              <img class="avatar" :src="'../'+scope.row.doctorIcon" @click="showIcon(scope.$index, scope.row)">
            </template>
          </el-table-column>
          <el-table-column label="医生信息">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>姓名: {{ scope.row.doctorName }}</p>
                <p>擅长: {{ scope.row.goodAt }}</p>
                <div slot="reference">
                <router-link :to="'/doctorInfo/'+scope.row.doctorId">
                <el-tag size="medium">{{ scope.row.doctorName }}</el-tag>
                </router-link>
                </div>
              </el-popover>
            </template>            
          </el-table-column>
          <el-table-column align="right">
            <template slot="header" slot-scope="scope">
              <el-input v-model="search" size="mini" placeholder="输入医生名字搜索"/>
            </template>
            <template slot-scope="scope">
              <router-link :to="'/askDoctor/'+scope.row.doctorId"><el-button size="mini" type="success" plain>向TA提问</el-button></router-link>
              <el-button size="mini" type="danger" plain @click="handleDelete(scope.$index, scope.row)">取消收藏</el-button>
            </template>
          </el-table-column>
        </el-table>    
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="showDoctorIcon">
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,//大头像展示弹窗
      tableData: [],
      search: "",
      showDoctorIcon:"",//当前要展示的医生头像
    };
  },
  created() {
    this.getFavorite();
  },
  methods: {
    getFavorite() {
      let username = sessionStorage.getItem("username");
      if (username != null) {
        this.$axios
          .get("/favorite/queryFavoriteByUsername", {
            params: {
              username: username
            }
          })
          .then(res => {
            console.log(res.data);
            this.tableData = res.data;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$axios({
        method: "post",
        url: "/favorite/deleteFavoriteById",
        data:{
          favoriteId:row.favoriteId
        }
      })
        .then(res => {
          console.log(res.data);
          if(res.data!=0){
            this.$message({
              message: "取消收藏成功",
              type: "success"
            });            
            this.getFavorite();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    showIcon(index,row){
      this.dialogVisible=true;
      this.showDoctorIcon='../'+row.doctorIcon;
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
.my-favorite {
  text-align: left;
  font-size: 18px;
  padding-top: 20px;
  font-weight: bold;
}
.avatar {
  /*圆形头像*/
  width: 50px;
  height: 50px;
  border-radius: 50px;
  cursor: pointer; /*光标呈现为指示链接的指针*/
}
</style>