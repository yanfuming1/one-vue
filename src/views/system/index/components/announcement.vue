<template>
    <div class="announcement">
        <el-carousel indicator-position="none" height="350px">
            <el-carousel-item v-for="url in imgUrl" :key="url">
                <el-image style="height: 350px;" fit="fill" :src="url"></el-image>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                url1: require ('./img/lun1.jpg'),
                url2: require ('./img/lun2.jpg'),
                url3: require ('./img/lun3.jpg'),
                url4: require ('./img/lun4.jpg'),
                imgUrl: []
            }
        },

        methods: {},

        mounted () {
            this.imgUrl = [this.url1, this.url2, this.url3, this.url4]
        }
    }
</script>

<style lang='scss'>
    .announcement {
        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }
        .el-carousel__item:nth-child(2n+1) {
            background-color: #d3dce6;
        }
    }
</style>
