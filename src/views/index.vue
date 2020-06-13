<template>
  <!-- 包含顶部信息栏 -->
  <div id="container">
      <div id="context">
        <info-head style="margin-top:0.1rem;" ref="infoHead" @user="userListen"></info-head>
          <div class="navigation">
              <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              mode="horizontal"
              @select="handleSelect"
            >
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-menu"></i>全部科室分类</template>
              <el-submenu :index="'1-'+(i+1)" v-for="(dpm,i) in departmentList" :key="i">
                <template slot="title">{{dpm.department}}</template>
                  <el-menu-item :index="'1-'+(i+1)+'-'+(j+1)" v-for="(dpms,j) in dpm.departmentSmall" :key="j" @click="goDpm(dpms,dpm.department)">
                    {{dpms}}
                  </el-menu-item>
                  <el-menu-item :index="'1-'+(i+1)+'-'+(dpm.departmentSmall.length+1)" v-if="dpm.departmentSmall.length==3" @click="goDpm(dpm.department,dpm.department)">
                    更多
                    <i class="el-icon-d-arrow-right"></i>
                  </el-menu-item>             
              </el-submenu>
            </el-submenu>
            <el-menu-item index="2"><i class="el-icon-reading"></i>热点问题百科</el-menu-item>
            <el-menu-item index="3"><i class="el-icon-star-on"></i>推荐医生</el-menu-item>
            <el-menu-item index="4"><i class="el-icon-phone"></i>可免费咨询的医生</el-menu-item>
          </el-menu>
          <!--轮播图-->
          <div style="background-color:white;">
            <el-carousel :interval="2000" type="card" height="300px">
              <el-carousel-item v-for="item in imgs" :key="item.key">
                <img :src="item.src" class="show">
              </el-carousel-item>
            </el-carousel>
          </div>
          </div>
        <!-- 热点问题百科 -->
          <div class="qHot">
            <img src="../../static/questionHot.png" style="float:left;" id="2">
            <br><br><br>
            <el-divider></el-divider>
            <div class="hot-show">
              <div v-for="illness in illnessList" :key="illness.illness" style="margin-left:30px;">
                <el-badge value="hot" class="hot-badge"></el-badge>
                  <el-card
                    style="width:180px;height:260px;margin-right:50px;margin-left:30px;"
                    :body-style="{ padding: '0px'} ">
                    <router-link :to="'/illness/'+illness.illnessId">
                    <img :src="illness.img" class="image">
                      </router-link>
                    <div style="padding: 14px;">
                      <div class="title">{{illness.illness}}</div>
                    </div>
                  </el-card>
                <br>
              </div>
            </div>
            <div>
              <!--分页工具条-->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="illnessParams.pageNum"
                :page-size="illnessParams.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="illnessParams.total"
              ></el-pagination>
            </div>
          </div>
        <!-- 推荐医生 -->
          <div class="recommend">
            <img src="../../static/recommend.png" style="float:left;" id="3">
            <br><br><br>
            <el-divider></el-divider>
            <el-tabs v-model="activeName1" type="border-card" @tab-click="handleClick1">
              <el-tab-pane :label="recommend[0]" name="first">
                <div class="recommend-show">
                  <div style="margin-top:15px;margin-left:30px;" v-for="rdoctor in recommendList" :key="rdoctor.id">
                      <el-card style="width:200px;height:320px;margin-right:50px;" :body-style="{ padding: '0px'} " shadow="hover" >
                        <el-tooltip effect="light"  placement="bottom-start">
                          <div style="word-break:break-all;width:150px;font-size:13px;" slot="content">{{rdoctor.goodAt}}</div>
                        <router-link :to="'/doctorInfo/'+rdoctor.doctorId">
                        <img :src="rdoctor.icon" class="doctor-image">
                        </router-link>
                        </el-tooltip>
                        <div class="doctor-info">
                          <div style="font-size:16px;">{{rdoctor.doctorName}}</div>
                          <div style="font-size:14px;color:#BA55D3">{{rdoctor.departmentSmall}}</div>
                          <div style="color:#FFD700">☆ {{rdoctor.rate}}</div>
                          <div class="doctor-content">{{rdoctor.goodAt}}</div><br/>
                          <router-link :to="'/askDoctor/'+rdoctor.doctorId">
                          <el-button type="warning" plain size="mini" style="font-size:16px;">向TA提问</el-button>
                          </router-link>
                        </div>
                      </el-card>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="item" v-for="item in recommend" :key="item" v-if="item!=recommend[0]">
                <div class="recommend-show">
                  <div style="margin-top:15px;margin-left:30px;" v-for="rdoctor in recommendList" :key="rdoctor.id">
                      <el-card style="width:200px;height:320px;margin-right:50px;" :body-style="{ padding: '0px'} " shadow="hover" >
                        <el-tooltip effect="light"  placement="bottom-start">
                          <div style="word-break:break-all;width:150px;font-size:13px;" slot="content">{{rdoctor.goodAt}}</div>
                        <router-link :to="'/doctorInfo/'+rdoctor.doctorId">
                        <img :src="rdoctor.icon" class="doctor-image">
                        </router-link>
                        </el-tooltip>
                        <div class="doctor-info">
                          <div style="font-size:16px;">{{rdoctor.doctorName}}</div>
                          <div style="font-size:14px;color:#BA55D3">{{rdoctor.departmentSmall}}</div>
                          <div style="color:#FFD700">☆ {{rdoctor.rate}}</div>
                          <div class="doctor-content">{{rdoctor.goodAt}}</div><br/>
                          <router-link :to="'/askDoctor/'+rdoctor.doctorId">
                          <el-button type="warning" plain size="mini" style="font-size:16px;">向TA提问</el-button>
                          </router-link>
                        </div>
                      </el-card>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>         
          </div>
        <!-- 可免费咨询的医生 -->
          <div class="qFree">
            <img src="../../static/qFree.png" style="float:left;" id="4">
            <br><br><br>
            <el-divider></el-divider>
              <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane name="first" label="全部">
                  <div class="doctor-show">
                    <div style="margin-top:15px;margin-left:30px;" v-for="doctor in doctorList" :key="doctor.doctorName">
                      <el-card style="width:200px;height:300px;margin-right:50px;" :body-style="{ padding: '0px'} " shadow="hover" >
                        <el-tooltip effect="light"  placement="bottom-start">
                          <div style="word-break:break-all;width:150px;font-size:13px;" slot="content">{{doctor.goodAt}}</div>
                        <router-link :to="'/doctorInfo/'+doctor.doctorId">
                        <img :src="doctor.icon" class="doctor-image">
                        </router-link>
                        </el-tooltip>
                        <div class="doctor-info">
                          <div style="font-size:16px;">{{doctor.doctorName}}</div>
                          <div  style="font-size:10px;margin-top:5px;margin-bottom:5px;color:#00FF33;">在线</div>
                          <div class="doctor-content">{{doctor.goodAt}}</div><br/>
                          <router-link :to="'/askDoctor/'+doctor.doctorId">
                          <el-button type="warning" plain size="mini" style="font-size:16px;">向TA提问</el-button>
                          </router-link>
                        </div>
                      </el-card>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane  :label="dpm.department" v-for="dpm in departmentList" :key="dpm.department">
                  <div class="doctor-show">
                    <div style="margin-top:15px;margin-left:30px;" v-for="doctor in doctorList" :key="doctor.doctorName">
                      <el-card style="width:200px;height:300px;margin-right:50px;" :body-style="{ padding: '0px'} " shadow="hover" >
                        <el-tooltip effect="light"  placement="bottom-start">
                          <div style="word-break:break-all;width:150px;font-size:13px;" slot="content">{{doctor.goodAt}}</div>
                        <router-link :to="'/doctorInfo/'+doctor.doctorId">
                          <img :src="doctor.icon" class="doctor-image">
                        </router-link>
                        </el-tooltip>
                        <div class="doctor-info">
                          <div style="font-size:16px;">{{doctor.doctorName}}</div>
                          <div  style="font-size:10px;margin-top:5px;margin-bottom:5px;color:#00FF33;">在线</div>
                          <div class="doctor-content">{{doctor.goodAt}}</div><br/>
                          <router-link :to="'/askDoctor/'+doctor.doctorId">
                          <el-button type="warning" plain size="mini" style="font-size:16px;">向TA提问</el-button>
                          </router-link>
                        </div>
                      </el-card>
                    </div>
                  </div>
                </el-tab-pane>            
              </el-tabs>  
              <div>
                <el-pagination
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page="doctorParams.pageNum"
                  :page-size="doctorParams.pageSize"
                  layout="total,prev, pager, next, jumper"
                  :total="doctorParams.total"
                ></el-pagination>
              </div>      
          </div>
        <!-- foot -->
          <foot></foot>
      </div>
  </div>
</template>

<script>
import infoHead from "../components/infohead.vue";
import foot from "../components/foot.vue";
import bg1 from "../../static/bg1.png";
import bg2 from "../../static/bg2.png";
import bg3 from "../../static/bg3.png";
import bg4 from "../../static/bg4.png";
export default {
  components: {
    infoHead,foot
  },
  data() {
    return {
      imgs: [
        //默认图片
        { src: bg1, key: 1 },
        { src: bg2, key: 2 },
        { src: bg3, key: 3 },
        { src: bg4, key: 4 }
      ],
      activeName: "first", //免费咨询分类默认显示的种类
      activeIndex: "1",
      activeName1: "first", //推荐医生分类默认显示的种类
      departments: [], //大科室
      departmentList: [], //科室信息
      illnessList: [],
      illnessParams: {
        pageNum: 1,
        pageSize: 8,
        total: 0
      },
      currentlabel: "全部", //当前展示的类别 默认全部
      currentlabel1: "",
      recommend:[],
      recommendList:[],
      doctorList: [],
      doctorParams: {
        pageNum: 1,
        pageSize: 8,
        total: 0
      },
      user: {}
    };
  },
  created() {
    this.getDepartments();
    this.getIllnessList();
    this.getRecommend();
    this.getDoctorList("全部");
  },
  methods: {
    userListen(value) {
      this.user = value;
      console.log("index这是首页");
      console.log(this.user);
    },
    //跳转
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key == 2 || key == 3 || key == 4) {
        document.getElementById(key).scrollIntoView();
      }
    },
    getDepartments() {
      var url = "/departments/selectByDepartment";
      this.$axios
        .get(url)
        .then(res => {
          // console.log(res.data)
          this.departments = res.data;
          console.log(this.departments);
          this.getDepartmentList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDepartmentList() {
      var url = "/departments/selectByDepartmentSmall";
      for (var i = 0; i < this.departments.length; i++) {
        this.$axios
          .get(url, {
            params: {
              department: this.departments[i],
              flag:1
            }
          })
          .then(res => {
            var Mydpm = {};
            for (var key in res.data) {
              Mydpm.department = key;
              Mydpm.departmentSmall = res.data[key];
            }
            this.departmentList.push(Mydpm);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getIllnessList() {
      var url = "/illness/selectAllIllness";
      this.$axios
        .get(url, {
          params: {
            pageNum: this.illnessParams.pageNum,
            pageSize: this.illnessParams.pageSize
          }
        })
        .then(res => {
          console.log(res.data);
          this.illnessList = res.data.list;
          this.illnessParams.total = res.data.total;
        })
        .catch(error => {
          console.log(error)
        });
    },
    //分页  疾病百科
    handleSizeChange(val) {
      this.illnessParams.pageSize = val;
      this.getIllnessList();
    },
    handleCurrentChange(val) {
      this.illnessParams.pageNum = val;
      this.getIllnessList();
    },
    //分页  可免费咨询医生
    handleSizeChange1(val) {
      this.doctorParams.pageSize = val;
      this.getDoctorList(this.currentlabel);
    },
    handleCurrentChange1(val) {
      this.doctorParams.pageNum = val;
      this.getDoctorList(this.currentlabel);
    },
    //点击不同分类进行查询
    handleClick(tab, event) {
      this.currentlabel = tab.label;
      console.log(this.currentlabel);
      this.getDoctorList(tab.label);
    },
    handleClick1(tab, event) {
      this.currentlabel1 = tab.label;
      console.log(this.currentlabel1);
      this.getRecommendList(tab.label);
    },
    getDoctorList(departmentBig) {
      var url = "/doctor/selectByDpm";
      this.$axios
        .get(url, {
          params: {
            departmentBig: departmentBig,
            pageNum: this.doctorParams.pageNum,
            pageSize: this.doctorParams.pageSize
          }
        })
        .then(res => {
          console.log(res.data);
          this.doctorList = res.data.list;
          this.doctorParams.total = res.data.total;
        })
        .catch(error => {
          console.log(error)
        });
    },
    getRecommend() {
      var url = "/doctor/getRecommend";
      this.$axios
        .get(url)
        .then(res => {
          console.log(res.data);
          this.recommend=res.data;
          this.getRecommendList(this.recommend[0]);
        })
        .catch(error => {
          console.log(error)
        });
    },
    getRecommendList(departmentBig){
      var url ="/doctor/selectByRecommend";
      this.$axios
      .get(url,{
        params:{
          departmentBig:departmentBig
        }
      })
      .then(res=>{
        console.log(res.data)
        this.recommendList=res.data;
      })
      .catch(error => {
        console.log(error)
      });
    },
    goDpm(dpms,dpm){
      this.$router.push({
        path:"/department",
        query:{
          dpm:dpm,
          dpmSmall:dpms
        }
      })
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
.navigation {
  position: relative;
  height: 400px;
  width: 1200px;
  left: 300px;
  top: 20px;
}
.show {
  height: 300px;
  width: 600px;
}
.qHot {
  position: relative;
  width: 1200px;
  height: auto;
  left: 300px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 50px;
  background-color: white;
}
.hot-show {
  display: flex;
  flex-wrap: wrap;
}
.hot-badge {
  position: relative;
  z-index: 2;
  top: 20px;
  left: 70px;
}
.image {
  position: relative;
  top: 10px;
  left: 0px;
  width: 180px;
  height: 200px;
  display: block;
}
.title {
  margin-top: 10px;
  font-size: 15px;
  height: 20px;
}
.recommend {
  position: relative;
  width: 1200px;
  height: auto;
  left: 300px;
  margin-top: 50px;
  background-color: white;
}
.recommend-show {
  display: flex;
  flex-wrap: wrap;
}
.qFree {
  position: relative;
  width: 1200px;
  height: auto;
  left: 300px;
  background-color: white;
  margin-top: 50px;
}
.doctor-show {
  display: flex;
  flex-wrap: wrap;
}
.doctor-image {
  /*圆形头像*/
  width: 90px;
  height: 90px;
  border-radius: 50px;
  margin-left: 5px;
  margin-top: 15px;
  box-shadow: 0 2px 12px 0 gray;
}
.doctor-info {
  margin-top: 20px;
  height: 100px;
  width: 200px;
}
.doctor-content {
  margin: 0 10px 0 10px;
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 15px;
  color: silver;
}
</style>
<style>
.el-tabs__item.is-top {
  font-size: 15px;
}
.el-tabs__item.is-top.is-active {
  font-size: 18px;
}
</style>