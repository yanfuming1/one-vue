<template>
    <fm-generate-form 
        :data="jsonData"
        :remote="remote"
        :value="data"
        ref="generateForm"
        :transform="transform"
        :remoteOption="remoteOption"
        :style="`margin-top:${top};margin-left:${left}`"
        @on-change="selectGenerateChange"
    />
</template>

<script>
    import { getSelfProjectTofinancial } from '@/api/selfProject/allProject'
    import { getJointProjectTofinancial } from '@/api/jointProject'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { FINANCIALMANAGEMENT } from '@/enum/FORMCODE'
    import { mapState } from 'vuex'
    export default {

        props: {

            top: {
                type: String,
                default: '0'
            },

            left: {
                type: String,
                default: '0'
            },

            type: {
                type: String,
                default: '1'
            },

            size: {
                type: String,
                default: 'medium'
            },

            relevance: {
                type: Object,
                default: () => {}
            },

            isInitLoad: {
                type: Boolean,
                default: () => true
            },

            isTypeRequired: {
                type: Boolean,
                default: () => false
            },

            transform: {
                type: Object,
                default: () => {
                    return {
                        isShowDetails: false
                    }
                }
            }
        },

        data () {
            return {
                data: {},
                remote: {},
                jsonData: {},
                processModuleId: FINANCIALMANAGEMENT.ASSOCIATEDDOCUMENTS,
                documentType: [
                    {
                        // 保证type数据和关联类型的数据保持一致
                    },
                    {
                        relevanceId: 'projectId',
                        relevanceType: 'projectType',
                        relevanceCode: 'projectCode',
                        relevanceName: 'projectName',
                        relevanceRoute: 'selfSupportProject',
                        props: {
                            value: 'projectId',
                            label: 'projectName'
                        }
                    },
                    {
                        relevanceId: 'projectId',
                        relevanceType: 'projectType',
                        relevanceCode: 'projectCode',
                        relevanceName: 'projectName',
                        props: {
                            value: 'projectId',
                            label: 'projectName'
                        }
                    }
                ],
                remoteOption: {
                    projectTypeOptions: [
                        {
                            value: '1',
                            label: '自营'
                        },
                        {
                            value: '2',
                            label: '联营'
                        },
                        {
                            value: '3',
                            label: '其他'
                        }
                    ],
                    relevanceList: []
                },
                num: 0
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) {
                        let element = JSON.parse(res)
                        element.config.size = this.size
                        element.list[1].columns[0].list[0].model = this.documentType[this.type].relevanceType
                        element.list[1].columns[1].list[0].model = this.documentType[this.type].relevanceId
                        element.list[1].columns[2].list[0].model = this.documentType[this.type].relevanceCode
                        element.list[1].columns[1].list[0].options.props = this.documentType[this.type].props
                        element.list[1].columns[0].list[0].options.required = this.isTypeRequired
                        element.list[1].columns[1].list[0].options.disabled = this.data[this.documentType[this.type].relevanceType] == '3' ? true : false
                        this.jsonData = element
                    }
                })
            },

            getProjectTofinancialList (projectType) {
                let url = ''
                if (projectType == '3') {
                    this.remoteOption.relevanceList = []
                    return
                }
                url = projectType == '1' ? getSelfProjectTofinancial : getJointProjectTofinancial
                url ().then (res => {
                    if (res instanceof Array) this.remoteOption.relevanceList = res
                })
            },

            selectGenerateChange (field, val, models) {
                let item = ''
                switch (field) {
                    case this.documentType[this.type].relevanceId:
                        item = this.remoteOption.relevanceList.find (res => res[this.documentType[this.type].relevanceId] == val)
                        if (item) {
                            this.data[this.documentType[this.type].relevanceName] = item[this.documentType[this.type].relevanceName]
                            this.data[this.documentType[this.type].relevanceCode] = item[this.documentType[this.type].relevanceCode]
                            this.data[this.documentType[this.type].relevanceId] = val
                        }
                        break
                    case this.documentType[this.type].relevanceType:
                        if (this.num > 0) {
                            this.data[this.documentType[this.type].relevanceCode] = ''
                            this.data[this.documentType[this.type].relevanceId] = ''
                            this.data[this.documentType[this.type].relevanceName] = ''
                        } else {
                            this.num++
                        }
                        this.data[this.documentType[this.type].relevanceType] = val
                        if (this.isTypeRequired) val == '3' ? this.updataFormJson (true) : this.updataFormJson (false)
                        val && val != '3' ? this.getProjectTofinancialList (val) : this.remoteOption.relevanceList = []
                        break
                }
            },

            updataFormJson (boolean) {
                this.jsonData.list.forEach ((res) => {
                    if (res.columns && res.columns.length > 0) {
                        res.columns.forEach (item => {
                            if (item.list[0].model == 'projectId') {
                                item.list[0].options.disabled = boolean
                            }
                        })
                    }
                })
            },

            getData () {
                let data = this.$refs.generateForm.getDataNotPromise ()
                if (data) {
                    let projectObj = this.remoteOption.relevanceList.find(res=> res.projectId === data.projectId)
                    if (projectObj) data.projectCode = projectObj.projectCode
                    return Object.assign ({}, this.data)
                } else {
                    return false
                }
            },

            evaluationRelevanceDocument (relevance) {
                let item = {}
                item[this.documentType[this.type].relevanceId]   =   relevance[this.documentType[this.type].relevanceId]
                item[this.documentType[this.type].relevanceType] = relevance[this.documentType[this.type].relevanceType]
                item[this.documentType[this.type].relevanceCode] = relevance[this.documentType[this.type].relevanceCode]
                item[this.documentType[this.type].relevanceName] = relevance[this.documentType[this.type].relevanceName]
                this.getProjectTofinancialList (item[this.documentType[this.type].relevanceType])
                this.data = item
            },

            resetForm () {
                this.data = {}
            },

            filtrateRelevanceDocument () {
                switch (this.type) {
                    case '1':
                        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
                        break
                    case '2':
                        this.getFormByJson ()
                        this.$store.dispatch('d2admin/db/database', {user: true}).then (db => {
                            let item = {}
                            item[this.documentType[this.type].relevanceId]   =   db.get('proID').value()
                            item[this.documentType[this.type].relevanceCode] = db.get('proCode').value()
                            item[this.documentType[this.type].relevanceName] = db.get('proName').value()
                            item[this.documentType[this.type].relevanceType] = '2'
                            this.evaluationRelevanceDocument (item)
                        })
                        break
                    
                }
            },

            init (item) {
                let obj = {}
                obj[this.documentType[this.type].relevanceId]   = ''
                obj[this.documentType[this.type].relevanceType] = ''
                obj[this.documentType[this.type].relevanceCode] = ''
                obj[this.documentType[this.type].relevanceName] = ''
                this.data = obj
                item[this.documentType[this.type].relevanceType]
                    ? ( this.evaluationRelevanceDocument (item),
                      this.getFormByJson () )
                    : this.transform.isShowDetails
                    ? item.id 
                    ? this.evaluationRelevanceDocument (item)
                    : this.isInitLoad 
                    ? this.filtrateRelevanceDocument ()
                    : this.getFormByJson ()
                    : this.getFormByJson ()
            }
        },

        created () {
            console.log(this.relevance);
            this.init (this.relevance)
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            
            relevance: {
                deep: true,
                handler (val) {
                    if (val[this.documentType[this.type].relevanceType] == '3') this.num = -1
                    if (val && Object.keys(val).length > 4) this.num = 1
                    this.init (val)
                }
            },

            selfSupportProject (val) {
                this.getFormByJson ()
                if (this.relevance[this.documentType[this.type].relevanceType]) return
                val[this.documentType[this.type].relevanceId] = val[this.documentType[this.type].relevanceCode]
                val[this.documentType[this.type].relevanceType] = '1'
                this.evaluationRelevanceDocument (val)
            },
        }
    }
</script>