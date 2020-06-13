<template>
  <div id="container">
      <div class="orderData">
      <el-row :gutter="20" class="tool">
        <el-col :span="12">
          <div style="text-align: left;margin-left:20px;padding-bottom:10px;">
            <h4 style="display:inline-block;">请选择时间范围:&nbsp;&nbsp;&nbsp;&nbsp;</h4>
            <el-date-picker
              v-model="dateValue"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
            </el-date-picker>  
            <el-button type="success" size="medium" style="margin-left:20px;" @click="dateChange">确定</el-button> 
          </div> 
        </el-col>
        <el-col :span="6" :offset="5" style="display:flex;">
          <el-input placeholder="请输入用户名"  v-model="search" clearable> </el-input>
          <el-button icon="el-icon-search" circle style="margin-left:10px;" @click="handleSearch"></el-button>
        </el-col>
      </el-row>
        <el-table :data="tableData" border highlight-current-row show-summary :summary-method="getSummaries" style="width:90%;margin:0 auto;"  height="530">
            <el-table-column type="index" :index="indexMethod"  width="50"></el-table-column>  
            <el-table-column prop="orderDate" label="日期" sortable></el-table-column>    
            <el-table-column prop="orderId" label="流水账ID" width="300"></el-table-column> 
            <el-table-column prop="username" label="用户名" ></el-table-column>
            <el-table-column prop="income" label="收入(元)" ></el-table-column>
            <el-table-column prop="outcome" label="支出(元)" ></el-table-column>
            <el-table-column prop="res" label="余额(元)" ></el-table-column>
        </el-table>         
      </div> 
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dateValue: "", //选择时间范围
      search: "",
      tableData: []
    };
  },
  created() {},
  methods: {
    dateChange() {
      var startDate = null;
      var endDate = null;
      if (this.dateValue != null) {
        startDate = this.dateValue[0];
        endDate = this.dateValue[1];
      }
      this.$axios
        .get("/order/queryOrderByDate", {
          params: {
            startDate: startDate,
            endDate: endDate,
            username: this.search
          }
        })
        .then(res => {
          console.log(res.data);
          this.tableData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    indexMethod(index) {
      return index + 1;
    },
    handleSearch() {
      var startDate = null;
      var endDate = null;
      if (this.dateValue != null) {
        startDate = this.dateValue[0];
        endDate = this.dateValue[1];
      }
      this.$axios
        .get("/order/queryOrderByDate", {
          params: {
            startDate: startDate,
            endDate: endDate,
            username: this.search
          }
        })
        .then(res => {
          console.log(res.data);
          this.tableData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value)) && index != 6) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = "";
        }
        if (index === 6) {
          sums[index] = sums[4] - sums[5];
          return;
        }
      });

      return sums;
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
.orderData {
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
.el-table {
  overflow: visible !important;
}
</style>