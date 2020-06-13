<template>
  <div id="container">
    <div class="content">     
        <div class="wallet-tab">
        <div class="account-res">账户余额:¥{{user.money}}</div>
        <br>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
            <el-tab-pane label="充值中心" name="first">
                <h4 style="text-align: left;">充值数量:</h4>
                <el-button icon="el-icon-s-ticket" v-for="money in pay" :key="money" @click="payMoney(money)">¥{{money}}</el-button>
                <el-input v-model="input" maxlength="5" @input="handleInput" placeholder="自定义充值数量" prefix-icon="el-icon-s-ticket" clearable style="margin-left:10px;;width:200px;"></el-input>
                <h4 style="margin-top:50px;">请扫码支付 {{payFor}}元</h4>
                <img src="../../../static/c.jpg" style="width:150px;height:150px;">
                <br><br>
                <el-button type="success" @click="paying">确定</el-button>
            </el-tab-pane>
            <el-tab-pane label="明细查询" name="second">
              <div style="text-align: left;margin-left:10px;">
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
              <el-table :data="tableData" style="width: 100%" height="450">
                <el-table-column prop="orderDate" label="日期" width="180">
                </el-table-column>
                <el-table-column prop="orderId" label="流水号" width="280">
                </el-table-column>                
                <el-table-column prop="income" label="存入"  width="120">
                </el-table-column>
                <el-table-column prop="outcome" label="支出"  width="120">
                </el-table-column>
                <el-table-column prop="res" label="余额"  width="120">
                </el-table-column>
              </el-table>                        
            </el-tab-pane>
        </el-tabs>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      input: "", //自定义充值
      pay: ["1.00", "10.00", "100.00", "1000.00", "10000.00"], //默认充值选择
      payFor: "0.00", //最终支付
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
      tableData: [],
      user: {
        username: "",
        money: ""
      }
    };
  },
  created() {
    if (this.$route.query.index != null)
      this.activeName = this.$route.query.index;
    this.getThisUser();
  },
  methods: {
    getThisUser() {
      let username = sessionStorage.getItem("username");
      if (username != null) {
        this.$axios
          .get("/user/queryUserByUname", {
            params: {
              username: username
            }
          })
          .then(res => {
            console.log(res.data);
            this.user = res.data;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    handleClick(tab, event) {
      console.log(tab.label);
    },
    payMoney(money) {
      this.payFor = money;
    },
    handleInput() {
      this.input=this.input.replace(/[^\d]/g,'')
      var payTmp = this.input;
      if (payTmp == "") {
        payTmp = "0.00";
      } else payTmp = payTmp + ".00";
      this.payFor = payTmp;
    },
    paying() {
      if (this.payFor != "0.00" && Number(this.payFor) > 0) {
        let postData = {
          username: this.user.username,
          income: Number(this.payFor),
          res: this.user.money + Number(this.payFor),
          status: 1 //可能不用这个字段
        };
        this.$axios({
          method: "post",
          url: "/order/addOrder",
          data: postData
        })
          .then(res => {
            console.log(res.data);
          })
          .catch(error => {
            console.log(error);
          });

        let postData2 = {
          username: this.user.username,
          money: this.user.money + Number(this.payFor)
        };
        this.$axios({
          method: "post",
          url: "/user/updateMoney",
          data: postData2
        })
          .then(res => {
            console.log(res.data);
          })
          .catch(error => {
            console.log(error);
          });
        setTimeout(() => {
          console.log("ok");
          this.$message({
            message: "充值成功",
            type: "success"
          });
          this.getThisUser();
        }, 1000);
      } else {
        this.$message({
          message: "充值金额有误，请重新选择!",
          type: "error"
        });
      }
    },
    dateChange() {
      console.log(this.dateValue);
      var startDate = null;
      var endDate = null;
      if (this.dateValue != null) {
        startDate = this.dateValue[0];
        endDate = this.dateValue[1];
      }
      // var startDate = this.dateValue[0];
      // var endDate = this.dateValue[1];
      this.$axios
        .get("/order/queryOrderByDate", {
          params: {
            startDate: startDate,
            endDate: endDate,
            username: this.user.username
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  background-color: white;
  height: 800px;
}
.wallet-tab {
  margin-left: 20px;
}
.account-res {
  text-align: left;
  font-size: 18px;
  padding-top: 20px;
  font-weight: bold;
}
</style>