<template>
    <div>
        <fm-generate-form 
            :data="jsonData"
            :remote="remote"
            :value="values"
            :transform="transform"
            ref="generateForm"
            @on-change="selectGenerateChange"
        >
        </fm-generate-form>
    </div>
</template>

<script>
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    let than = this
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
                processModuleId: PROPRIETARYPROJECT.BIDDINGCONTACTINFORMATION
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            selectGenerateChange (field, val, models) {

            }
        },

        created () {
            this.getFormByJson ()
        },

        mounted () {
            than = this
        }
    }
</script>
