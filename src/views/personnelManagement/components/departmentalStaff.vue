<template>
    <div>
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
</template>

<script>

    import { GetDepartTree } from '../../../api/system/depart/depart-tree'
    import { getDepIdByUserId } from '../../../api/system/workflow'
    import { mapState } from 'vuex'

    import userTree from '../../../components/user-depart/userTree'
    export default {
        
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
        
        components: {
            userTree
        },

        data () {
            return {
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
                let item = {}
                // 树形选中新增
                treeData = this.$refs.eleTree.data;

                // treeData = JSON.parse(JSON.stringify(this.$refs.eleTree.data));
                // 获取选中树形节点
                checkData = this.$refs.eleTree.$refs.tree.getCheckedNodes();

                item = checkData.find (f => f.parentId === '0')
                if (item) {
                    this.showList = [];
                    this.showList.push(treeData[0]);
                    this.$emit ('departmentUser', this.showList)
                    return
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
                    })
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
                this.$emit ('departmentUser', this.showList)
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
                        this.addIsCheckStatus([res], false)
                        this.data.push(res)
                        setTimeout(() => {
                            this.selectEchoData ()
                        }, 300);
                    }
                })
            },

            // 迭代添加状态
            addIsCheckStatus (item, isCheck) {
                item.forEach(res => {
                    res['isCheck'] = isCheck
                    res['user'] = null
                    if (this.department && this.department.length > 0) {
                        this.department.forEach(element => {
                            if (element === res.id) {
                                res['isCheck'] = isCheck = true
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
                        this.addIsCheckStatus(res[this.defaultProps.children], isCheck)
                    }
                })
            },

            checkBoxData (event) {
                if (event.id.indexOf('U_') !== -1) {
                    this.baseSonUpdataFather(event)
                } else if (event.id.indexOf('D_') !== -1) {
                    event['isCheck'] = !event['isCheck']
                    this.currentClickData = event
                    this.neatenData (event, event['isCheck'])
                    this.getDepIdByUserIdList(event, event['isCheck'])
                    this.getFatherCheckBoxDataList(event)
                }
                this.addData ()
            },

            // 整理数据
            neatenData (data, isCheck) {
                data.child.forEach (res => {
                    res['isCheck'] = isCheck
                    this.$refs.eleTree.updataCheckboxState(res, isCheck)
                })
                if (!isCheck) {
                    this.sailUpstreamIteration (this.data, data)
                }
            },

            sailUpstreamIteration (list, data) {
                let item = list.find (f => f.id === data.parentId)
                if (item) {
                    item['isCheck'] = false
                    if (item.parentId !== '0') {
                        this.sailUpstreamIteration (this.data, item)
                    }
                } else {
                    if (list[this.defaultProps.children] && list[this.defaultProps.children].length > 0) {
                        this.sailUpstreamIteration(list[this.defaultProps.children], data)
                    }
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
                        this.fatherCheckBoxDataList[index]['isCheck'] = true
                        this.$refs.eleTree.updataCheckboxState(this.fatherCheckBoxDataList[index], true)
                    }
                }
            },

            getSonDataAndNotSelected (data) {
                this.currentClickData = data
                if (this.fatherCheckBoxDataList.indexOf(data) === -1) {
                    this.fatherCheckBoxDataList.push(data)
                }
                if (data.user == null || data.user.item == null || data.user.item.length === 0 || data['isCheck']) {
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
                    if (this.$refs && this.$refs.eleTree) {
                        this.$refs.eleTree.updataCheckboxState(res, true)
                    }
                })
                this.$emit ('departmentUser', this.showList, true)
            },

            updataSonSelectData (data) {
                this.sonCheckBoxDataList.forEach (res => {
                    if (res.id === data.id) {
                        res['isCheck'] = false
                    }
                })

                this.showList.splice(this.showList.findIndex(item => item.id === data.id), 1)
                this.$emit ('departmentUser', this.showList)
            },

            updataFatherSelectData (data) {
                let element = null
                this.data.forEach ((res, num) => {
                    if (res.id === data.id) {
                        element = res
                        res['isCheck'] = data['isCheck']  = false
                        this.$refs.eleTree.updataCheckboxState(data, false)
                    }
                })
                if (element && element.child && element.child.length > 0) {
                    this.neatenData (element, false)
                }
                this.showList.splice(this.showList.findIndex(item => item.id === data.id), 1)
                this.$emit ('departmentUser', this.showList)
            }

        },

        created () {
            // this.echoData ()
            this.getDepartTreeList ()
        },

        watch: {
            startCrew () {
                // this.echoData ()
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

<style lang='scss' scoped>
    .frame {
        width: 50%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #e4e4e4;
        border-radius: 5px;
        margin-bottom: 15px;
        height: 235px !important;
        overflow-x: hidden;
        .el-tree {
            height: 160px;
            overflow-y: auto;
            margin-top: 5px;
        }
    }
</style>
