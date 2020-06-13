<template>
  <div id="container">
      <div id="context">
        <info-head style="margin-top:0.1rem;" ref="infoHead" @user="userListen"></info-head>
        <div class="chating">
            <div class="chating-message">
              <div style="font-size:15px;font-weight: bold;margin-top:10px;">正在与用户{{toUser}}聊天</div>
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
                            <!-- 聊天 当前医生 -->
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
                    <el-button size="small" icon="el-icon-folder-opened" style="margin-left:10px;" type="info" :disabled="patientBtn" @click="dialogFormVisible = true">该用户信息</el-button>
                    <el-button size="small" icon="el-icon-switch-button" type="danger" @click="closeWebSocket">结束诊断</el-button>
                    <el-button type="success" style="margin-left:440px;" icon="el-icon-position" :disabled="sendFlag" plain @click="send">发送</el-button>  
                  </div>
                  <el-input type="textarea" style="margin-top:2px;" rows="3" v-model="input" placeholder="请输入聊天内容"></el-input>                                   
                </div>
            </div>
            <div class="chating-group">
              <div class="online">待诊人数：{{patientList.length}}</div>
              <el-divider></el-divider>
              <div id="patientList" v-if="patientList.length!=0">
                <ul style="list-style-type:none;text-align:left;padding-left:5px;">
                  <li v-for="patient in patientList" :key="patient.id" :class="patient.sendUser==toUser?'selectShow-show':'selectShow'" @click="selectPatient(patient)">
                      <div class="patient-info">
                        <img :src="patient.userIcon" class="imgsize"> 
                        <div style="margin:10px 0px 0px 10px;">用户{{patient.sendUser}}</div>
                        <el-badge is-dot v-if="patient.newMassage"></el-badge>
                      </div>
                  </li>
                </ul>                  
              </div>
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
                <el-image style="width: 100px; height: 100px;margin-right:10px;" v-for="pic in form.img" :key="pic" :src="pic" :preview-src-list="srcList"></el-image>
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
      patientList: [],
      sendFlag: true, //初始时没有用户，不能发送
      dialogFormVisible: false,
      form: {},
      srcList: [],
      doctor: {},
      patientBtn: true //初始时没有用户，不能查看该用户信息
    };
  },
  created() {
    this.sendUser = "D" + this.$route.path.replace(/[^0-9]/gi, "");
    this.getDoctorInfo();
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
    getChatSubject() {
      var url = "/chatSubject/selectChatSubject";
      this.$axios
        .get(url, {
          params: {
            fromId: this.toUser,
            toId: this.$route.path.replace(/[^0-9]/gi, "")
          }
        })
        .then(res => {
          this.form = res.data;
          var picTmp = [];
          picTmp = this.form.img.split("|");
          picTmp.pop(); //去掉最后一个空元素
          this.form.img = picTmp;
          this.srcList = picTmp;
          console.log(this.form);
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectPatient(patient) {
      // console.log(patiet);
      this.sendFlag = false; //选择用户后,可以发送了
      this.patientBtn = false; //选择用户后，可以查看信息了
      patient.newMassage = false; //去掉小红点
      this.toUser = patient.sendUser;
      this.getChatSubject();
    },
    userListen(value) {
      this.user = value;
      console.log("用户信息");
      console.log(this.user);
      if (this.user.isDoctor != this.$route.path.replace(/[^0-9]/gi, "")) {
        this.$alert("聊天室不匹配！！！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.go(-1);
          }
        });
      }
    },
    getDoctorInfo() {
      var url = "/doctor/getDoctorInfoById";
      this.$axios
        .get(url, {
          params: {
            doctorId: this.$route.path.replace(/[^0-9]/gi, "")
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
    addChatContent() {
      let postData = {
        chatId: this.form.chatId,
        fromId: this.$route.path.replace(/[^0-9]/gi, ""),
        toId: this.toUser,
        message: this.input
      };
      this.$axios({
        method: "post",
        url: "/chatContent/addChatContent",
        data: postData
      })
        .then(res => {
          if (res.data == 1) {
            console.log("添加聊天消息记录成功");
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

        this.updateDoctorTag(0, this.$route.path.replace(/[^0-9]/gi, ""));
      }
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
        //聊天室成员减一
        var exist = false; //该用户是否在聊天室内
        this.patientList.some((item, i) => {
          if (item.sendUser == tmp.closeUser) {
            exist = true;
            this.patientList.splice(i, 1);
            //在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
            return true;
          }
        });
        if (exist) {
          this.$refs.infoHead.hint();
          this.$alert("用户" + tmp.closeUser + "离开了", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              console.log("用户" + tmp.closeUser + "离开了");
              this.sendFlag = true; //不可以发送，需选择其他的用户
              this.patientBtn = true; //不可以查看，需选择其他用户
              this.chatRoom.delete(tmp.closeUser); //清除该用户的聊天室记录
            }
          });
        }
      } else {
        this.$refs.infoHead.hint();
        //聊天成员进来,加入并显示在成员框中
        if (this.chatRoom.get(tmp.sendUser) == null) {
          this.patientList.push({
            sendUser: tmp.sendUser,
            id: new Date().getTime(),
            userIcon: tmp.userIcon,
            newMassage: true //聊天成员进来，显示小红点
          });
        } else {
          //已经在成员中了，新消息进来，显示小红点
          this.patientList.some((item, i) => {
            if (item.sendUser == tmp.sendUser) {
              item.newMassage = true; //
            }
          });
        }
        this.showMessage(msg.data);
      }
    },
    send: function() {
      var params = {
        sendUser: this.sendUser,
        toUser: this.toUser,
        message: this.input,
        userIcon: this.doctor.icon,
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
    updateDoctorTag(tag, doctorId) {
      let Data = {
        doctorId: doctorId,
        tag: tag
      };
      this.$axios({
        method: "post",
        url: "/doctor/updateDoctorTag",
        data: Data
      })
        .then(res => {
          if (res.data == 1) {
            console.log("医生在线状态修改成功");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    closeWebSocket() {
      if (this.socket != "") {
        this.socket.close();
        this.sendFlag = true;
        this.patientBtn = true;
      }
      this.updateDoctorTag(1, this.doctor.doctorId);
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
  width: 1000px;
  margin: 0 auto;
  height: 760px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 80px;
}
.chating-message {
  width: 79%;
  height: 100%;
  float: left;
}
#show {
  margin-left: 8px;
  width: 98%;
  height: 500px;
  overflow-y: auto;
  /* border: 1px solid #333; */
}
.tool {
  text-align: left;
}
.chating-end {
  border-radius: 10px;
  margin: 10px 10px 10px 10px;
  width: 765px;
}
.chating-group {
  width: 20%;
  height: 100%;
  float: right;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.online {
  font-size: 15px;
  font-weight: bold;
  text-align: left;
  margin: 10px 0px 0px 10px;
}
.patient-info {
  display: flex;
  margin-top: 5px;
  cursor: pointer;
}
#patientList li :hover {
  background-color: aliceblue;
}
.selectShow-show {
  background-color: rgb(231, 231, 231);
}
.selectShow {
  background-color: white;
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