<template>
    <fm-generate-form 
        :data="jsonData"
        :remote="remote"
        :value="projectInfo"
        :transform="transform"
        ref="generateForm"
    />
</template>

<script>
    import { getProjectApprovalById } from '@/api/jointProject/index'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PORJECT_INFO } from '@/enum/PROJECT'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    export default {

        props: {

            transform: {
                type: Object,
                default: () => {
                    return {
                        isShowDetails: false
                    }
                }       
            },

            values: {
                type: Object,
                default: ({})
            }
        },

        data () {
            return {
                remote: {},
                jsonData: {},
                information: {},
                projectInfo: {},
                processModuleId: PORJECT_INFO.JOINTPROJECTINFORMATIONBASIC,
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getProjectInfo (projectId) {
                getProjectApprovalById({ id: projectId }).then(res => {
                    if (res) {
                        if (res.section && res.section.length > 0) {
                            res['sectionName'] = ''
                            res.section.forEach (section => {
                                res['sectionName'] += section
                            })
                        }
                        if (res.projectLocation && res.projectLocation.length > 0) {
                            res['projectLocationName'] = ''
                            res.projectLocation.forEach (projectLocation => {
                                res['projectLocationName'] += projectLocation
                            })
                        }
                        this.projectInfo = res
                    }
                })
            },

            getData () {
                let data = this.$refs.generateForm.getDataNotPromise ()
                if (data) {
                    const { projectCode: itemNumber, projectId, projectName } = this.projectInfo
                    let item = { projectCode, projectId, projectId}
                    return Object.assign ({}, item)
                } else {
                    return false
                }
            },

            updataData () {
                this.$store.dispatch('d2admin/db/database', {user: true}).then (db => {
                    let projectId = '', projectCode = '', projectName = ''
                    projectId   =   db.get('proID').value()
                    projectCode = db.get('proCode').value()
                    projectName = db.get('proName').value()
                    this.$emit ('projectCode', projectCode, projectId, projectName, '2')
                    this.getProjectInfo (projectId)
                })
            }
        },

        created () {
            this.getFormByJson ()
            this.updataData ()
        },

        watch: {
            values () {
                if (this.values.projectCode) {
                    this.$emit ('projectCode', this.values.projectCode, this.values.projectId, this.values.projectName, '2')
                    this.getProjectInfo (this.values.projectId)
                }
            }
        },
    }
</script>
