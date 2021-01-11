<template>
    <div class="role-style-tree">
        <div class="role-style-tree-top" v-if="!isShowDetails">
            <el-checkbox label="全选" name="full" @change="change"></el-checkbox>
            <span style="float:right;">
                <el-button type="text" size="mini" round @click="expanding('1')">展开</el-button>
                <el-button type="text" size="mini" round @click="expanding('0')">收起</el-button>
            </span>
        </div>
        <el-tree
            v-if="!isShowDetails"
            node-key="id"
            :data="styleData"
            show-checkbox
            ref="tree"
            :check-strictly="checkStrictly"
            :default-expand-all="defaultExpand"
            :props="styleProps">
        </el-tree>
        <el-tree
            v-if="isShowDetails"
            node-key="id"
            :data="styleData"
            ref="tree"
            :check-strictly="checkStrictly"
            :default-expand-all="defaultExpand"
            :props="styleProps">
        </el-tree>
    </div>
</template>

<script>
    export default {
        name: "role-style-tree",
        props: {
            styleData: Array,
            styleProps: Object,
            isShowDetails: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                checkStrictly: false,
                defaultExpand: false
            }  
        },
        methods: {
            change (v) {
                if(v){
                    this.$refs.tree.setCheckedNodes(this.styleData)
                } else {
                    this.$refs.tree.setCheckedKeys([])
                }
            },
            getCheckedKeys () {
                let checkedKeys = this.$refs.tree.getCheckedKeys()
                let halfKeys = this.$refs.tree.getHalfCheckedKeys()

                let res = ''
                halfKeys.forEach(item => {
                    res += item + ','
                })
                checkedKeys.forEach(item => {
                    res += item + ','
                })
                res = res.substring(0, res.length - 1);
                return res
            },
            setCheckedKeys (arr) {
                if(arr.length === 0){
                    this.$refs.tree.setCheckedKeys([])
                }else{
                    arr.forEach(item => {
                        this.$refs.tree.setChecked(item,true,false)
                    })
                }
            },
            expanding (type) {
                let self = this;
                let treeList = this.styleData;
                for (let i = 0; i < treeList.length; i++) {
                    self.$refs.tree.store.nodesMap[treeList[i].id].expanded = type === '1' ? true : false
                }
            }
        }
    }
</script>

<style lang="scss">
.role-style-tree{
    .role-style-tree-top{
        height: 35px;
        border-bottom: 1px solid #dddddd;
        display: inherit;
        .el-checkbox span{
            line-height: 35px;
            color: #0e90fe;
        }
    }
}
</style>
