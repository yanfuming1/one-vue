<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="合同基本信息" width="50%" :before-close="handleClose">
        <el-divider content-position="left">
            <div class="generate-from-divider___line"></div>
            {{ contractAlteration.label }}
        </el-divider>
        <qqt-table :data="tableData" :rowHeader="rowHeader" :option="tableOption" :isShowIndex="false" :pageShow="false" :isShowSelection="false" :isShowGroup="false" :isDrag="false"/>
        <span slot="footer" class="dialog-footer">
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getSelfContractAlterationVersion, getContractAlterationVersion, getJointContractAlterationVersion } from '@/api/selfProject/contract/contractConcludeSign'
import { qqtTable } from '@/components/qqt-subassembly'
import { mapState } from 'vuex'
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },

        contractAlteration: {
            type: Object,
            default: () => {
                return {
                    label: ''
                }
            }
        },

        identification: {
            type: String,
            default: () => ''
        }
    },
    data () {
        return {
            tableData: {
                records: []
            },
            tableOption: {
                border: false
            },
            rowHeader: [
                {
                    prop: 'version',
                    label: '修改版本',
                    isShow: true
                },
                {
                    prop: 'cvalue',
                    label: '修改内容',
                    isShow: true
                },
                {
                    prop: 'createName',
                    label: '修改人',
                    isShow: true
                },
                {
                    prop: 'createTime',
                    label: '修改时间',
                    isShow: true
                }
            ]
        }
    },

    methods: {

        handleClose () {
            this.$emit('close')
        },

        getContractAlterationVersionList (data) {
            let url = ''
            switch (this.identification) {
                case '1':
                    url = getSelfContractAlterationVersion
                    break
                case '2':
                    url = getJointContractAlterationVersion
                    break
                default:
                    url = getContractAlterationVersion
                    break
            }
            url (data).then((result) => {
                if (result && result.length > 0) {
                    result.forEach (res => {
                        if (res.cvalue == '0') res.cvalue = '否'
                        if (res.cvalue == '1') res.cvalue = '是'
                    })
                }
                this.tableData.records = result
            })
        }
    },

    watch: {
        contractAlteration (val) {
            this.getContractAlterationVersionList (val)
        }
    },

    components: {
        'qqt-table': qqtTable
    }
}
</script>
