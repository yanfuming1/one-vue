<template>
  <div>{{this.$route.params.name}}
    <div>asd</div>
    <el-button @click="shoye" value="sd"></el-button>
  </div>
</template>

<script>
export default {
  name: "shiyan",
  created() {
    alert("a")
  },
  methods:{
    shoye:function (){

      this.$router.push("/shiyan/2123")
    }
  }
}
</script>

<style scoped>

</style>
