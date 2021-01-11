<template>
   <d2-container class="add-project-patrol-registration">
       <el-dialog
            v-dialogDrag
            append-to-body
            title="提示"
            :visible.sync="hint"
            top="10vh"
            width="30%"
            :close-on-click-modal="false"
            :before-close="hintEnter">
            <div style="text-align:center;">
                <img src="../../components/img/mark.png">
                <p style="color:red;text-align:center;font-size:18px;">此项目的立项审批没有通过不能添加工程巡查记录！</p>
            </div>
            <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
                <el-button size="mini" type="primary" @click="hintEnter">去立项登记查看</el-button>
            </span>
        </el-dialog>
        <fm-generate-form
            :data="jsonData"
            :remote="remoteFuncs"
            :value="values"
            :transform="transformInfo"
            ref="generateForm"/>
            <bottomInformation :values="values" :isGrid="false" :isShowAccessory="false" :transform="transformInfo" ref="bottomInformation"></bottomInformation>
            <div class="operation-button">
                <el-button type="primary" size="small" v-if="saveBtn" @click="saveInformationBtn">保存</el-button>
                <el-button type="info" size="small" v-if="!saveBtn" @click="printTemplate">打印</el-button>
                <!-- <el-button type="primary" size="mini" @click="submissionBtn">提交</el-button> -->
                <el-button type="primary" plain size="small" @click="closeTag">取消</el-button>
            </div>
            <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
import {mapActions } from 'vuex'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { PORJECT_INFO } from '../../../../../enum/PROJECT'
import bottomInformation from '../../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import {basicInformationQueryItem, saveInformation, patrolRecordEdit, queryPatrolRecordByID} from '../../../../../api/jointProject/projectInspectionRegistration'
import util from '../../../../../libs/util'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
let that = this
export default {
    components: { bottomInformation,
        'print-template-by-html': printTemplateByHtml },
    data () {
        return {
            hint: false,
            values:{
                projectName:'',
                section:''
            },
            transformInfo: {
                isShowDetails: false
            },
            saveBtn:true,
            jsonData: {},
            remoteFuncs:{},
            remark:'',
            code: BASICSCODE.JOINT_ENGINEERING_INSPECTION_RECORDS
        }
    },

    methods: {
        hintClose(){
            this.hint = false;
        },
        //跳转到立项
        hintEnter(){

            // this.$router.push({
            //     path:'',
            // });
            let tagName = this.$route.path
            let path = '/projectManagement/jontProjectDetail/projectApproval'
            let name = 'projectApproval'
            this.close ({ tagName, path, name })

        },
        getFormByJson () {
            formGetJson ({'code': PORJECT_INFO.ADDJOINTINSPECTIONRECORD}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },
        async getbasicInformationQueryItem() {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('proID').value()
            basicInformationQueryItem({
                id: this.proId
            }).then(res => {
                console.log(res.state)
                this.hint = res.state === '3' ? false :true ;
                this.values.projectName = res.projectName
                if(util.isArray(res.section)){
                    this.values.section = res.section
                } else if(util.isString(res.section)) {
                    this.values.section = util.splitData(res.section)
                } else {
                    this.values.section = []
                }
            })
        },
        getqueryPatrolRecordByID () {
            queryPatrolRecordByID({
                id: this.$route.params.rowData.id
            }).then( res => {
                this.values = res
            })
        },
        addAndEditEvent(data) {
            if(this.$route.params.isAdd){
                // 如添加状态需处理数据
            } else if (this.$route.params.isDetail) {
                this.saveBtn = false
                this.transformInfo.isShowDetails = true
                    this.getqueryPatrolRecordByID ()
            }else{
                // 编辑
                this.getqueryPatrolRecordByID ()
            }
        },
        saveInformationBtn () {
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(item => {
                if(item && bottomInformation) {
                    item = Object.assign({}, item, bottomInformation)
                    item['projectId'] = this.proId
                    if(this.$route.params.isAdd){
                        saveInformation(item).then( res => {
                            this.$message.success("保存成功")
                            this.closeTag()
                        }).catch(err => {
                            this.$message.error("保存失败")
                        })
                    }else{
                        item['id'] = this.values.id
                        patrolRecordEdit(item).then( res => {
                            this.$message.success("编辑成功")
                        }).catch( err => {
                            this.$message.error("编辑失败")
                        })
                    }
                }
            })
        },
        submissionBtn () {
                this.$refs.generateForm.getData().then(res => {
                // res.section = util.jointData(res.section, ',')
                // that.$route.params.cashType.forEach(item => {
                //     if(res.marginId === item.id){
                //         res.marginType = item.name
                //     }
                // })
                // this.$route.params.collectUnitAccount.forEach(item => {
                //     if(res.collectUnitAccountId === item.id){
                //         res.collectUnitAccount = item.name
                //     }
                // })
                // res.projectId = that.proId
                // res.projectType = '1'
                // res.associatedPersonId = this.values.associatedPersonId
                // if(that.$route.params.isAdd){
                //     console.log(res)
                //     // 添加
                //     marginPaymentAdd(
                //         res
                //     ).then(res => {
                //         that.$message.success("添加成功~~~")
                //         that.closeTab()
                //     })
                // }else{
                //     // 编辑
                //     res.id = that.values.id
                //     marginPaymentEdit(
                //         res
                //     ).then(res => {
                //         that.$message.success("编辑成功~~~")
                //         that.closeTab()
                //     })
                // }
            })
        },

        closeTag () {
            let tagName = this.$route.path
            let path = '/projectManagement/jontProjectDetail/projectInspectionRegistration'
            this.close ({ tagName, path })
        },
        async printTemplate () {
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.rowData.id }).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },
        ...mapActions('d2admin/page', [
            'close'
        ]),

    },

    created () {

        this.getbasicInformationQueryItem ()
        this.getFormByJson ()
        this.addAndEditEvent()
    },

    mounted () {
    },

    watch: {
    }
}
</script>


<style lang='scss' scoped>
.operation-button{
    margin: 0 auto;
    text-align: center;
}
.up-load-div .el-divider__text{
    position: relative;
    display: inline-block;
    padding-left: 23px;
    &::before{
        content: '';
        width: 3px;
        height: 15px;
        background: #346fff;
        position: absolute;
        left: 15px;
        top: 4px;
    }
}
</style>
