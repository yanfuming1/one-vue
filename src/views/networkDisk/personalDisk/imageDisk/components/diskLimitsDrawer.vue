<template>
  <div>
    <el-drawer
        title="权限设置"
        size="25%"
        :visible.sync="showDrawer"
        :direction="direction"
        :before-close="handleClose">
        <div class="limits-content">
            <div v-if="limitsList.length > 0">
                <el-form ref="form" :model="formData" label-width="100px">
                <div class="limits-item" v-for="(item, index) in limitsList">
                    <el-row><el-col :span="24" style="text-align:right;">
                            <el-button icon="el-icon-close" size="mini" @click="handleDelete(index, item)" circle></el-button>
                    </el-col></el-row>
                    <el-row><el-col :span="20" :offset="2">
                        <el-form-item label="选择人员：">
                            <el-input v-model="item.pernames" placeholder="+请选择员工，默认全部部门" @click.native="choseUser(index)" disabled size="small"></el-input>
                        </el-form-item>
                    </el-col></el-row>
                    <el-row><el-col :span="20" :offset="2">
                        <el-form-item label="权限类型：">
                            <el-radio-group v-model="item.permission">
                                <el-radio :label="1">添加</el-radio>
                                <el-radio :label="2">删除</el-radio>
                                <el-radio :label="3">修改</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col></el-row>
                </div>
                </el-form>
            </div>
            <div v-else>
                <p class="no-limits">未查询到数据</p>
            </div>
            <div class="limits-new-btn">
                <el-button type="primary" size="mini" @click="newLimits">新增权限组</el-button>
            </div>
        </div>
        <div class="limits-btn">
            <el-button type="primary" size="mini" @click="savePermission">保 存</el-button>
            <el-button type="warning" size="mini" @click="resetPermission">重 置</el-button>
            <el-button size="mini" @click="handleClose">取消</el-button>
        </div>
    </el-drawer>
    <user-depart-modules @closeModule="closeModule" @getChoseData="getChoseData" :showUserModule="showUserModule" :namesList="namesList" :user="user" :department="department"></user-depart-modules>
  </div>
</template>
<script>
import { getPerListByFileId } from '../../../../../api/disk/personalImage'
import userDepartModules from '../../../../../components/user-depart/UserDepartModules'
import util from '../../../../../libs/util'
export default {
    props: {
        showDrawer: {
            type: Boolean,
            default: false
        },
        permissionList: {
            type: Array,
            default() {
                return []
            }
        },
        rowItem: {
            type: Object,
            default: {}
        }
    },
    components: {
        "user-depart-modules" : userDepartModules
    },
    data() {
        return {
            direction: 'rtl',
            limitsList: [
                {
                    perids: '',
                    pernames: '',
                    permission: ''
                }
            ],
            formData: {},
            dialogVisible: false,
            showUserModule: false,
            choseIndex: 0,
            user: [],
            department: [],
            namesList: [],
        }
    },
    methods: {
        handleClose () {
            this.$emit("closeDrawer")
        },
        handleCloseDialog () {
            this.dialogVisible = false
        },
        newLimits () {
            let newItem = {
                perids: this.perids,
                pernames: this.pernames,
                permission: this.limitsList
            }
            this.limitsList.push(newItem)
        },
        // 选择人员
        choseUser (index) {
            this.choseIndex = index
            this.showUserModule = true
            // console.log(this.limitsList[index])
            this.user = []
            this.department = []
            let arr = this.limitsList[index].personid === '' ? [] : this.limitsList[index].personid.split(',')
            let nameArr = this.limitsList[index].pernames === '' ? [] : this.limitsList[index].pernames.split(',')
            this.namesList = []
            arr.forEach((item, index) => {
                if (item.indexOf("U") !== -1) {
                    this.user.push(item)
                } else if (item.indexOf('D') !== -1) {
                    this.department.push(item)
                }
                let nameItem = {
                    id: item,
                    name: nameArr[index]
                }
                this.namesList.push(nameItem)
            })
        },

        // 选择后的回显
        getChoseData (data) {
            let ids = ''
            let names = ''
            data.forEach(item => {
                ids += item.id + ','
                names += item.name + ','
            })
            ids = ids.substring(0, ids.length - 1)
            names = names.substring(0, names.length - 1)
            this.limitsList[this.choseIndex].pernames = names 
            this.limitsList[this.choseIndex].personid = ids 
            this.showUserModule = false
        },

        // 设置数据
        setList (list) {
            this.limitsList = list
        },

        // 重置
        resetPermission () {
            getPerListByFileId({resid: this.rowItem.id}).then(res => {
                this.limitsList = res
            })
        },

        // 关闭选择用户
        closeModule () {
            this.showUserModule = false
        },

        // 保存
        savePermission () {
            this.$emit('permissionAdd', this.limitsList)
        },

        // 删除
        handleDelete (index, item) {
            this.limitsList.splice(index, 1)
        }
    },
    mounted () {
        this.limitsList.forEach(item => {
            item.permission = Number(item.permission)
        })
        this.limitsList = this.permissionList
    },
    watch: {
        permissionList: {
            deep: true,
            immediate: true,
            handler: function (newVal) {
                newVal.forEach(item => {
                    item.permission = Number(item.permission)
                })
                this.limitsList = newVal
            }
        }
    }

}
</script>
<style lang="scss">
.el-drawer__body{
    height: 100%;
    .limits-content{
        padding: 0px 20px;
        height: calc(100% - 100px);
        overflow-y: scroll;
        .no-limits{
            text-align:center;
            color:#999;
            margin:50px 0px;
            font-size:15px;
        }
        .limits-item{
            padding-top: 22px;
            border-bottom: 1px solid #409EFF;
            .el-form-item{
                margin-bottom: 10px;
            }
        }
        .limits-new-btn{
            margin-top: 30px;
            margin-bottom: 20px;
            text-align: center;
        }
    }
    .limits-btn{
        text-align: center;
        padding: 20px 0px;
        position: absolute;
        width: 100%;
        bottom: 32px;
        left: 0px;
    }
}
</style>