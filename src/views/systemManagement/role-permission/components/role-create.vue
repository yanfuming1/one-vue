<template>
    <d2-container class="role-create-div">
        <el-form ref="form" :model="roleInfo" :rules="rules" label-width="100px" :label-position="'top'">
            <el-row>
                <el-col :span="11" class="role-info">
                    <el-col :span="24">
                        <el-form-item label="角色名称" required prop="name">
                            <el-input :readonly="read" v-if="!isDetail" placeholder="请输入角色名称" v-model="roleInfo.name"></el-input>
                            <qqt-p v-if="isDetail" :value="roleInfo.name"></qqt-p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="角色编码" prop="roleCode">
                            <el-input :readonly="read" v-if="!isDetail" placeholder="自动生成" disabled="" v-model="roleInfo.roleCode"></el-input>
                            <qqt-p v-if="isDetail" :value="roleInfo.roleCode"></qqt-p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="角色分组" required prop="type">
                            <el-select v-if="!isDetail" v-model="roleInfo.type" placeholder="请选择" style="width: 100%;">
                                <el-option v-for="item in typeOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                            <qqt-p v-if="isDetail" :value="roleInfo.type"></qqt-p>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="11" :offset="2" class="offsetRight">
                    <el-col :span="24">
                        <div class="role-create-item">
                            <el-form-item label="拥有权限" required>
                                <div class="tree-border">
                                    <role-style-tree
                                        ref="roleTree"
                                        :isShowDetails="isDetail"
                                        :styleData="styleDataRight"
                                        :styleProps="styleProps"></role-style-tree>
                                </div>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <div class="role-create-btn">
                    <el-button type="primary" v-if="!isDetail" size="small" @click="submit">确定</el-button>
                    <el-button size="small" v-if="!isDetail" @click="cancel">取消</el-button>
                    <el-button type="primary" size="small" v-if="isDetail" @click="cancel">关闭</el-button>
                </div>
            </el-row>
        </el-form>
    </d2-container>
</template>

<script>
import QqtInput from "../../../../components/qqt-subassembly/qqt-input/qqt-input"
import RoleStyleTree from "./role-style-tree"
import { GetLimitsTree,GetRoleById, RoleAdd, RoleEdit} from '../../../../api/system/role/role'
import QqtSelect from "../../../../components/qqt-subassembly/qqt-select/qqt-select";
import QqtP from "../../../../components/qqt-subassembly/qqt-p/qqt-p";
import util from '@/libs/util.js'
let that = this
export default {
    name: "role-create",
    components: {QqtP, QqtSelect, RoleStyleTree, QqtInput},
    props: {
        data: Object,
        add: {
            type: Boolean,
            default: true
        },
        typeOption: Array,
        isDetail:  {
            type: Boolean,
            default: true
        },
        detailLimits: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            read: false,
            roleInfo: {
                name: '',
                roleCode: '',
                type: ''
            },
            styleDataRight: [],
            styleProps: {
                children: 'children',
                label: 'name'
            },
            defaultProp: {
                value: 'id',
                label: 'name'
            },
            multiple: false,
            rules:{
                name: [
                    { required: true, message: '请输入角色名称', trigger: ['blur','change']},
                ],
                type: [
                    { required: true, message: '请选择角色类型', trigger: ['blur','change']},
                ],
            }
        }
    },
    methods: {
        cancel () {
            this.$emit('closeDrawer')
        },
        submit () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.roleInfo.updatedBy = this.$refs.roleTree.getCheckedKeys()
                    if(this.add){
                        RoleAdd(
                            this.roleInfo
                        ).then(res => {
                            util.setCommonData ()
                            that.$message.success('添加成功')
                            that.$emit('closeDrawer')
                        })
                    }else{
                        this.roleInfo.staffList = null
                        RoleEdit(
                            this.roleInfo
                        ).then(res => {
                            that.$message.success("编辑成功")
                            that.$emit('closeDrawer')
                        })
                    }
                }
            });
        },
        select (data) {
            this.roleInfo.type = data
        },
        setLimits (data) {
            this.$refs['roleTree'].setCheckedKeys([])
            if(util.isString(data.updatedBy)){
                let arr = data.updatedBy.split(',')
                this.$refs['roleTree'].setCheckedKeys(arr)
            }else{
                this.$refs['roleTree'].setCheckedKeys([])
            }
        },
        detailSet(){
            if(this.isDetail){
                this.typeOption.forEach(item => {
                    if(item.id === this.roleInfo.type){
                        this.roleInfo.type = item.name
                    }
                })
            }
        },
        setDetailLimits () {
            if(this.isDetail){
                this.styleDataRight = this.detailLimits
            } else {
                this.styleDataRight = this.$store.getters['d2admin/role/getData']
            }
        }
    },
    mounted() {
        that = this
        this.setDetailLimits()
        if(this.add){
            this.roleInfo = {
                name: '',
                roleCode: '',
                type: ''
            }
            this.$refs.form.resetFields()
            this.setLimits({})
        } else {
            this.roleInfo = this.data
            this.setLimits(this.roleInfo)
            this.detailSet()
        }
    },
    watch: {
        data : {
            immediate: true,
            deep: true,
            handler(newVal, oldName) {
                this.roleInfo = newVal
                if(this.add){
                    this.roleInfo = {
                        name: '',
                        roleCode: '自动生成',
                        type: ''
                    }
                    this.$refs.form.resetFields()
                    this.setLimits({})
                } else {
                    this.setLimits(newVal)
                    this.detailSet()
                }
            },
        },
        isDetail (newVal, old) {
            this.setDetailLimits()
        },
        detailLimits (newVal, old) {
            this.setDetailLimits()
        }
    }
}
</script>

<style lang="scss">
.role-create-div{
    padding: 0px 0px 0px 20px ;
    .role-info{
        p{ background: #FFF; color: #666; }
    }
    .offsetRight{ margin-left: 5% }
    .role-create-item{
        p{
            color: #555a5f;
            position: relative;
            padding-left: 20px;
            span{
                color: #fc6e5f;
                position: absolute;
                left: 5px;
                top: 3px;
                font-size: 20px;
            }
        }
        .tree-border{
            border: 1px solid #dddddd;
            padding-left: 10px;
            border-radius: 3px;
            height: 450px;
            overflow-y: scroll;
            background: #FFF;
        }
    }
    .role-create-btn{
        text-align: center;
        margin: 250px 0px;
    }
}
</style>
