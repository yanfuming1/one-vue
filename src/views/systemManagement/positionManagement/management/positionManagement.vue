 <template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="search" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="search = ''">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group >
                        <el-button size="mini" icon="el-icon-plus" @click="expandAll">展开</el-button>
                        <el-button size="mini" icon="el-icon-minus" @click="closeAll">收起</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full-center___left">
            <qqt-tree
                :title="title"
                :data="data"
                :btnTitle="btnTitle"
                :filterText="search"
                :identifying="identifying"
                :defaultExpandAll="defaultExpandAll"
                :defaultCheckedKeys="defaultCheckedKeys"
                :defaultShowBtn="true"
                :defaultProps="defaultProps"
                :defaultObject="defaultObject"
                :isShowUpdate="isShowUpdate"
                :isShowAdd="isShowAdd"
                :isShowDel="isShowDel"
                @edit="editPositionManagement"
                @delete="deletePositionManagement" @historicalData="getHistoricalData"></qqt-tree>
        </div>
        <div class="qqt-container-full-center___right">
            <position-management-details :data="historicalData" :btnHeader="btnHeader" :options="data" :isShowDetails="isShowDetails" @refresList="refresTreeList"></position-management-details>
        </div>
    </d2-container>
 </template>
<script>
import { qqtTree } from '../../../../components/qqt-subassembly'
import positionManagementDetails from './positionManagementDetails'
import { getPositionManagementTree, getPositionManagementStaff, deletePositionManagementTree } from '../../../../api/system/positionManagement'
export default {
    name: 'positionManagement',
    data () {
        return {
            search: '',
            title: '职务(岗位)名称及层级',
            data: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            defaultObject: {
                id: '',
                name: '新建职务(岗位)',
                isEditor: true,
                parentId: '',
                isNewNode: true,
                rank: 0,
                isUse: '1',
                superiorName: '',
                superiorId: [],
                children: []
            },
            isShowAdd: true,
            isShowUpdate: true,
            isShowDel: true,
            isShowDetails: true,
            identifying: 'positionManagement',
            historicalData: null,
            defaultCheckedKeys: [],
            defaultExpandAll: {
                isExpandAll: false
            },
            btnTitle: {
                name: '新建职务(岗位)',
                btnHeader: '职务(岗位)详情'
            },
            btnHeader: '职务(岗位)详情'
        }
    },

    components: {
        'qqt-tree': qqtTree,
        'position-management-details': positionManagementDetails
    },

    methods: {

        getPositionManagementTreeList () {
            getPositionManagementTree().then(res => {
                if (res) {
                    this.data = res
                }
            })
        },

        getHistoricalData (item, boolean = false) {
            this.historicalData = item
            if (boolean) {
                this.btnHeader = '新建职务(岗位)'
            } else {
                this.btnHeader = '职务(岗位)详情'
            }
        },

        refresTreeList (item) {
            this.isShowDetails = true
            this.getPositionManagementTreeList()
        },

        deletePositionManagement (data) {
            deletePositionManagementTree({'id': data.id}).then(result => {
                if (result.code === 200) {
                    this.$message.success('删除成功')
                    this.getPositionManagementTreeList()
                }
            })
            .catch(err => {
                console.log(err)
            })
        },

        editPositionManagement () {
            this.isShowDetails = false
        },

        expandAll () {
            let item = {
                isExpandAll: true
            }
            this.defaultExpandAll = JSON.parse (JSON.stringify (item))
        },

        closeAll () {
            let item = {
                isExpandAll: false
            }
            this.defaultExpandAll = JSON.parse (JSON.stringify (item))
        },

        setBtnPromission() {
            this.isShowAdd = this.$has('sys:position:add')
            this.isShowUpdate = this.$has('sys:position:edit')
            this.isShowDel = this.$has('sys:position:del')
            this.btnTitle = this.$has('sys:position:add') ? {name: '新建职务(岗位)', btnHeader: '职务(岗位)详情'} : null
        }
    },

    created () {
        this.setBtnPromission()
        this.getPositionManagementTreeList()
    }
}
</script>
<style scoped lang="scss">
.position-management {
    .position-management-header {
        height: 45px;
        line-height: 47px;
        .position-management-header___search {
            .el-input {
                width: 10%;
                padding-right: 10px;
                top: -1px;
            }
        }
        .position-management-header___tree{
            padding-left:15px;
            .el-button-group button {
                color: $color-button-typeface1;
            }
        }
        .position-management-header___operation {
            padding-left: 20px;
        }
        .position-management-header___replacement {
            padding-left: 20px;
            .el-button {
                background: $color-button-reset !important;
            }
        }
    }
    .position-management-center {
        height: 102%;
        margin-top: -15px;
        .position-management-center___left {
            box-shadow: 0 2px 12px 0 $color-border-shadow;
            width: 20%;
            height: 100%;
            min-height: 720px;
            display: inline-block;
            background: $color-bg3;
        }
        .position-management-center___right {
            box-shadow: 0 2px 12px 0 $color-border-shadow;
            margin-left: 20px;
            width: 78%;
            float: right;
            height: 100%;
            min-height: 720px;
            background: $color-bg3;
        }
    }
}
</style>
