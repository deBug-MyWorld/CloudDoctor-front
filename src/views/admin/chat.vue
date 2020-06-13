<template>
  <div id="container">
      <div class="chatData">
      <el-row :gutter="20" class="tool">
        <el-col :span="6" :offset="2" style="display:flex;">
          <el-input placeholder="请输入用户或医生名称"  v-model="search"> </el-input>
          <el-button icon="el-icon-search" circle style="margin-left:10px;" @click="getChatSubjectList"></el-button>
        </el-col>
      </el-row>
        <el-table :data="chatData" stripe style="width:90%;margin:0 auto;"  height="500"> 
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline >
                  <el-form-item label="就诊信息:">
                    <span>{{ props.row.message }}</span>
                  </el-form-item>
                  <el-form-item label="图文信息:">
                    <div style="text-align:left;">
                      <el-image style="width: 100px; height: 100px;margin-right:10px;" v-for="pic in props.row.img" :key="pic" :src="pic" :preview-src-list="props.row.srcList">{{pic}}</el-image>
                    </div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>          
            <el-table-column prop="createTime" label="时间" sortable width="155"></el-table-column>    
            <el-table-column prop="fromId" label="用户ID" width="100"></el-table-column>       
            <el-table-column prop="fromName" label="用户名称" ></el-table-column>
            <el-table-column prop="toId" label="医生ID" width="100"></el-table-column>
            <el-table-column prop="toName" label="医生名称" ></el-table-column>
            <el-table-column prop="title" label="主题" width="250"></el-table-column>
            <el-table-column label="操作" width="250">
            <template slot-scope="scopes">
                <el-popover width="650" trigger="click" placement="left">
                  <el-table :data="chatContentData">
                    <el-table-column width="160" property="createTime" label="日期"  sortable></el-table-column>
                    <el-table-column width="100" label="发送者">
                      <template slot-scope="scope">
                        <el-tag :type="scope.row.fromId==scopes.row.fromId?'':'warning'">
                          {{scope.row.fromId==scopes.row.fromId?scopes.row.fromName:scopes.row.toName}}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column width="100" label="接受者">
                      <template slot-scope="scope">
                        <el-tag :type="scope.row.toId==scopes.row.toId?'warning':''">
                          {{scope.row.toId==scopes.row.toId?scopes.row.toName:scopes.row.fromName}}
                        </el-tag>
                      </template>                      
                    </el-table-column>
                    <el-table-column width="250" property="message" label="消息"></el-table-column>
                  </el-table>
                  <el-button size="mini" type="success" icon="el-icon-zoom-in" slot="reference" @click="handleClick(scopes.row)">查看</el-button>
                </el-popover>
                <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scopes.$index, scopes.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>      
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="chatParams.pageNum"
        :page-size="chatParams.pageSize"
        layout="total,prev, pager, next, jumper"
        :total="chatParams.total"
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
      chatParams: {
        pageNum: 1,
        pageSize: 8,
        total: 0
      },
      chatData: [],
      search: "",
      chatContentData: []
    };
  },
  created() {
    this.getChatSubjectList();
  },
  methods: {
    getChatSubjectList() {
      var url = "/chatSubject/queryAllChatSubject";
      this.$axios
        .get(url, {
          params: {
            pageNum: this.chatParams.pageNum,
            pageSize: this.chatParams.pageSize,
            key: this.search
          }
        })
        .then(res => {
          console.log(res.data.list);
          this.chatData = res.data.list;
          for (var i = 0; i < this.chatData.length; i++) {
            var picTmp = [];
            picTmp = this.chatData[i].img.split("|");
            this.chatData[i].img = [];
            this.chatData[i].srcList = [];
            for (var j = 0; j < picTmp.length - 1; j++) {
              this.chatData[i].img.push(picTmp[j]);
              this.chatData[i].srcList.push(picTmp[j]);
            }
          }
          this.chatParams.total = res.data.total;
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
            chatId: row.chatId
          };
          this.$axios({
            method: "post",
            url: "/chatSubject/deleteChatSubjectById",
            data: postData
          })
            .then(res => {
              if (res.data == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.deleteChatContentByChatId(row.chatId)
                this.getChatSubjectList();
              }
            })
            .catch(error => {
              console.log(error);
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
      this.chatParams.pageSize = val;
      this.getChatSubjectList();
    },
    handleCurrentChange(val) {
      this.chatParams.pageNum = val;
      this.getChatSubjectList();
    },
    handleClick(row) {
      var url = "/chatContent/selectChatContentByChatId";
      this.$axios
        .get(url, {
          params: {
            chatId: row.chatId
          }
        })
        .then(res => {
          this.chatContentData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteChatContentByChatId(chatId) {
      let postData = {
        chatId:chatId
      };
      this.$axios({
        method: "post",
        url: "/chatContent/deleteChatContentByChatId",
        data: postData
      })
        .then(res => {
          console.log("聊天信息删除:"+res.data)
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
.chatData {
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
.el-form-item {
  width: 100%;
}
</style>