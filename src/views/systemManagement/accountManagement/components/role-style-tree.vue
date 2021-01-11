<template>
    <div class="role-style-tree">
        <!-- <el-tree
            node-key="id"
            :data="styleData"
            show-checkbox
            ref="tree"
            :check-strictly="checkStrictly"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="defaultChecked"
            :props="styleProps"> -->
        <div class="role-info">
            <el-tree
                node-key="id"
                :data="roleTreeData"
                ref="tree"
                :check-strictly="checkStrictly"
                :props="styleProps">
            </el-tree>
        </div>
    </div>
</template>

<script>
    export default {
        name: "role-style-tree",
        props: {
            styleData: Array,
            styleProps: Object
        },
        data () {
            return {
                checkStrictly: false,
                defaultChecked: [],
                roleTreeData: [],
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
                return res
            },
            setCheckedKeys (arr) {
                this.$refs.tree.setCheckedKeys([])
                if(arr.length === 0){
                    this.$refs.tree.setCheckedKeys([])
                }else{
                    arr.forEach(item => {
                        this.$refs.tree.setChecked(item,true,false)
                    })
                }
            },
            setTree(data) {
                this.roleTreeData = data
            }
        }
    }
</script>

<style lang="scss">
.role-style-tree{
    .role-info{
        height: 400px;
        overflow-y: scroll;
    }
}
</style>
