<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" append-to-body :before-close="closeFun">
        <div class="user-box">
            <div class="content-input" v-if="isShowInput">
                <el-row>
                    <el-form :model="userModules" :rules="rules" ref="ruleForm" label-width="90px" >
                        <el-form-item :label="formLabel" prop="name">
                            <el-input v-model="userModules.name"></el-input>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div class="content-tab">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="部门" name="first"></el-tab-pane>
                    <el-tab-pane label="角色" name="second" v-if="isShowRole"></el-tab-pane>
                    <el-tab-pane label="项目角色" name="third" v-if="isShowOther"></el-tab-pane>
                    <el-tab-pane label="其他" name="four" v-if="isShowOther"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="left-select-frame">
                <department-user v-if="dialogVisible" v-show="activeName === 'first'" :isShowInput="isShowInput" ref="departmentUser" :userIds="userIds" :department="department" :startCrew="startCrew" @departmentUser="getDepartmentUser"/>
                <commonRole v-show="activeName === 'second'" ref="commonRole" :role="role" @role="getroleList"/>
                <projectRoles v-show="activeName === 'third'" ref="projectRoles" :projectRoles="projectRoles"  @projectRoles="getProjectRoles" />
                <others v-show="activeName === 'four'" ref="others" :other="other"  @other="getOthers" />
            </div>
            <div class="content-button">
                <el-button type="primary" icon="el-icon-d-arrow-right" class="addData" @click="concordanceData"></el-button>
                <el-button type="primary" icon="el-icon-d-arrow-left" class="removeData" @click="removeData"></el-button>
            </div>
            <div class="right-show-frame" :class="{'show-frame': isShowInput}">
                <el-checkbox v-for="child in showList" :key="child.id" @change="getRightSelectData(child)">{{ child.name }}</el-checkbox>
            </div>
            <el-row class="button">
                <el-button type="primary" @click="clearUserPage()">确定</el-button>
                <el-button @click="closeFun()">关闭</el-button>
            </el-row>
        </div>
    </el-dialog>
</template>

<script>
    import departmentUser from './departmentUser'
    import projectRoles from './projectRoles'
    import commonRole from './commonRole'
    import others from './others'
    export default {
        name: 'userModules',
        components: { departmentUser, commonRole, projectRoles, others },
        props: {
            userIds: {
                type: Array,
                default: () => []
            },
            department: {
                type: Array,
                default: () => []
            },
            startCrew: {
                type: Array,
                default: () => []
            },
            role: {
                type: Array,
                default: () => []
            },
            other: {
                type: Array,
                default: () => []
            },
            isShowRole: {
                type: Boolean,
                default: () => true
            },
            isShowOther: {
                type: Boolean,
                default: () => false
            },
            isShowInput: {
                type: Boolean,
                default: () => false
            },
            title: {
                type: String,
                default: () => '选择部门、人员或角色'
            },
            formLabel: {
                type: String,
                default: () => '任务名称'
            },
            showDialog: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                dialogVisible: false,
                activeName: 'first',
                showList: [],
                roleList: [],
                otherList: [],
                removeList: [],
                projectRoles: [],
                departmentUserList: [],
                userModules: {
                    name: ''
                },
                rules: {
                    name: [
                        { required: true, message: `${this.formLabel}不能为空`, trigger: 'blur' }
                    ]
                }
            }
        },

        methods: {

            handleClick (tab) {
                this.activeName = tab.name
            },

            closeFun () {
                this.$emit('closeFun')
            },

            clearUserPage () {
                if (this.isShowInput) {
                    this.$refs.ruleForm.validate (valid => {
                        if (valid) this.$emit('clearUserPage', this.showList, this.userModules)
                    })
                } else {
                    this.$emit('clearUserPage', this.showList)
                }
            },

            getRightSelectData (data) {
                let index = this.removeList.findIndex (f => f.id === data.id)
                if (index === -1) {
                    this.removeList.push (data)
                } else {
                    this.removeList.splice (index, 1)
                }
            },

            removeData () {
                this.removeList.forEach (res => {
                    if (res.id.indexOf ('U') !== -1) {
                        this.$refs.departmentUser.updataSelectData (res, 'parentId')
                    } else if (res.id.indexOf ('D') !== -1) {
                        this.$refs.departmentUser.updataSelectData (res, 'id')
                    } else if (res.id.indexOf ('R') !== -1) {
                        this.$refs.commonRole.updataCommonRoleSelectData (res)
                    } else if (res.id.indexOf ('O') !== -1) {
                        this.$refs.commonRole.updataCommonRoleSelectData (res)
                    }
                    this.showList.splice(this.showList.findIndex(item => item.id === res.id), 1)
                })
                this.removeList = []
            },

            getDepartmentUser (data, isConcordance = false) {
                this.departmentUserList = data
                if (isConcordance) {
                    this.concordanceData ()
                }
            },

            getroleList (data, isConcordance = false) {
                this.roleList = data
                if (isConcordance) {
                    this.concordanceData ()
                }
            },

            getOthers (data, isConcordance = false) {
                this.otherList = data
                if (isConcordance) {
                    this.concordanceData ()
                }
            },

            getProjectRoles () {
                this.projectRoles = data
                if (isConcordance) {
                    this.concordanceData ()
                }
            },

            getSelectUser () {
                return this.$refs.departmentUser.getSelectUser ()
            },

            concordanceData () {
                this.showList = [...this.departmentUserList, ...this.roleList, ...this.otherList, ...this.projectRoles]
            }
        },
        watch: {
            showDialog(newVal) {
                if(!newVal) {
                    this.showList = []
                    this.removeData()
                }
                this.dialogVisible = newVal
            }
        }
    }
</script>

<style lang="scss" scoped>
    .user-box {
        .left-select-frame {
            padding: 10px;
        }
        .content-tab {
            padding: 10px 10px 0;
            margin: 0 0 -10px;
        }
        .addData {
            position: fixed;
            top: calc(50% - 38px);
            left: calc(50% - 55px);
        }
        .removeData {
            position: fixed;
            top: calc(50% - -24px);
            left: calc(50% - 65px);
        }
        .right-show-frame {
            border: 1px solid #e4e4e4;
            border-radius: 5px;
            height: 68%;
            position: absolute;
            width: 45%;
            right: 30px;
            top: 140px;
            padding: 10px;
        }

        .show-frame {
            height: 61% !important;
            top: 228px !important;
        }

        .button{
            text-align: right;
            padding-right: 40px;
        }

        .el-button {
            border-radius: 2px;
            padding: 8px 12px;
        }
        .el-button--primary {
            background-color: $color-button-dialog-affirm;
        }

        .content-input {
            padding: 25px 0 0;
            .el-row {
                background: linear-gradient(white, white) padding-box, repeating-linear-gradient(-45deg, #dddddd 0, #dddddd 0.4em, white 0, white 0.7em)
            }
        }

        .frame {
            height: 196px !important;
        }
    }
</style>
