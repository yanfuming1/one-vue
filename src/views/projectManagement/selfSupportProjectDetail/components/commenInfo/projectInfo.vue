<template>
    <el-card class="box-card self-project">
        <el-row>
            <el-col :span="11">
                <div class="project-title">
                    <el-tooltip class="item" effect="dark" :content="projectInfo.projectName" placement="top-start">
                        <p class="pro-name">
                            <i class="el-icon-notebook-2"></i>
                            <span>{{ projectInfo.projectName }}</span>
                             &nbsp;&nbsp;
                            <span class="projectInfo-sectionDic">{{ projectInfo.sectionDic }} </span>
                            <span class="project-principal">业务负责人: {{ projectInfo.createName }}</span>
                        </p>
                    </el-tooltip>
                    <p>
                        <i class="el-icon-location-outline"></i>
                        项目地址：{{ projectInfo.projectAddress }} / {{ projectInfo.area }} / {{ projectInfo.detailAddress }}
                        <span v-if="projectInfo.financePrincipal" class="project-principal">财务负责人: {{ projectInfo.financePrincipal }}</span>
                    </p>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="project-detail">
                    <p><span>信息来源:</span>  {{ projectInfo.sourceDicName }}</p>
                    <p><span>项目类型:</span>  {{ projectInfo.projectTypeDic }}</p>
                    <el-tooltip class="item" effect="dark" :content="projectInfo.projectCategoryDic" placement="top-start">
                        <p><span>工程类别:</span>  {{ projectInfo.projectCategoryDic }}</p>
                    </el-tooltip>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="project-detail">
                    <p><span>项目建设模式:</span>  {{ projectInfo.createPatternDic }}</p>
                    <p><span>项目资金来源:</span>  {{ projectInfo.capitalSourceDic }}</p>
                    <p><span>预计投资额度:</span>  {{ projectInfo.predictInvestLimit }}元</p>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="project-detail">
                    <p><span>预计招标时间:</span>  {{ projectInfo.predictBidTime }}</p>
                    <p><span>预计开工时间:</span>  {{ projectInfo.predictOpenTime }}</p>
                    <p><span>预计竣工时间:</span>  {{ projectInfo.preductCompletedTime }}</p>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
import { selfProjectQueryById, selfQueryBaseMsgByCode } from '@/api/selfProject/allProject/index'
export default {
    props: {
        proCode:{
            type: String,
            default: ''
        }
    },
    data () {
        return {
            projectInfo: {},
            proId: '',
            temCode: ''
        }
    },
    methods: {
        getProInfo (code) {
            selfQueryBaseMsgByCode({code: code}).then(res => {
                this.projectInfo = res
                this.$emit ('getProjectInfo', this.projectInfo)
            })
        }
    },
    async mounted () {
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        this.proId = db.get('selfProID').value()
        this.temCode = this.proCode === '' ? db.get('selfProCode').value() : this.proCode
        this.getProInfo(this.temCode)
    },
    watch: {
        proCode: {
            deep: true,
            handler(newVal, oldVal) {
                this.temCode = newVal === '' ? this.temCode : newVal
                this.getProInfo(this.temCode)
            }
        }
    }
}
</script>
<style lang="scss">
.self-project{
    margin-bottom: 10px;
    .el-card__body{
        padding: 0px;
        .project-title{
            padding: 10px 30px;
            p{
                height: 40px;
                line-height: 40px;
                font-size: 18px;
                .project-principal{
                    float: right;
                    color: #FFF;
                    background: #979EFE;
                    border-radius: 5px;
                    font-size: 16px;
                    width: 150px;
                    right: 5px;
                    height: 25px;
                    line-height: 25px;
                    text-align: center;
                }
                i{
                    color: #66b1ff;
                    font-size: 18px;
                }
            }
            p:last-child{
                font-size: 13px;
            }
            .pro-name{
                // position: relative;
                // padding-right: 160px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                .projectInfo-sectionDic {
                    font-size: 16px;
                }
                span{
                    // position: absolute;
                    // float: right;
                    // top: 5px;
                    // text-align: center;
                }
            }
            .financial-administrator {
                width: 150px;
                height: 25px;
                line-height: 25px;
                border-radius: 5px;
                margin-right: 5px;
                color: #FFF;
                background: #979EFE;
                font-size: 16px;
                float: right;
                text-align: center;
            }
        }
        .project-detail{
            border-left: 1px solid #DDD;
            padding: 5px 0px 5px 20px;
            p{
                height: 30px;
                line-height: 30px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                span{
                    color: #66b1ff;
                }
            }
        }
    }
}
</style>
