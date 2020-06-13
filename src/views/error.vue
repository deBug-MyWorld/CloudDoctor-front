<template>
  <div class="page-error">
   <img src="../../static/error.png">
   <div class="error">
   <div class="error-info">对不起，您要访问的页面暂时没有找到，您可以:</div>
   <div class="btn">
        <el-button type="danger" style="width:200px;height:50px;font-size:20px;" @click="handleClick">返回之前的页面</el-button>
        <el-button type="danger" style="width:200px;height:50px;font-size:20px;" @click="goIndex">返回首页</el-button>
   </div>
   </div>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  methods: {
    handleClick () {
      this.$router.go(-1)
    },
    goIndex(){
    this.$router.push({
      name:'index'
    })
    }

  },

}
</script>
<style scoped>
.page-error{
  position: relative;
  width: 1200px;
  left: 300px;
  top:100px;
}
.page-error img{
    position: relative;
    width: 500px;
    height:400px;
    right: 300px;
}
.error{
  position: relative;
  width:600px;
  left: 600px;
  top: -15rem;
}
.error-info{
  font-size: 20px;
}
.btn{
  margin-top: 20px;
}
</style>

