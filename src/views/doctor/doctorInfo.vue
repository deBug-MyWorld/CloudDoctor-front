<template>
  <div id="contain">
    <info-head style="margin-top:0.1rem;" ref="infoHead" @user="userListen"></info-head>      
    <div class="doctor-info">
      <div style="display:flex;">
        <div class="icon-name">
            <img :src="doctor.icon" class="doctor-icon" alt="加载中">
            <div style="text-align:left;margin-left:20px;width:200px;">
                <div class="doctor-name">{{doctor.doctorName}}</div><br>
                <div class="doctor-dep">{{doctor.departmentBig}} {{doctor.departmentSmall}}</div>
            </div>
        </div>
        <div class="operate">
          <router-link :to="'/askDoctor/'+doctor.doctorId">
          <el-button type="success" icon="el-icon-chat-line-square" :disabled="user.isDoctor==doctor.doctorId" style="font-size:15px;">立刻提问/¥{{doctor.price}}</el-button>
          </router-link>
          <br><br>
          <el-button type="warning" icon="el-icon-star-off" size="small" :disabled="user.isDoctor==doctor.doctorId" round v-if="!likeFlag" @click="addMyLike">关注</el-button>
          <el-button type="warning" icon="el-icon-star-on" size="small" :disabled="user.isDoctor==doctor.doctorId" round v-else @click="deleteMyLike">已关注</el-button>
        </div>
      </div>
        <el-divider></el-divider>
        <div class="doctor-goodAt-des">
            <div style="float:left;font-weight: bold;">擅长:</div>
            <div style="text-align:left;">{{doctor.goodAt}}</div>
        </div>
        <el-divider></el-divider>
        <div class="doctor-goodAt-des">
            <div style="float:left;font-weight: bold;">简介:</div>
            <div style="text-align:left;">{{doctor.description}}</div>
        </div>
        <el-divider></el-divider>
        <div class="comment">
          <div class="comment-head">
          <h3 style="text-align:left;margin-left:10px;">用户评价</h3>
          <el-button type="text" style="font-size:16px;margin-left:800px;" v-if="username!=null&&user.isDoctor!=doctor.doctorId" icon="el-icon-edit" @click="dialogVisible = true">我要评价</el-button>            
          </div>
          <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" width="30%" title="用户评价">
            <div style="display:flex;">
              <span style="font-size:16px;">对医生的评分:</span>
              <el-rate v-model="rateValue" :colors="colors"></el-rate>
            </div><br>
            <el-input type="textarea" placeholder="说说你的看法，100字以内" v-model="textarea" maxlength="100" show-word-limit></el-input>
            <span slot="footer"><el-button type="primary" plain @click="handleComment">发表</el-button></span>
          </el-dialog> 
          <div class="comment-body">
            <img src="../../../static/saySomething.png" v-if="commentList.length==0">
            <div v-for="comment in commentList" :key="comment.commentId" v-else>
              <div class="comment-info">
                <img :src="comment.icon" class="user-icon">
                <div style="text-align:left;margin-left:20px;width:100%">
                  <div style="width:100%">
                    <div class="user-name">{{comment.username}}</div>
                    <el-rate v-model="comment.star" :colors="colors" disabled style="display:inline;margin-left:10px;"></el-rate>
                    <el-button icon="el-icon-delete" circle v-if="username==comment.username" style="float:right;" @click="commentDelte(comment.commentId)"></el-button>
                  </div>
                  <div class="comment-text">{{comment.content}}</div>
                  <div class="comment-time">{{comment.createTime}}</div>
                </div>
              </div>
               <el-divider></el-divider>
            </div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="commentParams.pageNum"
                :page-size="commentParams.pageSize"
                layout="total,prev, pager, next, jumper"
                :total="commentParams.total"
              ></el-pagination>
          </div>
        </div>        
    </div>  
    <foot></foot>
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
      username: "", //由于vue的生命周期，想要页面渲染完成前获取用户名，从session中获取
      user: {},
      doctor: {},
      likeFlag: false,
      textarea: "",
      dialogVisible: false,
      rateValue: null,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      commentList: [],
      commentParams: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
    };
  },
  created() {
    this.username = sessionStorage.getItem("username");
    this.getDoctorInfo();
    this.getLikeFlag();
    this.getCommentList();
  },
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
        })
        .catch(error => {
          console.log(error);
        });
    },
    getLikeFlag() {
      if (this.username != null) {
        var url = "/favorite/selectFavoriteFlag";
        this.$axios
          .get(url, {
            params: {
              doctorId: this.$route.params.id,
              username: this.username
            }
          })
          .then(res => {
            // console.log(res.data);
            if (res.data != "") {
              this.likeFlag = true;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    addMyLike() {
      if (this.username != null) {
        let postData = {
          username: this.username,
          doctorIcon: this.doctor.icon,
          doctorName: this.doctor.doctorName,
          doctorId: this.doctor.doctorId,
          goodAt: this.doctor.goodAt
        };
        this.$axios({
          method: "post",
          url: "/favorite/addFavorite",
          data: postData
        })
          .then(res => {
            if (res.data == 1) {
              this.likeFlag = true;
              this.$message({
                message: "已添加到我关注的医生!",
                type: "success"
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.$message({
          message: "请先登录！",
          type: "error"
        });
      }
    },
    deleteMyLike() {
      let postData = {
        username: this.username,
        doctorId: this.doctor.doctorId
      };
      this.$axios({
        method: "post",
        url: "/favorite/deleteFavorite",
        data: postData
      })
        .then(res => {
          if (res.data == 1) {
            this.likeFlag = false;
            this.$message({
              message: "医生取消关注成功!",
              type: "success"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.textarea = "";
          this.rateValue = null;
          done();
        })
        .catch(_ => {});
    },
    handleComment() {
      //匹配中文，英文，数字，空格，和中文标点
      var textareaRE = /^[\u4E00-\u9FA5A-Za-z0-9\u0020\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+$/;
      if (!textareaRE.test(this.textarea)) {
        this.$message({
          type: "error",
          message: "评论的内容不合法!"
        });
      } else {
        let postData = {
          username: this.user.username,
          doctorId: this.doctor.doctorId,
          doctorName:this.doctor.doctorName,
          content: this.textarea,
          star: this.rateValue,
          icon: this.user.icon
        };
        this.$axios({
          method: "post",
          url: "/comment/addComment",
          data: postData
        })
          .then(res => {
            this.dialogVisible = false;
            if (res.data == 1) {
              this.$message({
                message: "评论成功",
                type: "success"
              });
              this.getCommentList();
              this.textarea="";
              this.rateValue = null;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getCommentList() {
      var url = "/comment/queryCommentByDoctorId";
      this.$axios
        .get(url, {
          params: {
            doctorId: this.$route.params.id,
            pageNum: this.commentParams.pageNum,
            pageSize: this.commentParams.pageSize
          }
        })
        .then(res => {
          console.log(res.data);
          this.commentList = res.data.list;
          this.commentParams.total=res.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //评论分页
    handleSizeChange(val) {
      this.commentParams.pageSize = val;
      this.getCommentList();
    },
    handleCurrentChange(val) {
      this.commentParams.pageNum = val;
      this.getCommentList();
    },
    commentDelte(commentId) {
      let postData = {
        commentId: commentId
      };
      this.$axios({
        method: "post",
        url: "/comment/deleteCommentById",
        data: postData
      })
        .then(res => {
          console.log(res.data);
          if (res.data == 1) {
            this.$message({
              message: "评论删除成功",
              type: "success"
            });
            this.getCommentList();
          }
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
#contain {
  background-color: whitesmoke;
  width: 1800px;
  margin: 0 auto;
}
.doctor-info {
  width: 1000px;
  margin: 0 auto;
  background-color: white;
}
.icon-name {
  display: flex;
  margin-top: 10px;
  width: 800px;
}
.doctor-icon {
  height: 100px;
  width: 100px;
  margin-left: 10px;
  border-radius: 5px;
}
.doctor-name {
  margin-top: 15px;
  font-size: 18px;
  font-weight: bold;
}
.doctor-dep {
  color: brown;
}
.doctor-goodAt-des {
  font-size: 16px;
  margin-left: 10px;
}
.operate {
  margin-top: 20px;
  margin-left: 20px;
}
.comment-head {
  display: flex;
}
.comment-body {
  margin-top: 10px;
  height: auto;
}
.comment-info {
  display: flex;
  margin: 0 30px 0 30px;
}
.user-icon {
  margin-top: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50px;
}
.user-name {
  display: inline;
  font-size: 15px;
}
.comment-text {
  height: 50px;
  margin-top: 10px;
}
.comment-time {
  font-size: 13px;
  color: gray;
}
</style>