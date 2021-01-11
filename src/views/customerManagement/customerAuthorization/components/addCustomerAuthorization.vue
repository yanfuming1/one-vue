<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="添加客户授权" width="35%" :before-close="handleClose">
        <fm-generate-form :data="jsonData" :remote="remote" :value="values" ref="generateForm" @on-change="selectGenerateChange"></fm-generate-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addCustomerAuthorization">确 定</el-button>
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
        <user-modules :showDialog="isAuditman" @clearUserPage="clearUserPage" @closeFun="isAuditman = false"></user-modules>
    </el-dialog>
</template>

<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../enum/FORMCODE'
import { mapState } from 'vuex'

import userModules from '../../../systemManagement/processDefinition/processModules/userModules'
let than = this
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isAuditman: false,
            jsonData: {},
            remote: {},
            values: {
                authority: '',
                authorizationTypeId: '1',
                authorizationObject: '',
                authorizationType: ''
            }
        }
    },

    methods: {

        handleClose () {
            this.$emit('close')
        },

        getFormByJson () {
            formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.ADDCUSTOMERAUTHORIZATION}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },

        addCustomerAuthorization () {

        },

        clearUserPage (item) {
            if (item && item.length > 0) {
            }
            this.isAuditman = false
        },

        selectGenerateChange (field, val, models) {
            switch (field) {
                case 'authorizationTypeId':
                    switch (val) {
                        case '1':
                            this.essentialData (this.allUser)
                            this.neatenData ('人员', '1')
                            break
                        case '2':
                            this.essentialData (this.depart)
                            this.neatenData ('部门', '2')
                            break
                        case '3':
                            this.essentialData (this.data)
                            this.neatenData ('角色', '3')
                            break
                    }
                    break
                case 'authorizationObjectId':

                    break
            }
        },

        essentialData (data) {
            this.remote =  {
                getAuthority (resolve) {
                    resolve (
                        [
                            {
                                id: '1',
                                name: '查询'
                            },
                            {
                                id: '2',
                                name: '编辑'
                            },
                            {
                                id: '3',
                                name: '删除'
                            }
                        ]
                    )
                },
                getAuthorizationObject (resolve) {
                    resolve (data)
                },
                getAuthorizationType (resolve) {
                    resolve (
                        [
                            {
                                id: '1',
                                name: '人员'
                            },
                            {
                                id: '2',
                                name: '部门'
                            },
                            {
                                id: '3',
                                name: '角色'
                            }
                        ]
                    )
                }
            }
        },

        neatenData (lable, value) {
            this.values = {
                authorizationType: lable,
                authorizationTypeId: value,
                authorizationObjectId: '',
                authorizationObject: ''
            }
        }
    },

    created () {
        this.getFormByJson ()
        this.essentialData (this.allUser)
    },

    mounted () {
        than = this
    },

    computed: {
        ...mapState ('d2admin/allUser', [
            'allUser',
            'depart',
        ]),

        ...mapState ('d2admin/allRole', [
            'data'
        ])
    },

    components: {
        'user-modules': userModules
    }
}
</script>

<style lang='scss' scoped>

</style>
