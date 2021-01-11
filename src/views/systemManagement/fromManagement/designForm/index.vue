<template>
    <fm-making-form
        ref="makingform"
        @saveFormData="saveFormData"
        style="height: 100%"
        preview >
        <template slot="action"> </template>
    </fm-making-form>
</template>
<script>
    import { formSaveData } from "../../../../api/system/fromManagement"
    import router from '@/router'
    export default {
        data () {
            return {

            }
        },
        methods: {/**获取设计器json数据**/
            getjson () {
                return this.$refs.makingform.getJSON()
            },
            saveFormData(data) {
                //保存表单JSON到store
                let temId = this.$route.params.formRowId;
                formSaveData({
                    json: JSON.stringify(data),
                    id : temId
                }).then(res => {
                    this.$message.success("保存成功")
                    router.push({
                        path: 'systemManagement/fromManagement'
                    })
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        mounted() {
            // 获取服务器数据
            // this.$refs.makingform.setJSON(this.jsonData )
            console.log(JSON.parse(this.$route.params.formJson))
            if(this.$route.params.formJson){
                this.$refs.makingform.setJSON(this.$route.params.formJson)
            }
        },
        computed: {
            // ...mapState(['jsonData'])
        },

    }
</script>

<style scoped>

</style>
