<template>
  <div id="container">
      <div id="context">
        <info-head style="margin-top:0.1rem;" ref="infoHead" @user="userListen"></info-head>      
        <div class="chating">
            <div style="font-size:15px;font-weight: bold;padding-top:10px;">正在与{{doctor.doctorName}}聊天</div>
            <el-divider></el-divider>
            <div id="show">
                <ul style="list-style-type:none">
                        <li v-for="message in chatRoom.get(toUser)" :key="message.id">
                        <!-- 聊天 目标用户 -->
                        <div v-if="message.userId==toUser">
                        <div class="container2">
                        <div class="img-location"><img :src="message.userIcon" class="imgsize"></div> 
                        <div class="chat-bubble chat-bubble-left" > {{message.message}}</div>
                        </div>
                        </div>
                        <!-- 聊天 当前用户 -->
                        <div v-else>
                        <div class="container1">
                        <div class="chat-bubble chat-bubble-right"> {{message.message}}</div>
                        <div class="img-location"><img :src="message.userIcon" class="imgsize"></div> 
                        </div>
                        </div>
                    </li>
                </ul>
            </div>
            <el-divider></el-divider>
            <div class="chating-end">
              <div class="tool">
                <el-button size="small" icon="el-icon-folder-opened" style="margin-left:10px;" type="info" @click="dialogFormVisible=true">用户信息</el-button>
                <el-button size="small" icon="el-icon-switch-button" type="danger" @click="closeWebSocket">结束诊断</el-button>
                <el-button type="success" style="margin-left:450px;" icon="el-icon-position" :disabled="sendFlag" plain @click="send">发送</el-button>  
              </div>
              <el-input type="textarea" style="margin-top:2px;" rows="3" v-model="input" placeholder="请输入聊天内容"></el-input>                                   
            </div>
        </div>
        <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="标题:" label-width="120px">
              <el-input v-model="form.title" disabled></el-input>
            </el-form-item>
            <el-form-item label="详情:" label-width="120px">
              <el-input type="textarea" v-model="form.message" disabled></el-input>
            </el-form-item>
            <el-form-item label="图片:" label-width="120px">
              <div style="text-align:left;">
                <el-image style="width: 100px; height: 100px;margin-right:10px;" v-for="pic in form.img" :key="pic" :src="pic" :preview-src-list="srcList">{{pic}}</el-image>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>  
        <foot></foot>  
      </div>
  </div>
</template>

<script>
import infoHead from "../../components/infohead.vue";
import foot from "../../components/foot.vue";
import { setTimeout, clearTimeout } from "timers";
export default {
  components: {
    infoHead,
    foot
  },
  data() {
    return {
      user: {},
      path: "ws://localhost:8080/vueChat/",
      socket: "",
      sendUser: "",
      toUser: "",
      input: "",
      messageList: [],
      timer: "",
      chatRoom: new Map("", []),
      dialogFormVisible: false,
      form: {},
      srcList: [],
      freeCnt: 3,
      sendFlag: false,
      doctor: {}
    };
  },
  created() {
    this.sendUser = this.$route.query.sendUser;
    this.toUser = "D" + this.$route.query.toUser;
    this.getDoctorInfo();
    this.getChatSubject();
  },
  mounted() {
    // 初始化
    this.init();
  },
  beforeDestroy() {
    ////关闭时断开socket连接
    this.onbeforeunload();
    clearTimeout(this.timer);
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
            doctorId: this.$route.query.toUser
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
    getChatSubject() {
      var url = "/chatSubject/selectChatSubject";
      this.$axios
        .get(url, {
          params: {
            fromId: this.sendUser,
            toId: this.$route.query.toUser
          }
        })
        .then(res => {
          this.form = res.data;
          var picTmp = [];
          picTmp = this.form.img.split("|");
          this.form.img = [];
          var i;
          for (i = 0; i < picTmp.length - 1; i++) {
            this.form.img.push(picTmp[i]);
            this.srcList.push(picTmp[i]);
          }
          console.log(this.form);
        })
        .catch(error => {
          console.log(error);
        });
    },
    addChatContent() {
      let postData = {
        chatId: this.form.chatId,
        fromId: this.$route.query.sendUser,
        toId: this.$route.query.toUser,
        message: this.input
      };
      this.$axios({
        method: "post",
        url: "/chatContent/addChatContent",
        data: postData
      })
        .then(res => {
          if(res.data==1){
            console.log("添加聊天消息记录成功")
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    paying() {
      let postData = {
        username: this.user.username,
        outcome: this.doctor.price,
        res: this.user.money,
        status: 1 //可能不用这个字段
      };
      this.$axios({
        method: "post",
        url: "/order/addOrder",
        data: postData
      })
        .then(res => {
          if(res.data==1){
            console.log("添加订单表成功")
          }
        })
        .catch(error => {
          console.log(error);
        });
      let postData2 = {
        username: this.user.username,
        money: this.user.money 
      };
      this.$axios({
        method: "post",
        url: "/user/updateMoney",
        data: postData2
      })
        .then(res => {
          if(res.data==1){
            console.log("修改用户余额成功")
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //websocket
    init: function() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        // var sendUser = this.$route.params.userId
        var sendUser = this.sendUser;
        this.socket = new WebSocket(this.path + sendUser);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
        // 监听socket关闭
        this.socket.onclose = this.close;
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = this.onbeforeunload;
      }
      this.$notify({
        title: "提示",
        message: "每人有3次免费咨询的机会！！！",
        duration: 0
      });
    },
    open: function() {
      console.log("socket连接成功");
    },
    error: function() {
      console.log("连接错误");
    },
    getMessage: function(msg) {
      console.log(msg.data);
      var tmp = JSON.parse(msg.data);
      if (tmp.type == "userClose") {
        console.log(tmp.closeUser + "离开了");
        //对方下线了
        if (tmp.closeUser == this.toUser) {
          this.$refs.infoHead.hint();
          this.$alert("对方已下线，聊天室销毁！", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.go(-1);
            }
          });
        }
        //账号重复，强制下线
        if (tmp.closeUser == this.sendUser) {
          this.$refs.infoHead.hint();
          this.$alert("账号在别处登录，您已被强制下线！", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.go(-1);
            }
          });
        }
      } else {
        this.$refs.infoHead.hint();
        this.showMessage(msg.data);
      }
    },
    checkFee() {
      this.freeCnt--;
      if (this.freeCnt > 0) {
        this.$notify({
          title: "提示",
          message: "您还剩下" + this.freeCnt + "次免费咨询的机会！！！",
          duration: 0
        });
      } else {
        this.$message({
          message: "现在是收费咨询！！！每条费用" + this.doctor.price + "元",
          type: "warning"
        });
        //判断医生是否免费,查询用户余额，若余额充足，进行收费，不足给出提示信息，退出
        if (this.doctor.price != 0) {
          if (this.user.money > this.doctor.price) {
            console.log("ok")
            this.user.money -= this.doctor.price;
            this.paying()
          } else {
            this.$notify.error({
              title: "提示",
              message: "余额不足！！！",
              duration: 0
            });
            this.sendFlag = true;
          }
        }
      }
    },
    send: function() {
      this.checkFee();
      var params = {
        sendUser: this.sendUser,
        toUser: this.toUser,
        message: this.input,
        userIcon: this.user.icon,
        type: "send"
      };
      params = JSON.stringify(params);
      this.socket.send(params);
      this.showMessage(params);
      this.addChatContent();
      this.input = "";
    },
    close: function() {
      console.log("socket已经关闭");
    },
    closeWebSocket() {
      if (this.socket != "") {
        this.socket.close();
        this.sendFlag = true;
      }
    },
    onbeforeunload() {
      this.closeWebSocket();
    },
    showMessage(params) {
      params = JSON.parse(params);
      var show = document.getElementById("show");
      var userId = "";
      if (params.type == "send") {
        userId = params.toUser;
      } else {
        userId = params.sendUser;
      }
      if (this.chatRoom.get(userId) == null) {
        this.chatRoom.set(userId, []);
      }
      this.chatRoom.get(userId).push({
        userId: params.sendUser,
        userIcon: params.userIcon,
        message: params.message,
        id: new Date().getTime()
      });
      // 使用Map数据结构只能这样更新
      this.chatRoom = new Map(this.chatRoom);
      console.log(this.chatRoom);
      this.timer = setTimeout(() => {
        show.scrollTop = show.scrollHeight;
      }, 100);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#context {
  background-color: whitesmoke;
  width: 1800px;
  margin: 0 auto;
}
.chating {
  width: 800px;
  margin: 0 auto;
  height: 760px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 80px;
}
#show {
  margin-left: 8px;
  width: 98%;
  height: 500px;
  overflow-y: auto;
  /* border: 1px solid #333; */
}
.chating-end {
  border-radius: 10px;
  margin: 10px 10px 10px 10px;
  width: 765px;
}
/* 聊天气泡样式 */
.chat-bubble {
  position: relative;
  margin: 12px;
  padding: 5px 8px;
  word-break: break-all;
  background: #fff;
  border: 1px solid #989898;
  border-radius: 5px;
  max-width: 180px;
}
.chat-bubble-right:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  right: -20px;
  top: 5px;
  border: 10px solid;
  border-color: transparent transparent transparent #989898;
}
.chat-bubble-right:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  right: -16px;
  top: 7px;
  border: 8px solid;
  border-color: transparent transparent transparent #ffffff;
}
.chat-bubble-left:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  left: -20px;
  top: 5px;
  border: 10px solid;
  border-color: transparent #989898 transparent transparent;
}
.chat-bubble-left:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  left: -16px;
  top: 7px;
  border: 8px solid;
  border-color: transparent #ffffff transparent transparent;
}
.imgsize {
  width: 60px;
  height: 60px;
  border-radius: 50px;
}
.container1 {
  display: flex;
  justify-content: flex-end;
}
.container2 {
  display: flex;
  justify-content: flex-start;
}
.el-input.is-disabled /deep/ .el-input__inner {
  color: #606266;
}

.el-textarea.is-disabled /deep/ .el-textarea__inner {
  color: #606266;
}
</style>