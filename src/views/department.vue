<template>
  <div id="container">
    <div id="context">
        <info-head style="margin-top:0.1rem;" ref="infoHead" @user="userListen"></info-head>   
          <el-breadcrumb separator-class="el-icon-arrow-right" class="headInfo">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-home"></i>首页</el-breadcrumb-item>
            <el-breadcrumb-item>全部科室分类</el-breadcrumb-item>
            <el-breadcrumb-item>{{queryDpm}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{queryDpmSmall}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="DepInfo">   
            <el-menu
              :default-active="activeIndex"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              @select="handleSelect"
              :default-openeds="[queryDpm]" 
              active-text-color="#ffd04b">
              <el-submenu :index="dpm.department" v-for="dpm in departmentList" :key="dpm.department" style="text-align:left;">
                <template slot="title">
                  <span>{{dpm.department}}</span>                
                </template>
                <el-menu-item-group>
                  <el-menu-item :index="dpm.department">{{dpm.department}} 全部</el-menu-item>
                  <el-menu-item :index="dpms" v-for="dpms in dpm.departmentSmall" :key="dpms" >{{dpms}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu> 
            <div class="Dep-doctor">
              <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="评分" name="first">
                  <span slot="label">
                    评分
                    <i :class="[sortFlag1?'el-icon-sort-up':'el-icon-sort-down']"></i>
                  </span>                 
                </el-tab-pane>
                <el-tab-pane label="价格" name="second">
                  <span slot="label">
                    价格
                    <i :class="[sortFlag2?'el-icon-sort-up':'el-icon-sort-down']"></i>
                  </span>                  
                </el-tab-pane>
              </el-tabs>
              <div class="Dep-doctorShow">
                  <div style="margin-top:15px;margin-left:30px;" v-for="doctor in dpmDoctors" :key="doctor.doctorId">
                      <el-card style="width:200px;height:320px;margin-right:50px;" :body-style="{ padding: '0px'} " shadow="hover" >
                        <el-tooltip effect="light"  placement="bottom-start">
                          <div style="word-break:break-all;width:150px;font-size:13px;" slot="content">擅长：{{doctor.goodAt}}</div>
                        <!-- <el-image :src="doctor.icon" class="doctor-image">
                          <div slot="placeholder" class="image-slot">
                            <i class="el-icon-loading"></i>
                          </div> 
                        </el-image> -->
                        <router-link :to="'/doctorInfo/'+doctor.doctorId">
                          <img :src="doctor.icon" class="doctor-image">
                        </router-link>                        
                        </el-tooltip>
                        <div class="doctor-info">
                          <div style="font-size:16px;">{{doctor.doctorName}}</div>
                          <div style="font-size:14px;color:#BA55D3">{{doctor.departmentSmall}}</div>
                          <div style="color:#FFD700">☆ {{doctor.rate}}</div>
                          <div style="color:red">¥ {{doctor.price}}</div>
                          <div class="doctor-content">擅长：{{doctor.goodAt}}</div><br/>
                          <router-link :to="'/askDoctor/'+doctor.doctorId">
                          <el-button type="warning" plain size="mini" style="font-size:16px;">向TA提问</el-button>
                          </router-link>
                        </div>
                      </el-card>
                  </div>
              </div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="dpmDoctorsParams.pageNum"
                :page-size="dpmDoctorsParams.pageSize"
                layout="total,prev, pager, next, jumper"
                :total="dpmDoctorsParams.total"
                style="margin-top:20px;"
              ></el-pagination>              
            </div>        
          </div>
        <foot></foot>       
    </div>
  </div>
</template>

<script>
import infoHead from "../components/infohead.vue";
import foot from "../components/foot.vue"
export default {
  components: {
    infoHead,foot
  },
  data() {
    return {
        user:{},
        activeIndex:"",
        queryDpm:"",
        queryDpmSmall:"",
        departments: [], //大科室
        departmentList: [], //科室信息
        activeName: 'first',
        sortFlag1: false,
        sortFlag2: false,
        dpmDoctors:[],
        dpmDoctorsParams:{
          pageNum:1,
          pageSize:6,
          total:0
        },
        currentlabel:"评分"
    };
  },
  created() {
    this.queryDpm=this.$route.query.dpm
    this.queryDpmSmall=this.$route.query.dpmSmall
    this.activeIndex=this.queryDpmSmall
    this.getDepartments()
     this.getDpmDoctors(this.queryDpmSmall,"rate desc")
  },
  methods: {
    userListen(value) {
      this.user = value;
      console.log('index这是首页')
      console.log(this.user)
    },
    handleSelect(key, keyPath) {
      console.log("select")
      console.log(keyPath)
     this.queryDpm=keyPath[0]
     this.queryDpmSmall=keyPath[1]
     this.sortFlag1=false
     this.sortFlag2=false
     this.activeName='first'
     this.getDpmDoctors(this.queryDpmSmall,"rate desc")
    },  
    handleClick(tab, event) {//小科室为空则按大科室找，否则按小科室找
      if(tab.label=="评分"){
        this.sortFlag1=!this.sortFlag1
        this.currentlabel=tab.label
        this.getDpmDoctors(this.queryDpmSmall,this.sortFlag1?"rate asc":"rate desc")
      }
      if(tab.label=="价格"){
        this.sortFlag2=!this.sortFlag2
        this.currentlabel=tab.label
        this.getDpmDoctors(this.queryDpmSmall,this.sortFlag2?"price asc":"price desc")
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
              flag:0
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
    getDpmDoctors(dpm,orderBy){
      var url ="/doctor/queryDoctorByDpm";
      this.$axios
      .get(url,{
        params:{
          dpm:dpm,
          pageNum:this.dpmDoctorsParams.pageNum,
          pageSize:this.dpmDoctorsParams.pageSize,
          orderBy:orderBy,
        }
      })
      .then(res=>{
        // console.log(res.data)
        this.dpmDoctors=res.data.list
        this.dpmDoctorsParams.total=res.data.total
      })
    },
    handleSizeChange(val) {
      this.dpmDoctorsParams.pageSize = val;
      if(this.currentlabel=="评分"){
        this.getDpmDoctors(this.queryDpmSmall,this.sortFlag1?"rate asc":"rate desc")
      }
      if(this.currentlabel=="价格"){
        this.getDpmDoctors(this.queryDpmSmall,this.sortFlag2?"price asc":"price desc")
      }
    },
    handleCurrentChange(val) {
      this.dpmDoctorsParams.pageNum = val;
      if(this.currentlabel=="评分"){
        this.getDpmDoctors(this.queryDpmSmall,this.sortFlag1?"rate asc":"rate desc")
      }
      if(this.currentlabel=="价格"){
        this.getDpmDoctors(this.queryDpmSmall,this.sortFlag2?"price asc":"price desc")
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#context {
  background-color: whitesmoke;
  width: 1800px;
  margin: 0 auto;
}
.headInfo{
  height: 40px;
  position: relative;
  top: 20px;
  left: 300px;
  width: 1200px;
}
.DepInfo {
  position: relative;
  width: 1200px;
  left: 300px;
  top: 20px;
  height:auto;
  /* border: 1px solid red; */
  background-color: white;
  display: flex;
  flex-wrap: nowrap; 
}
.el-menu-vertical-demo{
  width:18%;
  position: relative;
  /* top: -380px; */
}
.Dep-doctor{
  position: relative;
  left:10px;
  width:80%;
}
.Dep-doctorShow{
  /* border: 1px solid red; */
  position: relative;
  width: 850px;
  left:60px;
  height: auto;
  display: flex;
  flex-wrap: wrap;  
}
.doctor-image {
  /*圆形头像*/
  width: 90px;
  height: 90px;
  border-radius: 50px;
  cursor: pointer; /*光标呈现为指示链接的指针*/
  transition: all 0.2s; /*表示所有的属性变化在0.6s的时间段内完成*/
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
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient: vertical;
  font-size: 15px;
  color: silver;
}
.image-slot{
  top: 30px;
  position: relative;
}
</style>