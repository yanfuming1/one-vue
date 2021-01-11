<template>
    <el-dialog v-dialogDrag title="选择交接人" :visible.sync="dialogTableVisible" width="20%">
        <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            @check="isCheckBox"
            :props="defaultProps">
        </el-tree>
        <el-row class="button">
            <el-button type="primary" @click="clearUserPageEvent()">确定</el-button>
            <el-button @click="closeFunEvent()">关闭</el-button>
        </el-row>
    </el-dialog>
</template>

<script>
import { handoverPersonResignation } from '../../../api/personnelManagement/leaveApplication'
export default {
    data () {
        return {
            dialogTableVisible: true,
            data: [],
            checkBoxData:[],
            trainingData: [],
            defaultProps: {
              children: 'child',
              label: 'name'
            },
        }
    },
    methods: {

        getHandoverPersonResignation () {
            handoverPersonResignation().then( res => {
                this.data = res.child
            }).catch( err => {
                console.log(err)
            })
        },

        getReceiverData () {

        },

        isCheckBox (event) {
            this.trainingData = event
        },

        clearUserPageEvent () {
            this.$emit('clearUserPageEvent', this.trainingData)
        },
        
        closeFunEvent () {
            this.dialogTableVisible = false
        },

    },

    created () {
        this.getHandoverPersonResignation ()
    },
}
</script>

<style scoped>
    .button {
        margin: 12px 0;
        text-align: center  
    }
</style>