<template>
    <d2-container>
        <el-row class="organize-con">
            <el-col :span="6" class="p-r-10">
               <el-card class="box-card left-con">
                   <div slot="header" class="clearfix">
                       <span>组织机构设置</span>
                   </div>
                   <div>
                       <el-tree
                           :data="treeData"
                           ref="tree"
                           node-key="id"
                           :props="defaultProps"
                           @node-click="choseDepart">
                           <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                              <el-button v-if="$has('sys:department:add')" type="text" size="mini" @click.stop="() => append(node, data)">
                                <i class="el-icon-plus" style="font-size:15px;"></i>
                              </el-button>
                                <el-button v-if="$has('sys:department:edit')" type="text" size="mini" @click.stop="() => edit(node, data)">
                                <i class="el-icon-edit" style="font-size:15px;"></i>
                              </el-button>
                              <el-button v-if="$has('sys:department:del') && data.child.length == 0 " type="text" size="mini" @click.stop="() => remove(node, data)">
                                <i class="el-icon-close" style="font-size:15px;"></i>
                              </el-button>
                            </span>
                          </span>
                       </el-tree>
                   </div>
               </el-card>
            </el-col>
            <el-col :span="18" class="p-l-10">
                <el-card class="box-card right-con">
                    <div slot="header" class="clearfix">
                        <span style="font-size: 16px;">【组织机构详情】</span>
                    </div>
                    <div>
                        <el-form ref="form" :model="tempData" :label-position="labelPosition" :rules="rules">
                        <input v-model="tempData.id" v-if="showId"></input>
                        <input v-model="tempData.parentId" v-if="showId"></input>
                        <el-row>
                            <el-col :span="9" :offset="1">
                                <el-form-item label="组织机构类型" prop="type">
                                    <el-select :disabled="isDetail" v-model="tempData.type" filterable placeholder="请选择" @change="typeChange">
                                        <el-option v-for="item in departType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9" :offset="2">
                                <el-form-item label="组织机构属性" prop="property">
                                    <el-select :disabled="isOrganize" v-model="tempData.property" @change="changeProperty" filterable placeholder="请选择">
                                        <el-option v-for="item in propertyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="9" :offset="1">
                                <el-form-item label="组织机构全称" prop="name">
                                    <el-input :disabled="isDetail" placeholder="请输入内容" v-model="tempData.name" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9" :offset="2">
                                <el-form-item label="组织机构简称">
                                    <el-input :disabled="isDetail" placeholder="请输入内容" v-model="tempData.abbreviation" clearable></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="9" :offset="1">
                                <el-form-item label="上级组织机构">
                                    <el-input :disabled="isDetail" v-model="tempData.parent" placeholder="请输入内容" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9" :offset="2">
                                <el-form-item label="组织机构编码" prop="code">
                                    <el-input placeholder="自动生成" :disabled="noInput" v-model="tempData.code" clearable></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="9" :offset="1">
                                <el-form-item label="组织管理员" prop="untitled">
                                    <el-select :disabled="isDetail" clearable v-model="tempData.untitled" filterable placeholder="请选择">
                                        <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9" :offset="2">
                                <el-form-item label="办公地址" prop="address">
                                    <el-input :disabled="isDetail" placeholder="请输入内容" v-model="tempData.address" clearable></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="9" :offset="1">
                                <el-form-item label="组织机构状态">
                                    <el-select :disabled="isDetail" v-model="tempData.status" filterable placeholder="请选择">
                                        <el-option v-for="item in departStatus" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :offset="1" :span="20">
                                <el-form-item label="备注">
                                    <el-input :disabled="isDetail" type="textarea" v-model="tempData.remark" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="btn-group" v-show="!isDetail">
                            <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
                            <el-button size="mini" @click="cancel">取消</el-button>
                        </el-row>
                        </el-form>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    import { GetDepartTree, GetDepartTreeByLoginer, } from '../../../api/system/depart/depart-tree'
    import { GetDepart } from '../../../api/system/depart/depart'
    import { GetUser } from '../../../api/system/depart/get-user'
    import { DepartEdit, DepartAdd, DepartDel } from '../../../api/system/depart/depart-edit'
    import util from '../../../libs/util'
    import QqtSelect from "../../../components/qqt-subassembly/qqt-select/qqt-select";
    export default {
        name: "index",
        components: {QqtSelect},
        data: function () {
            return {
                showId: false,
                departType: [
                    { id: '1', name: '总公司' }, { id: '2', name: '分公司' }, { id: '5', name: '子公司' },
                    { id: '4', name: '内设部门' }, { id: '6', name: '驻外机构' },{ id: '7', name: '其他类型' },
                ],
                // 组织机构状态
                departStatus: [ { id: '1', value: '启用'}, { id: '2', value: '禁用'} ],
                labelPosition: 'top',
                // 上级部门
                upDepart: [],
                // 职员
                userList: [],
                value: '',
                rightTitle: '组织机构详情',
                defaultProps: { children: 'child', label: 'name' },
                isDetail: true,
                isOrganize: true,
                treeData: [],
                tempData: {
                    id: '',
                    name: '',
                    type: '',
                    property: '',
                    parent: '',
                    parentId: '',
                    abbreviation: '',
                    code: 0,
                    untitled: '',
                    untitledName: '',
                    address: '',
                    status: '',
                    statusName: '',
                    remark: '',
                },
                cancelItem: {},
                temId : {},
                rules: {
                    name: [ { required: true, message: '请输入组织机构全称', trigger: ['blur', 'change'] }, ],
                    property: [ { required: true, message: '请选择组织机构属性', trigger: [ 'change', 'blur'] } ],
                    type: [ { required: true, message: '请选择组织机构类型', trigger: ['blur', 'change'] } ],
                    code: [ { pattern: /^\w+$/, message: '不能输入符号、中文', trigger: ['blur', 'change'] } ],
                    untitled: [ ],
                    address: [ ]
                },
                propertyList: [
                    { id: '1', name: '组织' }, { id: '2', name: '机构' }
                ],
                choseOrganize: {},
                noInput: true,
            }
        },
        methods: {
            handleSubmit () {
                GetDepart().then(res => {this.upDepart = res})
                GetUser().then(res => { this.userList = res })
            },
            typeChange(type) {
                switch(type) {
                    case '1':
                    case '2':
                    case '5':
                        this.tempData.property = '1'
                        this.isOrganize = true
                        break
                    case '4':
                        this.tempData.property = '2'
                        this.isOrganize = true
                        break
                    case '6':
                    case '7':
                        this.isOrganize = false
                        break
                }
            },
            getDepart () {
                GetDepartTreeByLoginer().then(res => {
                    this.treeData = res
                    this.rightTitle = res[0].name
                    this.setTempData(res[0], '')
                })
            },
            // 修改属性
            changeProperty (val) {
                this.setRules({ property: val })    
            },
            setRules (data) {
                // this.rules.untitled = data.property === '1' ? [ { required: true, message: '请输入组织机构管理员', trigger: ['blur', 'change'] } ] : []
                // this.rules.address = data.property === '1' ? [ { required: true, message: '请输入地址', trigger: ['blur', 'change'] } ] : []
            },
            choseDepart(obj, node, com){
                // 显示主要内容
                this.rightTitle = obj.parentId === '0' ? this.treeData[0].name : this.treeData[0].name + ' / ' + obj.name
                this.isDetail = true
                this.isOrganize = true
                this.setTempData(obj, node)
                this.setRules(obj)
            },

            append(node, data) {
                if (data.property === '1') {
                    this.choseOrganize = node
                    data.property === '2' ? this.setTempDataNull('2') : this.setTempDataNull('1')
                    this.isOrganize = data.property === '2' ? true : false
                    this.rightTitle = '新建组织机构机构'
                    this.isDetail = false
                    this.tempData.parentId = data.id
                    this.tempData.parent = data.name
                    let id = util.guid()
                    const newChild = JSON.parse (JSON.stringify (this.tempData))
                    newChild.id = id + '',
                    newChild.name = '新建节点'
                    this.temId = newChild
                    if (!data.child) {
                        this.$set(data, 'child', []);
                    }
                    data.child.push(newChild);
                    // setCurrentKey
                    this.$refs.tree.setCurrentKey(id)
                } else {
                    this.$message.warning("机构里面不可添加组织或机构!!!")
                }
            },

            edit(node, data){
                this.choseOrganize = node

                this.setTempData(data, node)
                this.rightTitle = '编辑组织机构'
                this.isOrganize = true
                this.isDetail = false
            },

            remove(node, data) {
                let that = this
                util.confirm('此操作将永久删除该组织机构, 是否继续?').then(valid => {
                    if(valid) {
                        if(data.id.indexOf('D') !== -1){
                            DepartDel({ id: data.id }).then(res => {
                                if (res.code === 200) {
                                    this.$message.success("删除成功~~~")
                                    let parent = node.parent;
                                    let children = parent.data.child || parent.data;
                                    let index = children.findIndex(d => d.id === data.id);
                                    children.splice(index, 1)
                                    this.getDepart()
                                }
                            })
                        }
                    } else {
                        this.$message.info("已取消删除~~~")
                    }
                })
            },

            onSubmit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        // 点击提交
                        if(this.tempData.id){
                            DepartEdit( this.tempData ).then(res => {
                                this.getDepart()
                                this.$message.success("修改成功~~")
                                this.isDetail = true
                            })
                        }else{
                            DepartAdd( this.tempData ).then(res => {
                                if(res.code === 200){
                                    this.getDepart()
                                    this.$message.success("添加成功~~")
                                    this.isDetail = true
                                }
                            })
                        }
                    }
                })
            },
            setTempData (obj, node) {
                Object.assign (this.tempData, obj)
                let user = ''
                this.userList.forEach(item => {
                    if(item.id === obj.untitled){
                        user = item.name
                    }
                })
                this.tempData.untitledName = user
                this.tempData.parentId = node !== '' ? node.parent.data.id : ''
                if(node !== ''){
                    this.tempData.parent = node.parent.data.name === '' ? '无' : node.parent.data.name
                } else {
                    this.tempData.parent = '无'
                }
                Object.assign (this.cancelItem, this.tempData)
            },
            setTempDataNull (property){
                this.tempData = {
                    type: null,
                    name: null,
                    abbreviation: null,
                    property: property,
                }
                this.$refs.form.resetFields()
            },
            cancel () {
                this.tempData = this.cancelItem
                this.$refs.tree.remove(this.temId)
                this.isDetail = true
                this.isOrganize = true
            }
        },
        mounted() {
            this.getDepart()
            util.setCommonData(this)
        },
        created () {
            this.handleSubmit()
        }
    }
</script>

<style lang="scss">
.p-r-10{ padding-right: 10px; }
.p-l-10{ padding-left: 10px; }
.organize-con{
    height: 100%;
    &>div, &>div .box-card{ height: 100%; }
    .el-card__header{
        border-bottom: 1px dashed transparent;
        background: linear-gradient(white,white) padding-box,
            repeating-linear-gradient(-45deg, $color-straight-line3 0, $color-straight-line3 0.4em,white 0,white 0.7em);
    }
    .el-card__header{ border-bottom: 1px solid #d0d0d0 !important; }
    .box-card{ padding: 0px 10px; overflow: auto; }
    &>div:first-child .el-card__header {
        .clearfix{
            position: relative;
            span{ font-size: 16px; }
        }
        span:before{
            content: '';
            width: 2px;
            height: 80%;
            background: $color-vertical-line;
            position: absolute;
            left: -10px;
            top: 2px;
        }
    }
    .left-con{
        .el-card__body{
            padding: 10px 0px 20px 0px;
        }
    }
}
.right-con{
    .el-card__header .clearfix span{ font-size: 14px; }
    .el-form--label-top .el-form-item__label{ padding-bottom: 0px; }
    .el-form-item{ margin-bottom: 15px; }
    p{
        margin-bottom: .5em;
        font-size: 14px;
        padding-left: 16px;
        span{ line-height: 20px; color: #fc6e5f; margin-right: 5px; }
    }
    .el-select{ width: 100%; }
    .btn-group{ text-align: center; padding-top: 20px; width: 100%; }
}
.custom-tree-node {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    padding-right: 52px;
    &>span:first-child{
        display: inline-block;
        width: 100%;
        overflow: hidden;
    }
    &>span:nth-child(2){
        position: absolute;
        right: 0px;
        .el-button+.el-button{
            margin-left: 0px;
        }
    }
}
.btn-custom-cancel{ float: right; margin-left: 10px; }
</style>
