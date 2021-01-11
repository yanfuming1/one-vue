<template>
    <div>
        <el-dialog
            v-dialogDrag
            :title="tTitle"
            :visible.sync="dialogVisible"
            width="55%"
            class="staff-edit-dialog"
            :before-close="handleClose">
            
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                :transform="transform"
                @on-change="valueChange"
                ref="generateForm"/>

            <span slot="footer" v-if="showEdit" class="dialog-footer">
                <el-button size="small" type="primary" @click="submit">确定</el-button>
                <el-button size="small" @click="cancel">取消</el-button>
            </span>
            <span slot="footer" v-if="!showEdit" class="dialog-footer">
                <el-button size="small" type="primary" @click="cancel">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { SYSTEMMANAGEMENT } from '../../../../enum/FORMCODE'
import md5 from 'js-md5'
import {GetPositionDic, staffEdit, staffAdd} from '../../../../api/system/staff/staff'
import { GetAllRoleList } from "../../../../api/system/role/role"
import util from '../../../../libs/util'
    let that = this
    export default {
        name: "staff-option",
        props:{
            title: {
                type: String,
                default: ''
            },
            userInfo: {
                type: Object,
                default: () => {}
            },
            edit: {
                type: Boolean,
                default: false
            },
            isAdd: {
                type: Boolean,
                default: false
            },
            roleList: {
                type: Array,
                default: []
            },
            departList: {
                type: Array,
                default: []
            }
        },
        data () {
            return {
                dialogVisible: true,
                tTitle: '',
                isEdit: false,
                readonly: false,
                // 新
                jsonData: {},
                showEdit: true,
                remoteFuncs: {
                    // 性别
                    getSex(resolve){
                        let options = [
                            { id: '0', name: '女'},
                            { id: '1', name: '男'},
                        ]
                        resolve(options)
                    },
                    getPosiId(resolve){ resolve(that.$store.getters['d2admin/allUser/getPositionData']) },  // 职位
                    getAllUser(resolve){ resolve(that.$store.getters['d2admin/allUser/getData']) },  // 所有人员
                    getRole(resolve){ resolve(that.roleList) },   // 角色
                    getDepartList (resolve) { resolve(that.departList) }
                },
                values: {},
                transform: {
                    isShowDetails: false
                }
            }
        },
        methods: {
            valueChange(field, value, model){
                switch (field) {
                    case 'jobNumber':
                        if(this.edit){
                            if(value !== this.userInfo.jobNumber){
                                this.$message.warning("工号不可更改!!!")
                                model.jobNumber = this.userInfo.jobNumber
                            }
                            this.values = model
                        }
                        break
                }
            },
            handleClose (done) {
                this.cancel()
                done()
            },
            setDialogVisible () {
                this.dialogVisible = true
            },
            cancel(){
                this.$emit('close')
            },
            setData(data, temDep) {
                if(util.isArray(data)){
                    data.forEach(item => {
                        temDep += item + ','
                    })
                    return temDep
                }
            },
            formatData(data){
                // 整理数据
                // data.untitled = util.isArray(data.untitled) ? util.jointData(data.untitled, ',') : ''
                data.updatedBy = util.isArray(data.updatedBy) ? util.jointData(data.updatedBy, ',') : ''
                data.subordinateId = util.isArray(data.subordinateId) ? util.jointData(data.subordinateId, ',') : ''
                return data
            },
            submit () {
                this.$refs.generateForm.getData().then(res => {
                    let tem = this.formatData(res)
                    if(this.isAdd){
                        // 添加
                        tem['password'] = md5('123456') // 初始化密码
                        staffAdd( tem ).then(res => {
                            that.$message.success('添加完成');
                            this.cancel()
                            that.$emit('getTableData')
                        })
                    } else {
                        // 编辑
                        tem.id = this.userInfo.id
                        staffEdit( tem ).then(res => {
                            that.$message.success('编辑完成');
                            this.cancel()
                            that.$emit('getTableData')
                        })
                    }
                })
            },
            resetData(data){
                // data.untitled = util.isString(data.untitled) ? util.splitData(data.untitled, ',') : []
                data.subordinateId = util.isString(data.subordinateId) ? util.splitData(data.subordinateId, ',') : []
                data.updatedBy = util.isString(data.updatedBy) ? util.splitData(data.updatedBy, ',') : []
                return data
            },
            judgeState(){
                if(this.isAdd){
                    this.values = this.userInfo
                    this.showEdit = true
                    this.transform.isShowDetails = false
                }else{
                    this.showEdit = false
                    this.values = this.resetData(this.userInfo)
                    this.transform.isShowDetails = true
                    if(this.edit){
                        this.showEdit = true
                        this.transform.isShowDetails = false
                    }
                }
            }
        },
        mounted () {
            that = this
            this.tTitle = this.title
            this.judgeState()
            // 重构
            formGetJson({ code: SYSTEMMANAGEMENT.STAFFADD }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        watch: {
            title () {
                this.tTitle = this.title
            },
            userInfo () {
                this.judgeState()
            }
        }

    }
</script>

<style lang="scss">
.staff-edit-dialog{
    .el-form-item__label{
        padding-left: 0px;
    }
    .el-dialog__body{
        padding: 10px 20px 20px;
    }
    .el-dialog__footer{
        margin-top: 0px;
        text-align: center;
    }
}
</style>
