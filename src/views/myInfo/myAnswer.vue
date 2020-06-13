 <template>
  <div id="container">
    <div id="content">
        <div class="answer">医生回答</div>  
        <el-divider></el-divider>  
        <el-table :data="tableData" style="margin-left:50px;width:90%;" :default-sort = "{prop: 'createTime', order: 'descending'}" stripe height="400">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="用户简述:">
                    <span>{{ props.row.message }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>          
            <el-table-column prop="createTime" label="日期" sortable width="180">
            </el-table-column>
            <el-table-column prop="fromName" label="用户名" width="180">
            </el-table-column>
            <el-table-column prop="title" label="问题主题">
            </el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.getChatSubjectBytoId();
  },
  methods: {
    getChatSubjectBytoId() {
      var url = "/chatSubject/selectChatSubjectBytoId";
      this.$axios
        .get(url, {
          params: {
            toId: this.$route.path.replace(/[^0-9]/gi, "")
          }
        })
        .then(res => {
          this.tableData = res.data;
          console.log(this.tableData);
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
#content {
  background-color: white;
  height: 800px;
}
.answer {
  text-align: left;
  font-size: 18px;
  padding-top: 20px;
  margin-left: 10px;
  font-weight: bold;
}
</style>