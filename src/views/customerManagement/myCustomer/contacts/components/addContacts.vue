<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="添加联系人" width="40%" :before-close="handleClose">
        <div class="customerDictionary">
            <fm-generate-form :data="jsonData" :remote="remote" :value="values" ref="generateForm"></fm-generate-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveCustomerDictionary">确 定</el-button>
            <el-button @click="$emit('change')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { addContactsData, addFirstPartyContactsData } from '../../../../../api/customerManagement/contacts'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../../enum/FORMCODE'
import { CITYJSON } from '../../../../../enum/CTIYS'
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
    },

    data () {
        return {
            jsonData: {},
            remote: {
                getSex (resolve) {
                    resolve ([
                        {
                            value: '男',
                            label: '男'
                        },
                        {
                            value: '女',
                            label: '女'
                        }
                    ])
                },
                getCity (resolve) {
                    resolve (CITYJSON)
                }
            },
            values: {}
        }
    },

    methods: {

        handleClose () {
            this.$emit('change')
        },

        getDataNull () {
            console.log(this.values)
        },
        
        saveCustomerDictionary () {
            this.$refs.generateForm.getData ().then(res => {
                if (res) {
                    res['associates'] = this.customerInfor.id
                    res['ownerid'] = this.customerInfor.id
                    if (res['city'] && res['city'].length > 0) {
                        res['city'] = JSON.stringify (res['city'])
                    } else {
                        res['city'] = ''
                    }
                    let url = ''
                    switch (this.identification) {
                        case '0':
                            url = addContactsData
                            break
                        case '1':
                            url = addFirstPartyContactsData
                            break
                    }
                    url (res).then(item => {
                        if (item.code === 200) {
                            this.$message.success ('保存成功')
                            this.$emit ('change')
                        }
                    })
                }
            })
            
        },

        getFormByJson () {
            formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.CONTACTS}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },
    },

    created () {
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
        this.$store.dispatch ('d2admin/customer/identificationLoad')
        this.getFormByJson ()
        this.getDataNull ()
    },

    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor',
            'identification'
        ])
    }
}
</script>

<style lang='scss' scoped>
    .customerDictionary {
        padding-left: 15px;
    }
</style>
