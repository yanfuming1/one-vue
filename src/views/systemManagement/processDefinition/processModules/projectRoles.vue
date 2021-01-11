<template>
    <div class="project-roles">
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
    import userTree from '../../../../components/user-depart/userTree'
    import { getProjectRoleList } from '../../../../api/projectRoleSettings'
    export default {
        
        props: {
            projectRoles: {
                type: Array,
                default: () => []
            }
        },

        components: {
            userTree
        },

        data () {
            return {
                data: [],
                roles: [],
                defaultProps: {
                    label: 'name',
                    id: 'id'
                }
            }
        },

        methods: {

            checkBoxData (data) {
                if (data && data.length > 0) {
                    data.forEach(element => {
                        this.filtrateData (element)
                    });
                } else {
                    this.filtrateData (data)
                }
            },

            filtrateData (data) {
                let index = this.roles.findIndex ( f => f.id === data.id)
                if (index === -1) {
                    this.roles.push (data)
                } else {
                    this.roles.splice (index, 1)
                }
                this.$emit ('projectRoles', this.roles)
            },

            defaultSelectData (data) {
                let element = {}
                data.forEach (res => {
                    this.data.forEach (item => {
                        if (item && item.length > 0) {
                            element = item.find ( f => f.id === res)
                            if (element) {
                                this.roles.push (element)
                                this.$refs.eleTree.updataCheckboxState (element, true)
                            }
                        }
                    })
                    
                })
                this.$emit ('projectRoles', this.roles, true)
            },

            updataProjectRolesSelectData (data) {
                this.$refs.eleTree.updataCheckboxState (data, false)
                this.roles.splice (this.roles.findIndex (f => f.id === data.id))
                this.$emit ('projectRoles', this.roles)
            },

            getAllProjectRoleList () {
                getProjectRoleList ().then (res => {
                    if (res && res.length > 0) this.data = res
                })
            }
        },

        mounted () {
            if (this.projectRoles && this.projectRoles.length > 0) {
                this.defaultSelectData (this.projectRoles)
            }
        },

        created () {
            this.getAllProjectRoleList ()
        }
    }
</script>

<style lang='scss' scoped>
    .project-roles {
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
