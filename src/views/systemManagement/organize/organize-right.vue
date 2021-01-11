<template>
    <el-card class="box-card right-con">
        <div slot="header" class="clearfix">
            <span>{{rightTitle}}</span>
        </div>
        <div>
            <el-form ref="form" :model="tempData">
                <input v-model="tempData.id"></input>
                <input v-model="tempData.parentId"></input>
                <el-row>
                    <el-col :span="9" :offset="1">
                        <el-form-item label="组织类型">
                            <el-input v-if="isDetail"
                                    readonly=""
                                    placeholder="请输入内容"
                                    v-model="tempData.type">
                            </el-input>
                            <el-select v-else v-model="tempData.type" filterable placeholder="请选择">
                                <el-option
                                        v-for="item in departType"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9" :offset="2">
                        <p><span>*</span>组织名称</p>
                        <el-input v-if="isDetail"
                                  readonly=""
                                  placeholder="请输入内容"
                                  v-model="tempData.name"
                                  clearable>
                        </el-input>
                        <el-input v-else
                                  placeholder="请输入内容"
                                  v-model="tempData.name"
                                  clearable>
                        </el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" :offset="1">
                        <p><span>*</span>组织简称</p>
                        <el-input v-if="isDetail"
                                  readonly=""
                                  placeholder="请输入内容"
                                  v-model="tempData.abbreviation"
                                  clearable>
                        </el-input>
                        <el-input v-else
                                  placeholder="请输入内容"
                                  v-model="tempData.abbreviation"
                                  clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="9" :offset="2">
                        <p><span>*</span>上级组织</p>
                        <el-input
                                readonly
                                v-model="tempData.parent"
                                placeholder="请输入内容"
                                clearable>
                        </el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" :offset="1">
                        <p>组织编码</p>
                        <el-input v-if="isDetail"
                                  readonly=""
                                  v-model="tempData.code"
                                  placeholder="请输入内容"
                                  clearable>
                        </el-input>
                        <el-input v-else
                                  placeholder="请输入内容"
                                  v-model="tempData.code"
                                  clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="9" :offset="2">
                        <p><span>*</span>组织管理员</p>
                        <el-input v-if="isDetail"
                                  readonly=""
                                  v-model="tempData.untitledName"
                                  placeholder="请输入内容"
                                  clearable>
                        </el-input>
                        <el-select v-else v-model="tempData.untitled" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in userList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" :offset="1">
                        <p><span>*</span>办公地址</p>
                        <el-input v-if="isDetail"
                                  readonly=""
                                  v-model="tempData.address"
                                  placeholder="请输入内容"
                                  clearable>
                        </el-input>
                        <el-input v-else
                                  placeholder="请输入内容"
                                  v-model="tempData.address"
                                  clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="9" :offset="2">
                        <p>状态</p>
                        <el-input v-if="isDetail"
                                  readonly=""
                                  v-model="tempData.statusName"
                                  placeholder="请输入内容"
                                  clearable>
                        </el-input>
                        <el-select v-else v-model="tempData.status" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in departStatus"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :offset="1" :span="20">
                        <p>备注</p>
                        <el-input v-if="isDetail" readonly type="textarea" v-model="tempData.remark" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" ></el-input>
                        <el-input v-else type="textarea" v-model="tempData.remark" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" ></el-input>
                    </el-col>
                </el-row>
                <el-row class="btn-group" v-show="!isDetail">
                    <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
                    <el-button size="mini">取消</el-button>
                </el-row>
            </el-form>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "organize-right",
        data () {
            return {
                tempData: {
                    id: '',
                    name: '',
                    type: '',
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
                }
            }
        },
        methods: {
            //设置中间数据
            setTempData (obj, node) {
                let user = ''
                this.userList.forEach(item => {
                    if(item.id === obj.untitled){
                        user = item.name
                    }
                })
                this.tempData.id = obj.id
                this.tempData.name = obj.name
                this.tempData.type = obj.type
                this.tempData.abbreviation = obj.abbreviation
                this.tempData.parentId = node.parent.data.id
                this.tempData.parent = node.parent.data.name ? node.parent.data.name : '无'
                this.tempData.address = obj.address
                this.tempData.status = obj.status
                this.tempData.statusName = obj.status === '1' ? '启用' : '禁用'
                this.tempData.code = obj.code
                this.tempData.untitled = obj.untitled
                this.tempData.untitledName = user
                this.tempData.remark = obj.remark
            },
            setTempDataNull (){
                this.tempData.id = ''
                this.tempData.name = ''
                this.tempData.type = ''
                this.tempData.abbreviation = ''
                this.tempData.parentId = ''
                this.tempData.parent = ''
                this.tempData.address = ''
                this.tempData.status = ''
                this.tempData.statusName = ''
                this.tempData.code = ''
                this.tempData.untitled = ''
                this.tempData.untitledName = ''
                this.tempData.remark = ''
            },
        }
    }
</script>

<style scoped>

</style>
