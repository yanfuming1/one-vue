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
    import { getSelfProjectHighestVersion } from '@/api/selfProject/allProject/index'
    import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
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
                processModuleId: PROPRIETARYPROJECT.PROJECTINFORMATIONBASIC,
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getSelfQueryBaseMsgByCode (code) {
                getSelfProjectHighestVersion ({projectCode: code}).then (res => {
                    this.projectInfo = res
                })
            },

            getData () {
                let data = this.$refs.generateForm.getDataNotPromise ()
                if (data) {
                    return Object.assign ({}, this.selfSupportProject)
                } else {
                    return false
                }
            }
        },

        created () {
            this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject () {
                this.getFormByJson ()
                this.projectInfo = this.selfSupportProject
                this.$emit ('projectCode', this.selfSupportProject.projectCode, this.selfSupportProject.id,this.selfSupportProject.projectName, '1')
            },

            values () {
                if (this.values.projectCode) {
                    this.$emit ('projectCode', this.values.projectCode, this.values.projectId, this.values.projectName, '1')
                    this.getSelfQueryBaseMsgByCode (this.values.projectCode)
                }
            }
        },
    }
</script>
