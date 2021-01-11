<template>
    <d2-container type="fulls" class="early-params-list">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="预警参数设置" name="first">
                    <div class="early-params-div">
                        <el-tag>备注: 以开工时间和完工时间为参数，实际和计划进行对比，滞后时间越长，预警级别越高。</el-tag>
                        <params-table ref="startList" :listData="startList" :isShowElement="isShowElement" :lableTile="'实际开工时间比计划开工时间滞后'" ></params-table>
                        <params-table ref="endList" :listData="endList" :isShowElement="isShowElement" :lableTile="'实际完工时间比计划完工时间滞后'" ></params-table>
                    </div>
                    <div class="early-params-btn" style="text-align:center; margin-bottom:20px;">
                        <el-button v-if="!isShowElement" size="mini" type="primary" @click="updateList">更新参数设置</el-button>
                        <el-button v-if="isShowElement" size="mini" type="primary" @click="saveData">保存</el-button>
                        <el-button v-if="isShowElement" size="mini" @click="updateList">取消</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </d2-container>
</template>
<script>
import projectInfo from '../../../components/commenInfo/projectInfo';
import { warningParameterList, warningParameterListByProCode, warningParameterListUpdate } from '@/api/selfProject/scheduleManagement/warningParamsSet';
import paramsTable from './paramsTable'
import { mapState } from 'vuex';
export default {
    components: {
        'project-info': projectInfo,
        'params-table': paramsTable
    },
    data () {
        return {
            activeName: 'first',
            startList: [],
            endList: [],
            isShowElement: false
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        initList (lagType) {
            let arr = []
            for (let i=1; i<6; i++) {
                let item = {
                    'projectCode': this.selfSupportProject.projectCode,
                    'lagType': lagType,
                    'warningRank': i+''
                }
                arr.push(item)
            }
            return arr
        },
        getWarningParamsList () {
            warningParameterListByProCode({
                'projectCode': this.selfSupportProject.projectCode
            }).then(res => {
                if (res.startList.length === 0) {
                    this.startList = this.initList('1')
                } else {
                    this.startList = res.startList
                }
                if (res.endList.length === 0) {
                    this.endList = this.initList('2')
                } else {
                    this.endList = res.endList
                }
            })
        },
        updateList () {
            this.isShowElement = !this.isShowElement
        },
        saveData () {
            warningParameterListUpdate({
                'projectCode': this.selfSupportProject.projectCode,
                'startList': this.$refs.startList.getData(),
                'endList': this.$refs.endList.getData()
            }).then(res => {
                this.$message.success('更新完成!!!')
                this.updateList ()
            })
        },
    },
    mounted () {
        
    },
    computed: {
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ])
    },
    async created () {
        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
    },

    watch: {
        selfSupportProject () {
            this.getWarningParamsList ()
        }
    }
}
</script>
<style lang="scss">
.early-params-list{
    .qqt-container-full__header{  padding-top: 20px !important; }
    .qqt-container-full__body{ 
        padding-top: 0px !important;
        .el-tabs__nav-scroll{ padding-left: 20px !important; }
    }
    .el-tabs{ 
        height: 100%;
        .el-tabs__content{
            height: calc(100% - 51px);
            overflow-y: scroll;
        }
    }
    .early-params-div{
        width: 600px;
        margin: 0 auto;
        .el-tag { width: 100%; margin-bottom: 20px; color: #909399; }
    }
    .is-leaf, .el-table__row td{ padding: 6px 0px; }
    .cell{ text-align: center; }
}
</style>