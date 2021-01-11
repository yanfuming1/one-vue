<template>
    <d2-container>
        <template>
            <certificate-search
                @addCer="addCertificate"/>
            <el-card class="box-card certificate-con">
                <certificate-lists :cerList="cerList" :chooseType="cerType" @openDrawer="openDrawer"/>
            </el-card>
        </template>
        <el-drawer
            class="personal-drawer"
            :title="DTitle"
            :visible.sync="drawer"
            :direction="direction"
            size="50%"
            :cerType="cerType"
            :before-close="handleClose">
            <certificate-info
                v-if="drawer"
                :cerType="cerType"
                :isAdd="addCer"
                :cerInfoEdit="cerInfo"
                :optionMajor="optionMajor"
                :optionLevel="optionLevel"
                :unitList="unitList"
                @closeDrawer="closeDrawer"/>
        </el-drawer>
  </d2-container>
</template>

<script>
import CertificateSearch from "./commonents/certificate-search"
import CertificateLists from "./commonents/certificate-lists"
import CertificateInfo from "./commonents/certificate-info"
import { cerQueryByUserId,cerQueryById} from '../../../api/personal-information/certificate/certificate'
import { queryDicById } from '../../../api/system/dic/dic'
let that = this
export default {
    data () {
        return {
            DTitle: '新建证书',
            drawer: false,
            direction: 'rtl',
            cerType: '1',
            certificateInfo: {},
            addCer: true,
            cerList:[],
            cerInfo: {},
            optionMajor: [],
            optionLevel: [],
            unitList: []
        };
    },

    methods: {
        handleClose (done) {
            done()
        },
        openDrawer (id) {
            this.DTitle = '编辑证书'
            this.drawer = true
            this.addCer = false
            this.cerList.forEach(item => {
                if(item.id === id){
                    this.cerType = item.certificateType
                }
            })
            cerQueryById(
                {id: id}
            ).then(res => {
                this.cerInfo = res
            })
        },
        addCertificate () {
            this.DTitle = '新建证书'
            this.drawer = true
            this.addCer = true
            this.cerInfo = {
                fileList: [],
                affiliatedUnitId: "",
                certificateType: "",
                createdBy: "",
                departmentId: "",
                encoding: "",
                id: "",
                informationId: "",
                isAbuilding: "",
                issueDate: "",
                issueUnit: "",
                issueUnitId: "",
                keeper: "",
                level: "",
                levelId: "",
                majorType: "",
                majorTypeId: "",
                name: "",
                posiId: "",
                possessor: "",
                possessorid: "",
                procInstId: "",
                procState: "",
                remark: "",
                updateBy: "",
                updateTime: "",
                userId: "",
                cerInfoEdit: [],
            }
        },
        closeDrawer () {
            this.drawer = false
            this.getCerList()
        },
        getCerList () {
            cerQueryByUserId().then(res => {
                that.cerList = res
            })
        },
        getComInfo(){
            queryDicById({
                id: '1168431017937518592'
            }).then(res => {
                this.optionMajor= res
            })
            queryDicById({
                id: '1171610409157152768'
            }).then(res => {
                this.optionLevel= res
            })
            queryDicById({
                id: '1176796218676121600'
            }).then(res => {
                this.unitList = res
            })
        }
    },
    components: {
        CertificateInfo,
        CertificateLists,
        CertificateSearch,
    },
    mounted() {
        that = this
        this.getCerList()
        this.getComInfo()
    }
};
</script>

<style lang="scss">
.certificate-con{
    margin-top: 20px;
    height: calc(100% - 60px);
}
.personal-drawer{
    .el-drawer__container .el-drawer .el-drawer__body{
        height: 100% !important;
        overflow-y: scroll !important;
    }
}
span{
    outline: none;
}
.el-drawer{
    outline: none;
}
</style>
