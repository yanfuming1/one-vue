<template>
    <fm-generate-form 
        :data="jsonData"
        :remote="remote"
        :value="values"
        :transform="transform"
        ref="generateForm"
        @on-change="selectGenerateChange"
    />
</template>

<script>
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
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
                default: () => ({})
            }
        },

        data () {
            return {
                remote: {},
                jsonData: {},
                information: {},
                processModuleId: PROPRIETARYPROJECT.ANNOUNCEMENTCHANGE,
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            selectGenerateChange (field, val, models) {
                this.values[field] = val
            },

            getData () {
                let data = this.$refs.generateForm.getDataNotPromise ()
                if (data) {
                    return Object.assign ({}, data)
                } else {
                    return false
                }
            }
        },

        created () {
            this.getFormByJson ()
        }

    }
</script>

<style lang='scss'>
</style>
