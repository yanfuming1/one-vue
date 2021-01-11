<template>
    <fm-generate-form 
        :data="jsonData"
        :remote="remote"
        :value="values"
        ref="generateForm"
        :transform="transform"
        @on-change="selectGenerateChange"
    />
</template>

<script>
    import { getSelfContractConcludeSignById, getContractConcludeSignById, getJointContractConcludeSignById,
             getSelfContractConcludeSignStateList, getContractConcludeSignStateList, getJointContractConcludeSignStateList } from '@/api/selfProject/contract/contractConcludeSign'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'

    import util from '@/libs/util.js'
    let than = this
    export default {

        props: {
            contract: {
                type: Object,
                default: () => {}
            },

            isContractEdit: {
                type: Boolean,
                default: () => true
            },

            transform: {
                type: Object,
                default: () => {
                    return {
                        isShowDetails: false
                    }
                }
            },

            identification: {
                type: String,
                default: () => {
                    return ''
                }
            },

            projectCode: {
                type: String,
                default: () => {
                    return ''
                }
            }
        },

        data () {
            return {
                values: {},
                remote: {},
                jsonData: {},
                processModuleId: PROPRIETARYPROJECT.BASICSCONTRACT,
                contractConcludeSignList: []
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) {
                        let element = JSON.parse(res)
                        if (!this.isContractEdit) {
                            element.list.forEach(data => {
                                if (data.model == 'contrac') {
                                    data.columns[0].list[0].type = 'input'
                                    data.columns[0].list[0].model = 'contractname'
                                    data.columns[0].list[0].options.required = false
                                    data.columns[0].list[0].options.disabled = true
                                }
                            })
                        }
                        this.jsonData = element
                    }
                })
            },

            getData () {
                let data = this.$refs.generateForm.getDataNotPromise ()
                if (data) {
                    data['contractid'] = this.values.contractid
                    data['contractname'] = this.values.contractname
                    return Object.assign ({}, data)
                } else {
                    return false
                }
            },

            getContractConcludeSign (id) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfContractConcludeSignById
                        break
                    case '2':
                        url = getJointContractConcludeSignById
                        break
                    default:
                        url = getContractConcludeSignById
                        break
                }
                url ({'id': id}).then (res => {
                    console.log('hello');
                    console.log(this.identification);
                    console.log(res);
                    console.log(JSON.parse(JSON.stringify(res)));
                    if (res.managerCreate) {
                        res.managerCreate['contractid'] = id
                        this.values = res.managerCreate
                        this.$emit ('contractInformation', res.createOthers, res.managerCreate)
                    }
                })
            },

            getContract () {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfContractConcludeSignStateList
                        break
                    case '2':
                        url = getJointContractConcludeSignStateList
                        break
                    default:
                        url = getContractConcludeSignStateList
                        break
                }
                url ({'projectCode': this.projectCode ? this.projectCode : null}).then (res => {
                    if (res) this.contractConcludeSignList = res, this.neatenData ()
                })
            },

            neatenData () {
                this.remote = {
                    getContractList (resolve) {
                        resolve (than.contractConcludeSignList)
                    }
                }
            },

            selectGenerateChange (field, val, models) {
                let item = '', str = ''
                switch (field) {
                    case 'contractid':
                        if (this.values.contractid == val) return
                        this.getContractConcludeSign (val)
                        break
                }
            },
        },

        created () {
            this.getFormByJson ()
            if (this.identification == '') this.getContract ()
            this.contract.contractid ? this.getContractConcludeSign (this.contract.contractid) : ''
        },

        mounted () {
            than = this
        },

        watch: {
            'contract': {
                deep: true,
                handler (val) {
                    if (val.contractid) this.values = val
                }
            },
            projectCode: {
                deep: true,
                handler (val) {
                    if (this.identification != '') this.getContract ()
                }
            }
        }
    }
</script>
