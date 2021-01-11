<template>
    <div class="certificate-list">
        <el-row>
            <el-col class="certificate-col" :span="8" :key="index" v-for="(cerItem, index) in certificateLists">
                <div class="certificate-item b1" @click="openDrawer(cerItem.id)" v-if="cerItem.certificateType === '1'">
                    <div class="certificate-title">
                        <p><span>学历证书</span></p>
                        <p>证书编号: <span v-text="cerItem.encoding"></span></p>
                        <p>证书名称: <span v-text="cerItem.name"></span></p>
                        <p>发证单位: <span v-text="cerItem.issueUnit"></span></p>
                    </div>
                </div>
                <div class="certificate-item b2" @click="openDrawer(cerItem.id)" v-if="cerItem.certificateType === '2'">
                    <div class="certificate-title">
                        <p><span>技能证书</span></p>
                        <p>证书编号: <span v-text="cerItem.encoding"></span></p>
                        <p>证书名称: <span v-text="cerItem.name"></span></p>
                        <p>发证单位: <span v-text="cerItem.issueUnit"></span></p>
                    </div>
                </div>   
                <div class="certificate-item b3" @click="openDrawer(cerItem.id)" v-if="cerItem.certificateType === '3'">
                    <div class="certificate-title">
                        <p><span>专业证书</span></p>
                        <p>证书编号: <span v-text="cerItem.encoding"></span></p>
                        <p>证书名称: <span v-text="cerItem.name"></span></p>
                        <p>发证单位: <span v-text="cerItem.issueUnit"></span></p>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="certificate-list-empty" v-if="certificateLists.length == 0">暂无数据</div>
    </div>
</template>
<script>
    export default {
        name: "certificate-lists",
        props: {
            cerList: {
                type: Array,
                default: () => { return [] }
            }
        },
        data () {
            return {
                certificate: {
                    number: '大学毕业证',
                    name: '',
                    time: ''
                },
                certificateLists: []
            }
        },
        methods: {
            openDrawer (data) {
                this.$emit('openDrawer', data)
            }
        },
        mounted () {
            // console.log(this.cerList)
        },
        watch : {
            cerList () {
                this.certificateLists = this.cerList
            }
        }
    }
</script>

<style scoped lang="scss">
.certificate-list{
    height: 700px;
    overflow-x: hidden;
    .certificate-col{
        .certificate-item{
            cursor: pointer;
            padding: 10px;
            max-width: 340px;
            margin: 0 auto;
            .certificate-title{
                padding: 25px 0px 10px 0px;
                p{
                    color: #FFF;
                    font-size: 12px;
                    margin-bottom: 15px;
                    padding-left: 15px;
                }
                p:first-child span{
                    opacity: 0.7;
                    border: 1px solid #FFF;
                    border-radius: 20px;
                    height: 20px;
                    margin-left: -30px;
                    font-size: 14px;
                    line-height: 20px;
                    padding: 3px 7px;
                }
            }
        }
    }
    .b1{
        background: url("../img/cer-back3.png") center no-repeat;
        background-size: 100% 100%;
        p:first-child span{
            background: #95a1fd;
        }
    }
    .b2{
        background: url("../img/cer-back2.png") center no-repeat;
        background-size: 100% 100%;
        p:first-child span{
            background: #cb9cfc;
        }
    }
    .b3{
        background: url("../img/cer-back1.png") center no-repeat;
        background-size: 100% 100%;
        p:first-child span{
            background: #fcbd81;
        }
    }
    .certificate-list-empty {
        text-align: center;
        font-size: 16px;
        color: $color-text-sub
    }
}
</style>
