<template>
    <div class="form-style-tree">
        <div class="form-style-tree-top">
            <el-checkbox label="全选" name="full" @change="change"></el-checkbox>
        </div>
        <el-tree
            node-key="id"
            :data="styleData"
            show-checkbox
            ref="tree"
            :check-strictly="checkStrictly"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="defaultChecked"
            :props="styleProps">
        </el-tree>
    </div>
</template>

<script>
    export default {
        name: "form-style-tree",
        props: {
            styleData: Array,
            styleProps: Object
        },
        data () {
            return {
                checkStrictly: false,
                defaultChecked: []
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
                if(arr.length === 0){
                    this.$refs.tree.setCheckedKeys([])
                }else{
                    arr.forEach(item => {
                        this.$refs.tree.setChecked(item,true,false)
                    })
                }
            },
        }
    }
</script>

<style lang="scss">
.form-style-tree{
    .form-style-tree-top{
        height: 35px;
        border-bottom: 1px solid #dddddd;
        .el-checkbox span{
            line-height: 35px;
            color: #0e90fe;
        }
    }
}
</style>
