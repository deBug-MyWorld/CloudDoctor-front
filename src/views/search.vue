<template>
  <div id="container">
    <div id="context">
        <info-head style="margin-top:0.1rem;" ref="infoHead"  @user="userListen"></info-head>
        <div class="my-search">
            <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="综合" style="font-size:16px;">综合</el-menu-item>
            <el-menu-item index="疾病" style="font-size:16px;">疾病({{Qillness.length}})</el-menu-item>
            <el-menu-item index="医生" style="font-size:16px;">医生({{Qdoctor.length}})</el-menu-item>
            <el-menu-item index="科室" style="font-size:16px;">科室({{Qdepartment.length}})</el-menu-item>
            </el-menu>  
            <div class="search-show">
                <div v-if="Qillness.length!=0&&(activeIndex=='综合'||activeIndex=='疾病')">
                    <div v-for="item in Qillness" :key="item.illness" class="illness-show">
                        <div style="width:200px;font-size:18px;margin-left:5px;">
                        <router-link :to="'/illness/'+item.illnessId">
                         {{item.illness}}　疾病百科
                        </router-link></div>
                        <div class="ill-sum" v-html="item.summarize" ></div>
                        <div class="ill-link">
                        <router-link :to="'/illness/'+item.illnessId" tag="div">病因　症状　检查　治疗　并发症　预防饮食</router-link>
                        </div>
                    </div>
                    <el-divider></el-divider>
                </div>
                <div v-if="Qdoctor.length!=0&&(activeIndex=='综合'||activeIndex=='医生')">
                    <div v-for="doctor in Qdoctor" :key="doctor.doctorName" class="doctor-show">
                        <router-link :to="'/doctorInfo/'+doctor.doctorId">
                        <img :src="doctor.icon" class="doctor-image">
                        </router-link>
                        <div class="introduceDoc">
                            <div style="margin-top:5px;width:50px;color:black;">{{doctor.doctorName}}</div>
                            <div style="font-size:10px;margin-top:5px;">{{doctor.departmentSmall}}</div>
                            <div style="font-size:10px;margin-top:5px;margin-bottom:5px;">擅长：{{doctor.goodAt}}</div>
                            <router-link :to="'/doctorInfo/'+doctor.doctorId">医生主页</router-link>
                        </div>
                    </div>
                    <el-divider></el-divider>
                </div>             
                <div v-if="Qdepartment.length!=0&&(activeIndex=='综合'||activeIndex=='科室')">
                    <div v-for="item in Qdepartment" :key="item.departmentSmall" class="department-show">
                        <div style="margin-top: 5px;">
                          <router-link :to="{path:'department',query:{dpm:item.department,dpmSmall:item.departmentSmall}}" tag="div">
                            <div class="introduceDep">{{item.departmentSmall}}</div>
                            <div class="DepKind">所属科室：　{{item.department}}</div>
                            <div style="float:right;margin-right:15px;"><i class="el-icon-d-arrow-right"></i></div>
                          </router-link>
                        </div>
                    </div>
                    <el-divider></el-divider>
                </div>
                <div v-if="(Qillness.length==0&&Qdoctor.length==0&&Qdepartment.length==0)||(Qillness.length==0&&activeIndex=='疾病')||(Qdoctor.length==0&&activeIndex=='医生')||(Qdepartment.length==0&&activeIndex=='科室')" 
                class="noFound">
                  抱歉，没有找到与 “<span style="color:red;">{{this.queryData}}</span>” 相关的信息。
                  <br>
                  <br>
                  云医社建议：
                  <br>
                  <li>看看你是不是写了错别字</li>
                  <li>换用其它关键词查询</li>
                  <li>不要输入太长句子，尽量使用简短的语句</li>
                  <li>用空格将多个关键字分开</li>
                </div>
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
        queryData:'',
        activeIndex: '综合',
        Qillness:[],
        Qdoctor:[],
        Qdepartment:[],
        user:{},
    };
  },
  watch: {
    '$route': function (route) {//路由监听 keyword变化进行搜索
      var query = route.query;
      this.queryData = query.keyword;
      if(this.queryData!=null){
        this.queryAll(this.queryData)
      }
    },
  },  
  created() {
      this.queryData=this.$route.query.keyword;
      console.log("bbbbbbbbbbb")
      console.log(this.queryData)
      if(this.queryData!=null){
        this.queryAll(this.queryData)
      }
  },
  methods: {
    userListen(value) {
      this.user = value;
      console.log('用户信息')
      console.log(this.user)
    },
    handleSelect(type, keyPath) {
        this.activeIndex=type

    },
    queryAll(key){
        this.Qillness=[];
        this.Qdoctor=[];
        this.Qdepartment=[];      
        this.queryIllness(key)
        this.queryDoctor(key)
        this.queryDepartment(key)
    },
    queryIllness(key){
      var url="/illness/selectIllnessByName";
      this.$axios
      .get(url,{
        params:{
          key:key
        }
      })
      .then(res=>{
        // console.log(res.data)
        this.Qillness=res.data
      })
      .catch(error=>{
        console.log(error)
      })
    },
    queryDoctor(key){
      var url="/doctor/selectDoctorByName";
      this.$axios
      .get(url,{
        params:{
          key:key
        }
      })
      .then(res=>{
        // console.log(res.data)
        this.Qdoctor=res.data
      })
      .catch(error=>{
        console.log(error)
      })
    },
    queryDepartment(key){
      var url="/departments/selectDepartmentByName";
      this.$axios
      .get(url,{
        params:{
          key:key
        }
      })
      .then(res=>{
        // console.log(res.data)
        this.Qdepartment=res.data
      })
      .catch(error=>{
        console.log(error)
      })
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
.my-search{
  position: relative;
  height: auto;
  width: 800px;
  left: 500px;
  top: 20px;
}
.search-show{
  height:auto;
  background-color: white;
  padding-top: 5px;
}
.el-menu-demo{
    height:60px;
    width: 800px;
}
.illness-show{
    position: relative;
    height:130px;
    width: 800px;
    text-align: left;
    border-bottom: 1px solid black;
}
.ill-sum{
    font-size: 14px;
    height: 75px;
    margin: 0 20px 0 5px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
.ill-link {
   cursor: pointer;
   width: 320px;
   margin-left: 5px;
}
.doctor-image {
    width: 100px;
    height:100px;
    cursor: pointer; /*光标呈现为指示链接的指针*/
    margin-left: 5px;
    margin-top: 15px;
    float: left;
}
.doctor-show{
    position: relative;
    height:140px;
    width: 800px;
    border-bottom: 1px solid black;
}
.introduceDoc{
    margin-top:15px;
    float: right;
    text-align: left;
    width: 600px;
    height: 100px; 
}
.introduceDoc a {
  text-decoration: none;
}
.department-show{
    position: relative;
    height:40px;
    width: 800px;
    cursor: pointer;
    border-bottom: 1px solid black;  
}
.introduceDep{
  width:100px;
  text-align:left;
  float:left;
  margin-left:15px;
  margin-top: 10px;
}
.DepKind{
  text-align:left;
  position:relative;
  left:200px;
  top: 10px;
  width:300px;
}
.noFound{
  text-align:left;
  margin-top:15px;
  height:300px;
  margin-left: 5px;
}
</style>