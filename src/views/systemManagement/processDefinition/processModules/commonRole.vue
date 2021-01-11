<template>
    <div class="common-role">
        <user-tree
            :data="data"
            ref="eleTree"
            :isfather="true"
            :defaultProps="defaultProps"
            @checkBoxData="checkBoxData"
        ></user-tree>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import userTree from '../../../../components/user-depart/userTree'
    export default {
        
        props: {
            role: {
                type: Array,
                default: () => []
            }
        },

        components: {
            userTree
        },

        data () {
            return {
                roleList: [],
                defaultProps: {
                    children: 'roleList',
                    label: 'name',
                    id: 'id'
                }
            }
        },

        methods: {

            checkBoxData (data) {
                if (data.roleList && data.roleList.length > 0) {
                    data.roleList.forEach(element => {
                        this.filtrateData (element)
                    });
                } else {
                    this.filtrateData (data)
                }
            },

            filtrateData (data) {
                let index = this.roleList.findIndex ( f => f.id === data.id)
                if (index === -1) {
                    this.roleList.push (data)
                } else {
                    this.roleList.splice (index, 1)
                }
                this.$emit ('role', this.roleList)
            },

            defaultSelectData (data) {
                let item = {}
                data.forEach (res => {
                    this.data.forEach (item => {
                        if (item.roleList && item.roleList.length > 0) {
                            item = item.roleList.find ( f => f.id === res)
                            if (item) {
                                this.roleList.push (item)
                                this.$refs.eleTree.updataCheckboxState (item, true)
                            }
                        }
                    })
                    
                })
                this.$emit ('role', this.roleList, true)
            },

            updataCommonRoleSelectData (data) {
                this.$refs.eleTree.updataCheckboxState (data, false)
                this.roleList.splice (this.roleList.findIndex (f => f.id === data.id))
                this.$emit ('role', this.roleList)
            }
        },

        mounted () {
            if (this.role && this.role.length > 0) {
                this.defaultSelectData (this.role)
            }
        },

        computed: {
            ...mapState('d2admin/allRole', [
                'data'
            ])
        }
    }
</script>

<style lang='scss' scoped>
    .common-role {
        width: 40%;
        padding: 10px;
        margin-top: 55px;
        border: 1px solid #e4e4e4;
        border-radius: 5px;
        margin-bottom: 15px;
        height: 435px !important;
        overflow-x: hidden;
    }
</style>
