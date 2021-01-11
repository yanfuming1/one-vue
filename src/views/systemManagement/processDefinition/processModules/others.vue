<template>
    <div class="others">
        <user-tree
            :data="defaultList"
            ref="eleTree"
            :isShowFilter="false"
            :defaultProps="defaultProps"
            @checkBoxData="checkBoxData"
        ></user-tree>
    </div>
</template>

<script>
    import userTree from '../../../../components/user-depart/userTree' 
    export default {

        props: {
            other: {
                type: Array,
                default: () => []
            }
        },

        components: {
            userTree
        },

        data () {
            return {
                otherList: [],
                defaultList: [
                    {
                        id: 'apply',
                        name: '申请人',
                        children: []
                    },
                    {
                        id: 'applyLead',
                        name: '申请人上级领导',
                        children: []
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    id: 'id'
                }
            }
        },

        methods: {

            checkBoxData (data) {
                let index = this.otherList.findIndex ( f => f.id === data.id)
                if (index === -1) {
                    this.otherList.push (data)
                } else {
                    this.otherList.splice (index, 1)
                }
                this.$emit ('other', this.otherList)
            },

            updataOthersSelectData (data) {

            }
        },

        mounted () {

        },
    }
</script>

<style lang='scss' scoped>
    .others {
        width: 40%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #e4e4e4;
        border-radius: 5px;
        margin-bottom: 15px;
        height: 485px !important;
        overflow-x: hidden;
    }
</style>
