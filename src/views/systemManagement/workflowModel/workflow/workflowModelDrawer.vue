<template>
    <div class="workflow-model-drawer">
        <div class="workflow-model-drawer-add" v-if="modelSynopsis == null">
            <el-drawer
                title="新增流程"
                :visible.sync="drawer"
                :direction="direction"
                :before-close="handleClose">
                <div class="workflow-model-add-drawer__content">
                    <workflow-model-add-form 
                        :wrokflowFrom="wrokflowFrom"
                        :departTreeList="departTreeList" 
                        :readonly="readonly" 
                        :btnTitle="btnTitle"
                        :defaultProp="defaultProp"
                        :formProp="formProp"
                        :defaultParams="defaultParams"
                        :statusList="statusList"
                        :formOptions="formOptions"
                        :options="options"
                        @addFromData="onSubmit"
                        @showUserDepartModules="isShow = true"
                        @close="handleClose"
                    ></workflow-model-add-form>
                </div>
            </el-drawer>
        </div>
        <user-modules :showDialog="isShow" @clearUserPage="getDataModule" @closeFun="isShow=false"></user-modules>
    </div>
</template>

<script>
import { GetDepartTree } from '../../../../api/system/depart/depart-tree'
import { addModelSynopsisSuspend } from '../../../../api/system/workflow'
import { getAllFromManageToTree } from '../../../../api/system/fromManagement'

import workflowModelAddForm from './workflowModelAddForm'
import userModules from '../../processDefinition/processModules/userModules'
import layoutHeaderAside from '@/layout/header-aside'
import util from '@/libs/util.js'
export default {
    props: {
        options: Array,
        drawer: {
            type: Boolean,
            default: () => false
        },
        modelSynopsis: {
            type: Object,
            default: () => {}
        },
        isShowElement: {
            type: Boolean,
            default: () => false
        },
        data: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            direction: 'rtl',
            wrokflowFrom: {
                id: '',
                name: '',
                formKey: '',
                startCrewName: '',
                startCrew: '',
                status: '1',
                organizationId: [],
                formId: [],
                groupId: '',
                remark: '',
                companyId: '',
                createdName: util.cookies.get('username'),
                companyName: '',
                departmentId: '',
                departmentName: ''
            },
            defaultProp: {
                value: 'id',
                label: 'name'
            },
            formProp: {
                value: 'code',
                label: 'name'
            },
            defaultParams: {
                label: 'name',
                value: 'id',
                children: 'child',
                checkStrictly: true
            },
            statusList: [
                {
                    value: '1',
                    label: '启用'
                },
                {
                    value: '0',
                    label: '禁用'
                }
            ],
            formOptions: [],
            departTreeList: [],
            isShow: false,
            readonly: true,
            btnTitle: '选择'
        }
    },

    methods: {
        handleClose () {
            this.$emit('drawerClose')
        },

        onSubmit (item) {
            item['organizationId'] = JSON.stringify (item['organizationId'])
            item['formId'] = JSON.stringify (item['formId'])
            addModelSynopsisSuspend(item).then(res => {
                if (res.code === 200) {
                    this.$message.success('添加成功')
                    this.$emit('updateModelSynopsis', item)
                    this.handleClose()
                }
            })
        },

        GetDepartTreeList () {
            let list = []
            GetDepartTree().then(res => {
                if (res) {
                    list.push(res)
                    this.departTreeList = list
                }
            })
        },

        getDataModule (item) {
            let str = ''
            let strId = []
            this.isShow = false
            if (item.length > 0) {
                item.forEach(res => {
                    str += res.name + ','
                    strId.push(res.id)
                })
                this.wrokflowFrom.startCrewName = str.substring(0, str.length - 1)
                this.wrokflowFrom.startCrew = JSON.stringify(strId)
            }
        },

        getFormAll () {
            getAllFromManageToTree ().then (res => {
                if (res && res.length > 0) {
                    res.forEach (item => { item.code = item.dicCode })
                    this.formOptions = res
                }
            })
        }
    },
    
    created () {
        this.GetDepartTreeList()
        this.getFormAll ()
        this.wrokflowFrom.groupId = this.data.id
    },

    components: {
        'user-modules': userModules,
        'workflow-model-add-form': workflowModelAddForm,
    }
}

</script>

<style lang='scss' scoped>
    .workflow-model-add-drawer__content {
        padding: 20px
    }
</style>
