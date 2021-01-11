<template>
    <div class="qqt-tree">
        <div class="qqt-tree-title" v-if="isShowHeader">
            <i class="qqt-tree-title___line"></i>
            <p>{{ title }}</p>
        </div>
        <div class="qqt-tree-option">
            <div class="qqt-tree-option-button">
                <el-button type="primary" v-if="btnTitle && isBtnTitle" :icon="btnTitle.icon" @click="append(data, true)">{{ btnTitle.name }}</el-button>
                <!-- 角色权限设置页面 -->
                <div class="qqt-tree-role-btn" v-if="rolePage">
                    <el-button type="primary" icon="el-icon-folder-add" @click="appendGroup">新建角色分组</el-button>
                    <el-button type="primary" icon="el-icon-user" @click="appendRole">新建角色</el-button>
                </div>
                <div class="qqt-tree-role-btn" v-if="dic">
                    <el-button type="primary" icon="el-icon-folder-add" @click="appendDic">{{ button }}</el-button>
                </div>
            </div>
            <el-tree
                :data="data"
                :props="defaultProps"
                @node-click="handleNodeClick"
                @check="handleCheckChange"
                :default-expanded-keys="defaultExpandedId"
                :default-checked-keys="defaultCheckedId"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                :show-checkbox="isShowCheckbox"
                :class="{'onlyShowChildernCheck': isOnlyShowChildernCheck && isShowCheckbox}"
                ref="tree"
                node-key="id">
                <div class="custom-tree-node" @mouseover="hoverCustomTreeNode(data)" slot-scope="{ node, data}" @click>
                    <div class="custom-tree-node___name">
                        <span @click.stop="expand(data)" :title="node.label">{{ node.label }}</span>
                    </div>
                    <span class="el-ic-focus" :class="{'custom-tree-node-btn': defaultShowBtn}">
                        <i class="el-icon-view" v-if="rolePage && data.isUse" title="查看权限" @click.stop = "() => showRolePer(data)"></i>
                        <i class="el-icon-plus" v-if="isShowAdd && data.property !== '1'" @click.stop = "() => append(data, false)" title="添加" ></i>
                        <i class="el-icon-edit" title="修改" v-if="isShowUpdate" @click.stop = "() => edit(node, data)"></i>
                        <i class="el-icon-close" v-if="isShowDel" @click.stop = "() => remove(node, data)" title="删除"></i>
                    </span>
                </div>
            </el-tree>
        </div>
    </div>
</template>

<script>
    import util from '@/libs/util.js'
    export default {
        name: 'qqt-tree',
        props: {
            title: String,
            button: String,
            rolePage: false,
            btnTitle: {
                type: Object,
                default: () => {
                    return {
                        name: '新建分类',
                        icon: ''
                    }
                }
            },
            data: Array,
            defaultProps: Object,
            identifying: String,
            defaultObject: {
                type: Object,
                default: () => {}
            },
            newAdd: {
              type: Boolean,
              default: () => false
            },
            filterText: String,
            isShowDel: {
                type: Boolean,
                default: () => true
            },
            dic: {
                type: Boolean,
                default: () => false
            },
            defaultExpandedKeys: {
                type: Array,
                default: () => []
            },
            defaultCheckedKeys: {
                type: Array,
                default: () => []
            },
            isShowUpdate: {
                type: Boolean,
                default: () => true
            },
            defaultExpandAll: {
                type: Object,
                default: () => {}
            },
            isShowAdd: {
                type: Boolean,
                default: () => false
            },
            isDialog: {
                type: Boolean,
                default: () => false
            },
            isShowCheckbox: {
                type: Boolean,
                default: () => false
            },
            isBtnTitle: {
                type: Boolean,
                default: () => true
            },
            isShowHeader: {
                type: Boolean,
                default: () => true
            },
            isOnlyShowChildernCheck: {
                type: Boolean,
                default: () => false
            },
            checkData: {
                type: Array,
                default: () => []
            },
            defaultShowBtn: {
                type: Boolean,
                default: () => false
            },
            isCheckSingleton: {
                type: Boolean,
                default: () => false
            }
        },
        data () {
            return {
                superiorIdList: [],
                checkDatalist: [],
                superiorNameString: '',
                historicalData: null,
                defaultExpandedId: this.defaultExpandedKeys,
                defaultCheckedId: this.defaultCheckedKeys
            }
        },
        methods: {

            handleNodeClick (item) {
                // item['isShowFocus'] = true
                this.$emit('historicalData', JSON.parse(JSON.stringify(item)))
            },

            handleCheckChange (data, checked) {
                if (!this.isCheckSingleton) {
                    let index = this.checkDatalist.findIndex (f => f.id === data.id)
                    if (index != -1)
                        this.checkDatalist.splice (index, 1)
                    else
                        this.checkDatalist.push (data)
                    this.$emit ('checkChange', JSON.parse (JSON.stringify ( this.checkDatalist)), checked)
                } else {
                    this.$emit ('checkChange', data)
                }
            },

            append (data, isFather) {
                if(this.newAdd){
                    this.$emit('addNew', data)
                }else{
                    let newChild = {}
                    let item = null
                    if (this.defaultObject == null) {
                        this.$emit ('append', isFather, data)
                        return
                    }
                    newChild = JSON.parse(JSON.stringify(this.defaultObject))
                    newChild.id = (this.data.length + 1).toString()
                    if (isFather) {
                        data.push(newChild)
                        this.defaultCheckedId = [newChild.id]
                    } else {
                        newChild.superiorId = JSON.parse(JSON.stringify(data.superiorId))
                        newChild.superiorId.push(data.id)
                        newChild.parentId = data.id
                        if (data[this.defaultProps.children] == null) {
                            data[this.defaultProps.children] = [newChild];
                        } else {
                            data[this.defaultProps.children].push(newChild)
                        }
                    }
                    this.defaultExpandedId.push(data.id)
                    item = JSON.parse(JSON.stringify(newChild))
                    this.$emit('historicalData', item, true)
                }
            },

            remove (node, data) {
                util.confirm () .then (boolean => {
                    if (boolean) {
                        this.defaultExpandedId = []
                        this.$emit ('delete', data)
                    }
                })
            },

            expand (item) {
                this.$emit('historicalData', item)
            },

            hoverCustomTreeNode (data) {
                if (data['isShowFocus'] === true) {
                    data['isShowHover'] = false
                }
            },

            showRolePer (data) {
                this.$emit("showRolePermission", data)
            },

            addIdentification (data, id, name) {
                let index = ''
                if (data && data.length > 0) {
                    data.forEach(res => {
                        index = this.superiorIdList.findIndex(i => i === id)
                        if (index === 0 || res.parentId === '0') {
                            this.superiorIdList = []
                            this.superiorNameString = ''
                        }
                        if (index !== -1) {
                            this.superiorIdList.splice (index + 1)
                        }
                        if (id != null) {
                            if (this.superiorIdList.indexOf(id) === -1) {
                                this.superiorIdList.push(id)
                            }
                            res['superiorId'] = JSON.parse(JSON.stringify(this.superiorIdList))
                        } else {
                            res['superiorId'] = []
                        }
                        if (name != null) {
                            if (this.superiorNameString.indexOf(name) === -1) {
                                this.superiorNameString += name + '/'
                            }
                            res['superiorName'] = JSON.parse(JSON.stringify(this.superiorNameString.substring(0, this.superiorNameString.length - 1)))
                        } else {
                            res['superiorName'] = ''
                        }
                        res['isShowHover'] = true
                        res['isShowFocus'] = false
                        if (res[this.defaultProps.children] && res[this.defaultProps.children].length > 0) {
                            this.addIdentification(res[this.defaultProps.children], res.id, res.name)
                        }
                    })
                }
            },

            selectedBbyDefaultData () {
                if (this.defaultExpandedId
                        && this.defaultExpandedId.length === 0
                        && this.data[0][this.defaultProps.children]
                        && this.data[0][this.defaultProps.children].length > 0) {
                    // this.defaultExpandedId.push(this.data[0].id)
                    this.data[0][this.defaultProps.children][0]['isShowHover'] = false
                    this.data[0][this.defaultProps.children][0]['isShowFocus'] = true
                    this.$emit('historicalData', this.data[0][this.defaultProps.children][0])
                }
            },

            defaultExpandAndShutAll () {
                this.$refs.tree.store._getAllNodes().forEach(res => {
                    res.expanded = this.defaultExpandAll['isExpandAll'];
                })
            },

            edit (node, data) {
                if (this.rolePage) {
                    // 如果是角色权限页面
                    this.$emit ('editRole', node, data)
                } else if (this.dic) {
                    this.$emit ('editDic', node, data)
                } else if (this.isDialog) {
                    this.$emit ('editDic', node, data)
                }
                this.$emit ('edit', data)
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            appendRole () {
                this.$emit('appendRole','添加角色')
            },

            appendGroup ()  {
                this.$emit('appendGroup','添加分组')
            },

            appendDic () {
                this.$emit('appendDic', '添加分类')
            },

            resetCheckState () {
                this.$refs.tree.setCheckedNodes([])
                this.checkDatalist = []
            },

            setCheckedKeyList (data, boolean = true) {
                this.$refs.tree.setCheckedKeys (data, boolean)
            },

            setCheckedKey (data, boolean = false) {
                this.$refs.tree.setChecked (data, boolean)
            }
        },

        watch: {

            data () {
                this.addIdentification(this.data, null, null)
                this.selectedBbyDefaultData()
            },

            defaultExpandAll () {
                this.defaultExpandAndShutAll()
            },

            filterText (val) {
                this.$refs.tree.filter(val);
            },

            checkData (val) {
                this.checkDatalist = JSON.parse (JSON.stringify (val))
            }
        }
    }
</script>

<style lang="scss">
    .qqt-tree{
        padding: 10px;
        .qqt-tree-title {
            font-weight: 500;
            border-bottom: 1px dashed transparent;
            background: linear-gradient(white,white) padding-box,
            repeating-linear-gradient(-45deg, $color-straight-line3 0, $color-straight-line3 0.4em,white 0,white 0.7em);
            height: 50px;
            line-height: 50px;
            padding-left: 5px;
            .qqt-tree-title___line {
                border: 1px solid $color-vertical-line;
            }
            p {
                display: inline-block;
                padding-left: 10px;
                font-size: 16px;
                position: relative;
                top: 2px;
            }
        }
        .qqt-tree-option {
            padding: 15px 0;
            .qqt-tree-option-button {
                button {
                    padding: 6px 13px;
                    background: $color-button-typeface2;
                    margin-bottom: 10px;
                }
            }
        }
        .qqt-tree-role-btn {
            text-align: center;
            button{
                margin-left: 5px !important;
            }
        }
        .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
            height: 40px;
            width: 100%;
        }

        .custom-tree-node-btn {
            display: inline-block !important;
        }

        .el-ic-hover, .el-ic-focus {
            display: none;
            i, span {
                padding: 0 10px;
                font-size: 18px;
                color: $color-button-typeface1
            }
        }

        .el-tree-node__content:hover .el-ic-hover {
            display: inline-block;
        }

        .el-tree-node:focus > .el-tree-node__content .el-ic-focus {
            display: inline-block;
        }

        .el-tree {
            height: 605px;
            overflow-x: hidden;
            width: 100%;
        }

        .onlyShowChildernCheck {
            .el-tree-node {
                .is-leaf + .el-checkbox .el-checkbox__inner{
                    display: inline-block;
                }
                .el-checkbox .el-checkbox__inner{
                    display: none;
                }
            }
        }

        .custom-tree-node___name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }
    }
</style>
