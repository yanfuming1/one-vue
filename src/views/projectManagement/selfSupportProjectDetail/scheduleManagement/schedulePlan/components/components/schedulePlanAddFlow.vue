<template>
    <el-dialog :title="title" class="plan-form" :close-on-click-modal="false" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <fm-generate-form 
            :data="jsonData"
            :remote="remote"
            :remoteOption="remoteOption"
            :value="values"
            :transform="transform"
            ref="generateForm"
            @on-change="selectGenerateChange">
            <template slot="time">
                <el-row class="timeRow">
                    <el-col :span="12">
                        <el-form-item label="计划开工日期" label-width="120px" prop="planStartDate" >
                            <el-date-picker type="date" value-format="yyyy-MM-dd"  v-model="values.planStartDate" :readonly="!isChildrenFlag" @change="timeChange($event,'start')"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划完工日期" label-width="120px" prop="planEndDate" >
                            <el-date-picker type="date" value-format="yyyy-MM-dd" :readonly="!values.planStartDate || !isChildrenFlag" @change="timeChange2($event,'end')" :picker-options="pickerOptions" @focus="dateFoucus" v-model="values.planEndDate"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
             <template slot="planLimit" >
                <el-form-item label="计划工期" label-width="120px" class="planLimit">
                     <el-input disabled="" v-model="values.planLimit">
                         <template slot="append">天</template>
                     </el-input>
                </el-form-item>
             </template>
        </fm-generate-form>
        <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="!transform.isShowDetails" type="primary" @click="cancel('add')">确 定</el-button>
            <el-button @click="cancel('cancel')">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { PROPRIETARYPROJECT } from "@/enum/FORMCODE.js";
import { formGetJson } from '@/api/system/fromManagement/index'
import { staffStaffDictionary } from "@/api/system/staff/staff";
import { schedulePlanAdd, schedulePlanEdit,prepositionList } from "@/api/selfProject/scheduleManagement/schedulePlan/index";
import bottomInformation from '../../../../businessBidding/components/bottomInformation'
import util from '@/libs/util';
import log from '../../../../../../../libs/util.log';
let than = this
export default {
    components: {
        'bottomInformation': bottomInformation,
    },
    props: {
        planDetail: {
            type: Object,
            default:() => { return {} }
        },
        dialogVisible: {
            type: Boolean,
            default: false
        },
        isChildren: {
            type: Boolean,
            default: ()=>{
                return false
            }
        },
        title: {
            type: String,
            default: '新建计划'
        },
        transform: {
            type: Object,
            default: () => {
                return { isShowDetails: false }
            }
        },
        projectCode: {
            type: String,
            default: ''
        },
        overallId: {
            type: String,
            default: ''
        },
        edit: {
            type: Boolean,
            default: false
        },
        taskData: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < new Date(than.values.planStartDate).getTime() - 86400000;
                },
            },
            ruleForm: {
                name: '',
                version: '',
                remark: '',
            },
            rules: {
                planName: [ { required: true, message: '请输入计划名称', trigger: ['blur', 'change' ]}, ],
                version: [ { required: true, message: '请输入版本号', trigger: ['blur', 'change' ]}, ],
            },
            upLoadFileDefaultList: [],
            processModuleId: PROPRIETARYPROJECT.SCHEDULEPLANADD2,
            remote: { },
            remoteOption: {
                prepositionTaskList: []
             },
            values: {
                planStartDate:'',
                planEndDate:'',
                planLimit:0,
                parentId:'',
            },
            jsonData: {},
            taskPrincipalList: [],
            show:false,
            prepositionList:[],
            isChildrenFlag:false
        }
    },
    methods: {
        handleClose(done) {
            done()
        },
        timeChange (value,type) {
            console.log(this.values);
            this.$set(this.values,'planEndDate','')
            this.values.planStartDate = value;
            this.values.planLimit = 0;
        },
        timeChange2 (value) {
            this.values.planEndDate = value;
            // this.values.planLimit = util.dateDiff(value,this.values.planStartDate)
            let data = util.dateDiff(value,this.values.planStartDate) + 1;
            // this.$set(this.values,'planLimit',data)
            this.values.planLimit = data;
            this.$forceUpdate();
        },
        dateFoucus (value) {
            if (!this.values.planStartDate) {
                    this.$message.warning("请先选择计划开工日期")
            }
        },
        selectGenerateChange(field, value, model) {
            // switch (field) {
            //     case 'planStartDate':
            //         if (model.planEndDate && value !== '') {
            //             if (util.compareDate(model.planEndDate, value)) {
            //                 model.planLimit = util.dateDiff(model.planEndDate, value)
            //             } else {
            //                 this.$message.warning("计划开工日期不得晚于计划完工日期!!!")
            //                 model.planStartDate = ''
            //             }
            //         }
            //         break
            //     case 'planEndDate':
            //         if (model.planStartDate && value !== '') {
            //             if (util.compareDate(value, model.planStartDate)) {
            //                 model.planLimit = util.dateDiff(value, model.planStartDate)
            //             } else {
            //                 this.$message.warning("计划开工日期不得晚于计划完工日期!!!")
            //                 model.planStartDate = ''
            //             }
            //         }
            //         break
            // }
            Object.assign(this.values, model)
        },
        
        prepareData (data) {
            let taskPrincipal = this.taskPrincipalList.find(el => el.id === data.taskPrincipalId)
            if (taskPrincipal) { data.taskPrincipal = taskPrincipal.name }

            return data
        },

        cancel(type) {
            if(type === 'add') {
                if (!this.values.planStartDate && !this.values.planEndDate) {
                    this.$message.error('计划开工日期及计划完工日期请补充完整')
                    return
                }
                let item = this.$refs.bottomInformation.getData()
                this.$refs.generateForm.getData().then(data => {
                    if (data && item) {
                        data = this.prepareData(data)
                        let projectCode = this.$store.state.d2admin.selfSupportProject.selfSupportProject.projectCode;
                        let temData = Object.assign({}, data, item, { 'overallId': this.overallId, 'projectCode': projectCode})
                        if (this.edit) {
                            temData.id = this.planDetail.id
                            temData.parentId = this.planDetail.parentId
                        }
                        let obj =Object.assign({}, this.values, temData );
                        let url = this.edit ? schedulePlanEdit : schedulePlanAdd
                        url (obj).then(res => {
                            if(res) {
                                this.$message.success(res.message)
                                this.$emit('close')
                            }
                        })
                    }
                })
            } else {
                this.values = {};
                this.$emit('close')
            }
        },

        getQueryDicByIdList () {
            staffStaffDictionary().then(res => {
                this.taskPrincipalList = res
            }).finally(() => {
                
            })
        },

        formatRemote () {
            this.remote = {
                getTaskPrincipalList(resolve) { resolve(than.taskPrincipalList) },
                getParentList (resolve) { resolve(than.taskData) },
                prepositionTaskList (resolve) { resolve(than.prepositionList) }
            }
        },
        getprepositionList(data){
            prepositionList(data).then(res=> {
                this.prepositionList = res;
                this.formatRemote ()
                this.getFormJson ()
            })
        },
        getFormJson () {
            formGetJson ({ 'code': this.processModuleId }).then(res => {
                if (res) this.jsonData = JSON.parse(res)
            })
        },
    },
    mounted () { 
        than = this        
        this.values = {};
        this.getQueryDicByIdList()
    },
    watch: {
        planDetail: {
            deep: true,
            immediate:true,
            handler (val) {
                let data = JSON.parse(JSON.stringify(val))
                // data.parentId = data.parentId === '0' ? '' : data.parentId;
                this.values = data;
                this.$forceUpdate();
                this.getQueryDicByIdList()
                this.getprepositionList({'number':data.number,'overallId':this.overallId});
            }
        },
        isChildren:{
            deep:true,
            immediate:true,
            handler(flag) {
                this.isChildrenFlag = flag;
            }
        }
    }
}
</script>
<style  scoped>
 .plan-form .timeRow .el-form-item{
    margin-bottom: 0!important;
}
 .plan-form .planLimit{
    margin-bottom: 0!important;
}
</style>