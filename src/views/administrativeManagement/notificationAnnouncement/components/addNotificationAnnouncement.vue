<template>
    <div>
        <el-drawer
            :title="title"
            direction="rtl"
            size="70%"
            :visible.sync="visible"
            :before-close="handleClose">
            <notificationAnnouncementInfo
                :addPubilshInfo = "addPublishInfoData"/>
                <div class="demo-drawer__footer">
                    <el-button type="primary" @click="prePubilshDialog">确定</el-button>
                    <el-button @click="cancelPubilshDialog">取 消</el-button>
                </div>
        </el-drawer>
    </div>
</template>

<script>
import notificationAnnouncementInfo from "../components/notificationAnnouncementInfo"
import { publishMessageAdd, publishMessageEdit} from "../../../../api/personal-information/messageManagement"
export default {
    name:"addPubilshNewsDialog",
    components : {notificationAnnouncementInfo},
    props:{
        title: String,
        rowData :{
            type:Object,
            default : () => {}
        },
        editPublish:Boolean,
        addPubilshDialogForm:{
            type: Boolean,
            default: false
        },
        isAdd: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            addPublishInfoData: {
            },
            editPublishData:{},
            visible: false
        };
    },
    methods: {
        cancelPubilshDialog () {
            this.$emit('cancelPubilshDialogForm')
        },
        prePubilshDialog () {
            let jsonData = JSON.parse(JSON.stringify(this.addPublishInfoData))
            delete jsonData.scopeName;
            if(this.isAdd){
                if (jsonData.content === undefined){
                    this.$message.warning("请输入公告内容")
                } else {
                    publishMessageAdd(
                        jsonData
                    ).then( res => {
                        if (res.code === 200) {
                            this.$message.success("添加成功")
                            this.$emit('successFun')
                            this.visible = false
                        }
                    }).catch( err => {
                        console.log(err)
                    })
                }
            }else{
                publishMessageEdit(
                   jsonData
                ).then( res => {
                    this.$message.success("编辑成功")
                    this.$emit('successFun')
                    this.visible = false
                }).catch( err => {
                    console.log(err)
                })
            }
            this.$emit('successFun')
        },
        handleClose (done) {
            this.visible = false
            // this.$confirm('确定要提交表单吗？')
            // .then(_ => {
            //     publishMessageAdd(
            //         this.addPublishInfoData
            //     ).then( res => {
            //         if (res.code === 200) {
            //             this.$message.success("添加成功")
            //             this.$emit('successFun')
            //             this.visible = false
            //         }
            //     }).catch( err => {
            //         this.$message.warning("请输入内容")
            //     })
            // }).catch(_ => {
            //     done()
            // });
        },
        showDrawer() {
            this.visible = true
        }
    },
    mounted () {
        this.visible = this.addPubilshDialogForm
        this.addPublishInfoData = this.rowData
    },
    watch : {
        addPubilshDialogForm() {
            this.visible = this.addPubilshDialogForm
        },
        rowData () {
            this.addPublishInfoData = this.rowData
        }
    }
}
</script>
<style lang="scss">
.demo-drawer__footer{
    text-align: center;
    margin-top: 10px;
}
</style>
