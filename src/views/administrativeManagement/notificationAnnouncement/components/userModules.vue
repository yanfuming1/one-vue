<template>
    <div class="notificationAnnouncementInfo">
        <div class="head">
            <span>选择审批人员</span>
        </div>
        <div class="content-tab">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="部门" name="first"></el-tab-pane>
              <el-tab-pane label="普通角色" name="second"></el-tab-pane>
              <el-tab-pane label="项目角色" name="third"></el-tab-pane>
              <el-tab-pane label="其他" name="fourth"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="left-select-frame">
            <div class="frame">
                <user-tree
                  :data="data"
                  ref="eleTree"
                  :defaultProps="defaultProps"
                  :fatherCheckList="fatherCheckList"
                  @checkBoxData="checkBoxData"
                  @userClickData="getSonDataAndNotSelected"
                ></user-tree>
            </div>
            <div class="frame">
                <user-tree
                  :data="user.data"
                  :fatherData="fatherData"
                  :defaultProps="user.defaultProps"
                  :childrenCheckList="childrenCheckList"
                  @checkBoxData="checkBoxData"
                  ref="sonTree"
                ></user-tree>
            </div>
        </div>
        <div class="content-button">
            <el-button type="primary" icon="el-icon-d-arrow-right" class="addData" @click="addData"></el-button>
            <el-button type="primary" icon="el-icon-d-arrow-left" class="removeData" @click="removeData"></el-button>
        </div>
        <div class="right-show-frame">
            <el-checkbox v-for="child in showList" :key="child.id" @change="getRightSelectData(child)">{{ child.name }}</el-checkbox>
        </div>
        <el-row class="button">
            <el-button type="primary" @click="clearUserPage()">确定</el-button>
            <el-button @click="clearUserPage()">关闭</el-button>
        </el-row>
    </div>
</template>

<script>
import userTree from '../../../../components/user-depart/userTree'
import { GetDepartTree } from '../../../../api/system/depart/depart-tree'
import { getDepIdByUserId } from '../../../../api/system/workflow'
import { mapState } from 'vuex'
export default {
    name: 'userModules',
    components: { userTree },
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
        }
    },
    data () {
        return {
            activeName: 'first',
            currentClickData: '',
            userList: [],
            sonCheckBoxDataList: [],
            childrenCheckList: [],
            fatherCheckList: [],
            fatherCheckBoxDataList: [],
            fatherData: [],
            showList: [],
            removeDataList: [],
            fatherHistoryData: [],
            sign: '',
            user: {
              data: [],
              defaultProps: {
                children: 'child',
                label: 'name'
              }
            },
            data: [],
            defaultProps: {
              children: 'child',
              label: 'name'
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
            this.$emit('clearUserPage', this.showList)
        },

        // 获取父复选框中的数据
        getFatherCheckBoxDataList (data) {
            if (this.fatherCheckBoxDataList.indexOf(data) === -1) {
                this.fatherCheckBoxDataList.push(data)
            }
        },

        addData () {
            let checkData = [];
            let treeData = [];
            let leftUserData = [];
            // 树形选中新增
            treeData = JSON.parse(JSON.stringify(this.$refs.eleTree.data));
            // leftUserData = JSON.parse(JSON.stringify(this.user.data))
            // 获取选中树形节点
            checkData = this.$refs.eleTree.$refs.tree.getCheckedNodes();

            if (checkData.length > treeData[0].child.length) {
                this.showList = [];
                treeData[0].isCheck = false;
                this.showList.push(treeData[0]);
            } else {
                this.showList = checkData;
            }

            this.sonCheckBoxDataList.forEach (res => {
                if (this.showList.findIndex (r => r.id === res.id) === -1) {
                    leftUserData.push.apply(leftUserData, res.item)
                }
            })

            let newShowListData = [];
            let sonTrueLength = 0;
            leftUserData.forEach(res => {
                if (res.isCheck) {
                   sonTrueLength++ 
                }
            });
            if (sonTrueLength !== leftUserData.length) {
                leftUserData.forEach(res => {
                    if (res.isCheck) {
                        this.showList.push(res);
                    }
                });
            } else {
                leftUserData.forEach(res => {
                    if (res.isCheck) {
                        this.showList.forEach((ele,index) => {
                            if (ele.parentId !== res.parentId) {
                                newShowListData.push(ele)
                                
                            }
                            if (this.showList.length === index) {
                                this.showList = newShowListData;
                            }
                        });
                    }
                })
            }
        },

        // 删除数据并更新左侧列表选中的状态
        removeData () {
            let data = []
            let newData = [];
            let sonNewData = [];
            sonNewData = JSON.parse(JSON.stringify(this.sonCheckBoxDataList));
            data = JSON.parse(JSON.stringify(this.showList));
            this.showList.forEach(item => {
                if (item.isCheck === false) {
                    if (item.id.indexOf("D_") !== -1) {
                        sonNewData.forEach(element => {
                            element.item.forEach(sonItem => {
                                if (sonItem.parentId === item.id && this.currentClickData.id === sonItem.parentId) {
                                    this.$refs.sonTree.updataCheckboxState(sonItem, false);
                                }
                            });
                        });
                        this.$refs.eleTree.updataCheckboxState(item, false);
                    } else {
                        if ( this.currentClickData.id === item.parentId)  {
                            this.$refs.sonTree.updataCheckboxState(item, false);
                        }
                    }
                }
            });
            data.forEach(item => {
                if (item.isCheck) {
                    newData.push(item)
                }
            });
            this.showList = newData;
            
        },
        // 获取右侧要删除的数据
        getRightSelectData (data) {
            data['isCheck'] = !data['isCheck']
            this.sonCheckBoxDataList.forEach(res => {
                if (res.id === data.id) {
                    if (res.item && res.item.length > 0) {
                        res.item.forEach(item => {
                            item['isCheck'] = data['isCheck']
                        })
                    }
                }
                if (data.id.indexOf ('U_') !== -1) {
                    if (res.item && res.item.length > 0) {
                        res.item.forEach(item => {
                            if (item.id === data.id && res.id === item.parentId) {
                                item['isCheck'] = data['isCheck']
                            }
                        })
                    }
                }
            })
        },

        getDepartTreeList () {
            GetDepartTree().then(res => {
                if (res) {
                    this.addIsCheckStatus([res])
                    this.data.push(res)
                    setTimeout(() => {
                        this.selectEchoData ()
                    }, 300);
                }
            })
        },

        // 迭代添加状态
        addIsCheckStatus (item) {
            item.forEach(res => {
                res['isCheck'] = false
                res['user'] = null
                if (this.department && this.department.length > 0) {
                    this.department.forEach(element => {
                        if (element === res.id) {
                            res['isCheck'] = true
                            const index = this.showList.findIndex(i => i.id === res.id)
                            if (index === -1) {
                                this.showList.push(res)
                            }
                            this.fatherCheckBoxDataList.push(res)
                            this.fatherHistoryData.push(res)
                        }
                    })
                }
                if (res[this.defaultProps.children] && res[this.defaultProps.children].length > 0) {
                    this.addIsCheckStatus(res[this.defaultProps.children])
                }
            })
        },

        checkBoxData (event) {
            if (event.id.indexOf('U_') !== -1) {
                this.baseSonUpdataFather(event)
            } else if (event.id.indexOf('D_') !== -1) {
                event['isCheck'] = !event['isCheck']
                this.currentClickData = event
                this.getDepIdByUserIdList(event, event['isCheck'])
                this.getFatherCheckBoxDataList(event)
            }
        },

        getDepIdByUserIdList (event, defualtCheck) {
            this.$store.commit ('d2admin/loading/noAllowShow')
            getDepIdByUserId({'depIds': event.id}).then(res => {
                
                if (res) {
                    this.childrenCheckList = []
                    res.forEach(element => {
                        element['isCheck'] = defualtCheck
                        element['parentId'] = event.id
                        if (defualtCheck) {
                            this.childrenCheckList.push(element.id)
                        } else {
                            this.childrenCheckList = []
                        }
                    })
                    event['sonLength'] = res.length
                    this.user.data = res
                    event['user'] = {
                        id: event.id,
                        item: res
                    }
                    const index = this.sonCheckBoxDataList.findIndex(i => i.id === event.id)
                    if (index !== -1) {
                        this.sonCheckBoxDataList[index].item = res
                    } else {
                        this.sonCheckBoxDataList.push({
                            id: event.id,
                            item: res
                        })
                    }
                }
            })
        },

        baseSonUpdataFather (item) {
            item['isCheck'] = !item['isCheck']
            let sonLength = 0
            const index = this.fatherCheckBoxDataList.findIndex(i => i.id === item.parentId)
            
            const num = this.sonCheckBoxDataList.findIndex(i => i.id === item.parentId)
            this.sonCheckBoxDataList[num].item.forEach(res => {
                if (res.isCheck) {
                    sonLength ++
                }
            })
            
            if (!item['isCheck']) {
                this.fatherCheckBoxDataList[index]['isCheck'] = false
                this.$refs.eleTree.updataCheckboxState(this.fatherCheckBoxDataList[index], false)
            } else {
                if (this.user.data.length > sonLength) {
                    this.$refs.sonTree.updataCheckboxState(item, true)
                } else if (this.user.data.length = sonLength) {
                    // if (index !== -1) {
                    this.fatherCheckBoxDataList[index]['isCheck'] = true
                    this.$refs.eleTree.updataCheckboxState(this.fatherCheckBoxDataList[index], true)
                    // } else {
                    //     let father = this.data[0].child.find (res => res.id === item.parentId) 
                    //     this.getFatherCheckBoxDataList(father)
                    // }
                   
                }
            }            
        },

        getSonDataAndNotSelected (data) {
            this.currentClickData = data
            if (this.fatherCheckBoxDataList.indexOf(data) === -1) {
                this.fatherCheckBoxDataList.push(data)
            }
            if (data.user == null || data.user.item == null || data.user.item.length === 0) {
                this.getDepIdByUserIdList(data, data['isCheck'] ? data['isCheck'] : false, false)
                return
            }
            this.childrenCheckList = []
            this.user.data = data.user.item
            data.user.item.forEach(res => {
                
                if (data.isCheck) {
                    res['isCheck'] = true
                    this.childrenCheckList.push(res.id)
                } else {
                    if (res['isCheck']) {
                        this.childrenCheckList.push(res.id)
                    }
                }
            })
            
        },

        echoData () {
            this.showList = []
            let item = ''
            if (this.startCrew.length > 0) {
                this.startCrew.forEach(res => {
                    if (res.indexOf("U_") !== -1) {
                        item = this.allUser.find (r => r.id === res)
                        item['isCheck'] = true
                        this.showList.push(item)
                    }
                })
            }
        },

        selectEchoData () {
            this.department.forEach(res => {
                this.$refs.eleTree.updataCheckboxState(res, true)
            })
        }
    },

    created () {
        this.echoData ()
        this.getDepartTreeList ()
    },
    
    watch: {
        startCrew () {
            this.echoData ()
        }
    },

    computed: {
        ...mapState('d2admin/allUser', [
            'allUser',
            'depart'
        ])
    }
    
}
</script>

<style lang="scss">
.notificationAnnouncementInfo {
    position: fixed;
    width: 900px;
    height: 700px;
    left: calc(50% - 450px);
    top: calc(50% - 350px);
    box-shadow: 1px 1px 11px #bfbfbf;
    border-radius:5px;
    background: #ffffff;
    z-index:9102;
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
        .frame {
            width: 40%;
            padding: 10px;
            border: 1px solid #e4e4e4;
            border-radius: 5px;
            margin-bottom: 15px;
            height: 230px;
            overflow-x: hidden;
            .el-tree {
                height: 160px;
                overflow-y: auto;
                margin-top: 5px;
            }
        }
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
</style>
