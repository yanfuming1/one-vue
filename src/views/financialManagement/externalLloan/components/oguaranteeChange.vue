<template>
    <div>
       <el-form :model="form" ref="form" label-width="150px">
           <el-form-item label="担保人类型">
               <el-input v-model="form.type"></el-input>
           </el-form-item>
           
       </el-form>
       
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form:{
                    type: '自然人'
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>