<template>
    <el-dialog v-dialogDrag :visible="dialog" title="提示" width="30%" :before-close="handleClose">
        <div style="text-align:center;">
            <img src="../../../jontProjectDetail/components/img/mark.png">
            <p style="color:red;text-align:center;font-size:18px;">此项目尚未{{ content }}!</p>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
            <el-button size="mini" style="margin-right:20px;" @click="handleClose">留在此页面</el-button>
            <el-button size="mini" type="primary" @click="handleEnter">{{ content }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { mapState } from 'vuex'
    import { qqtSelect } from '@/components/qqt-subassembly'
    export default {

        props: {
            
            dialog: {
                type: Boolean,
                default: false
            },

            content: {
                type: String,
                default: () => '业主招标'
            },

            toRouter: {
                type: String,
                default: () => 'announcementChange'
            }
        },

        data () {
            return {
                
            }
        },

        methods: {
            
            handleClose () {
                this.$emit ('close')
            },

            handleEnter () {
                this.$router.push({
                    path: toRouter,
                    name: toRouter
                })
            }
            
        },
       
    }
</script>
