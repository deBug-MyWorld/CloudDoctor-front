<template>
  <div id="container">
    <el-divider></el-divider>
    <div class="foot">
    <el-popover placement="top-end" width="400px;" trigger="click">
        <div>
        <span><h1>欢迎赞赏</h1></span>
        <img src="../../static/c.jpg" style="width:150px;height:150px;">
        </div>
        <img src="../../static/end2.png" slot="reference">
        </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  background-color: whitesmoke;
  width: 1800px;
  margin: 0 auto;
}
.foot {
  height: auto;
  width: 1800px;
}
.foot img {
  width: 70%;
  cursor: pointer;
}
</style>