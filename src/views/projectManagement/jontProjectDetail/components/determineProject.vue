<template>
    <el-dialog
        v-dialogDrag
        append-to-body
        title="提示"
        :visible.sync="isDialog"
        top="10vh"
        width="30%"
        :close-on-click-modal="false"
        :before-close="hintEnter">
        <div style="text-align:center;">
            <img src="./img/mark.png">
            <p style="color:red;text-align:center;font-size:18px;">此项目的立项审批没有通过不能进行{{title}}！</p>
        </div> 
        <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
            <el-button size="mini" type="primary" @click="hintEnter">去立项登记查看</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { getProById } from '@/api/jointProject/index'
    import { mapActions } from 'vuex'
    export default {

        props: {
            
            title: {
                type: String,
                default: ''
            },

            proId: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                isDialog: false
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close'
            ]),

            hintEnter () {
                this.isDialog = false
                let tagName = this.$route.path
                let path = '/projectManagement/jontProjectDetail/projectApproval'
                let name = 'projectApproval'
                this.close ({ tagName, path, name })
            },

            getProjectInfoById () {
                if (!this.proId) return
                getProById({id: this.proId}).then(res => {
                    this.isDialog = res && res.state == '3' ? false : true
                })
            },
        },

        created () {
            this.getProjectInfoById ()
        },

        watch: {
            proId () {
                this.getProjectInfoById ()
            }
        }
    }
</script>