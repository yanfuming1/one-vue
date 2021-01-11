<template>
    <div class="bgcBox">
        <div class="user-box">
            <div class="head">
                <span>{{ title }}</span>
            </div>
            <div class="content-tab">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="选择人员" name="first"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="left-select-frame">
                <departmental-staff v-show="activeName === 'first'" ref="departmentUser" :userIds="userIds" :department="department" :startCrew="startCrew" @departmentUser="getDepartmentUser"/>
      
            </div>
            <div class="content-button">
                <el-button type="primary" icon="el-icon-d-arrow-right" class="addData" @click="concordanceData"></el-button>
                <el-button type="primary" icon="el-icon-d-arrow-left" class="removeData" @click="removeData"></el-button>
            </div>
            <div class="right-show-frame">
                <el-checkbox v-for="child in showList" :key="child.id" @change="getRightSelectData(child)">{{ child.name }}</el-checkbox>
            </div>
            <el-row class="button">
                <el-button type="primary" @click="confirmationPersonnel()">确定</el-button>
                <el-button @click="closeFun()">关闭</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
    // import departmentUser from '../../systemManagement/processDefinition/processModules/departmentUser'
    import departmentalStaff from './departmentalStaff'
    // import commonRole from './commonRole'
    // import others from './others'
    export default {
        name: 'userModules',
        components: { departmentalStaff },
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
            isShowOther: {
                type: Boolean,
                default: () => false
            },
            title: {
                type: String,
                default: () => '选择部门物品接收人员'
            }
        },

        data () {
            return {
                activeName: 'first',
                showList: [],
                roleList: [],
                otherList: [],
                removeList: [],
                departmentUserList: []
            }
        },

        methods: {

            handleClick (tab) {
                this.activeName = tab.name
            },

            closeFun () {
                this.$emit('closeFun')
            },

            confirmationPersonnel () {
                this.$emit('confirmationPersonnel', this.showList)
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
                        this.$refs.departmentUser.updataSonSelectData (res)
                    } else if (res.id.indexOf ('D') !== -1) {
                        this.$refs.departmentUser.updataFatherSelectData (res)
                    } else if (res.id.indexOf ('R') !== -1) {
                        this.$refs.commonRole.updataCommonRoleSelectData (res)
                    } else if (res.id.indexOf ('O') !== -1) {
                        this.$refs.commonRole.updataCommonRoleSelectData (res)
                    }
                    this.showList.splice(this.showList.findIndex(item => item.id === res.id), 1)
                })
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

            concordanceData () {
                this.showList = [...this.departmentUserList, ...this.roleList, ...this.otherList]
            }
        }
    }
</script>

<style lang="scss" scoped>
.bgcBox {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9021;
    background-color: rgba(0,0,0,0.3);
    .user-box {
        position: fixed;
        width: 900px;
        height: 700px;
        left: calc(50% - 450px);
        top: calc(50% - 350px);
        box-shadow: 1px 1px 11px #bfbfbf;
        border-radius:5px;
        background: #ffffff;
        .head {
            padding: 0 10px;
            background: #f5f5f5;
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #e4e4e4;
            color: #000000;
        }
        .left-select-frame {
            padding: 10px;
        }
        .content-tab {
            padding: 10px 25px 0;
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
            height: 69%;
            position: absolute;
            width: 45%;
            right: 11px;
            top: 111px;
            padding: 10px;
        }

        .button{
            text-align: right;
            padding-right: 40px;
            padding-top: 15px;
        }

        .el-button {
            border-radius: 2px;
            padding: 8px 12px;
        }
        .el-button--primary {
            background-color: $color-button-dialog-affirm;
        }
    }
}
</style>
