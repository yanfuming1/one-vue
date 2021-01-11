<template>
    <el-dialog
        :title="operationTitle"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <div class="tree-div">
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="operaTionSub">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { resourceQueryTree, resourceReName } from '../../../../../api/disk/personalImage'
import { personalTree } from '../../../../../api/disk/truePersonal'
import util from '../../../../../libs/util'
export default {
    name: "shareFiles",
    props: {
        operationTitle: {
            type: String,
            default: () => {
                return '移动到'
            }
        },
        identification: {
            type: String,
            default: ''
        }
    },
    data () {
        return{
            dialogVisible: false,
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            choseFileItem: {}
        }
    },
    methods : {
        handleClose (done) {
            done()
        },
        handleNodeClick (data) {
            this.choseFileItem = data
        },
        operaTionSub () {
            this.$emit("moveOrCopyOperation", this.choseFileItem)
        },
        showDialog ()  {
            this.choseFileItem = {}
            this.dialogVisible = true
        },
        cancel () {
            this.dialogVisible = false
        },
        getTreeData () {
            this.treeData = []
            if(this.identification === '0') {
                resourceQueryTree().then(res => {
                    this.treeData = res
                })
            } else {
                personalTree().then(res => {
                    this.treeData = res
                })
            }
        }
    },
    watch: {
        identification () {
            this.getTreeData ()
        }
    }
}
</script>
<style lang="scss">
.tree-div{
    width: 100%;
    height: 350px;
    overflow-y: auto;
}
</style>