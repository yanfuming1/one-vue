<template>
    <div class="module-menu-details">
        <div class="module-menu-details-header" v-if="$has('sys:permission:edit')">
            <p>{{ moduleMenuForm.name }}</p>
            <i class="el-icon-edit" @click="isShowElement = true">修改</i>
        </div>
        <div class="module-menu-details-center">
            <el-row>
                <el-form ref="form" :model="moduleMenuForm" label-width="100px">
                    <el-col :span="24" >
                        <el-form-item label="上级菜单:">
                            <qqt-cascader
                                :value="moduleMenuForm.superiorId"
                                :options="options"
                                :defaultParams="defaultParams"
                                :isShowElement="isShowElement"
                                :id="moduleMenuForm.id"
                                :superiorName="moduleMenuForm.superiorName"
                                @cascaded="moduleMenuForm.superiorId = $event"
                            >
                            </qqt-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 62px">
                        <el-form-item label="名称:" >
                            <qqt-input :value="moduleMenuForm.name"  :placeholder="'请输入菜单名称'" :isShowElement="isShowElement" @input="moduleMenuForm.name = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 62px">
                        <el-form-item label="别名:" >
                            <qqt-input :value="moduleMenuForm.alias" :placeholder="'可输入菜单别名'" :isShowElement="isShowElement" @input="moduleMenuForm.alias = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="图标:" class="module-menu-details-center___icon">
                            <qqt-icon-select v-model="moduleMenuForm.css" :user-input="true" :placeholder="`可选择菜单图标`" :isShowElement="isShowElement"/>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12" style="height: 62px">
                        <el-form-item label="图标:" class="module-menu-details-center___icon">
                            <qqt-icon-font-select v-model="moduleMenuForm.css" :user-input="true" :placeholder="`可选择菜单图标`" :isShowElement="isShowElement"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 62px">
                        <el-form-item label="排序:">
                            <qqt-input-number :value="Number(moduleMenuForm.sort)" :min="1" :isShowElement="isShowElement" :controlsPosition="'right'" @inputNumber="moduleMenuForm.sort = $event"></qqt-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 62px">
                        <el-form-item label="类型:">
                            <qqt-select :value="moduleMenuForm.type" :placeholder="'请选择菜单类型'" :isShowElement="isShowElement" :options="typeList" @select="moduleMenuForm.type = $event"></qqt-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 62px">
                        <el-form-item label="导航:">
                            <qqt-switch :value="moduleMenuForm.isNavigation === '1' ? true : false" :isShowElement="isShowElement" @getSwitch="moduleMenuForm.isNavigation = ($event === true ? '1' : '0')"></qqt-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 62px">
                        <el-form-item label="链接类型:">
                            <qqt-radio :value="moduleMenuForm.connectionType" :options="connectionTypeList" :isShowElement="isShowElement" @radio="moduleMenuForm.connectionType = $event"></qqt-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 62px">
                        <el-form-item label="打开方式:">
                            <qqt-radio :value="moduleMenuForm.openMode" :options="openModeList" :isShowElement="isShowElement" @radio="moduleMenuForm.openMode = $event"></qqt-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 62px">
                        <el-form-item label="开启移动端:">
                            <qqt-select :value="moduleMenuForm.webApp" :isShowElement="isShowElement" :options="webAppList" @select="moduleMenuForm.webApp = $event"></qqt-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 62px" v-if="moduleMenuForm.webApp == 1">
                        <el-form-item label="appUrl:">
                            <qqt-input :value="moduleMenuForm.cellhref" :placeholder="'可输入链接地址'" :isShowElement="isShowElement" @input="moduleMenuForm.cellhref = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="URL:">
                            <qqt-input :value="moduleMenuForm.href" :placeholder="'可输入链接地址'" :isShowElement="isShowElement" @input="moduleMenuForm.href = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="参数:">
                            <qqt-input :value="moduleMenuForm.parameter" :placeholder="'可输入链接参数'" :isShowElement="isShowElement" @input="moduleMenuForm.parameter = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" class="module-menu-details-center___button">
                        <el-form-item v-if="isShowElement">
                            <el-button type="primary" @click="onSubmit">确认</el-button>
                            <el-button @click="isShowElement = false, $emit('deletcNewNode')">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </div>
    </div>
</template>

<script>
    import qqtIconSelect from '../../../../components/qqt-icon-select/index'
    import qqtIconFontSelect from '../../../../components/qqt-iconFont-select/index'
    import { qqtInput, qqtInputNumber, qqtCascader, qqtRadio, qqtSelect, qqtSwitch } from '../../../../components/qqt-subassembly'
    import { updateModuleMenuTree, addModuleMenuTree } from '../../../../api/system/moduleMenu';
    export default {
        name: 'moduleMenuDetails',
        props: {
            data: Object,
            options: Array,
            defaultParams: Object
        },
        data () {
            return {
                moduleMenuForm: {
                    id: '',
                    connectionType: '',
                    css: '',
                    href: '',
                    isNavigation: '',
                    name: '',
                    alias: '',
                    openMode: '',
                    parameter: '',
                    parentId: '',
                    sort: 1,
                    webApp: '0',
                    type: '',
                    superiorName: '',
                    superiorId: []
                },
                isShowElement: false,
                connectionTypeList: [
                    {
                        value: '1',
                        label: '模块'
                    },
                    {
                        value: '0',
                        label: '外链接'
                    }
                ],
                openModeList: [
                    {
                        value: '1',
                        label: '当前窗口'
                    },
                    {
                        value: '0',
                        label: '新窗口'
                    }
                ],
                typeList: [
                    {
                        value: '0',
                        label: '菜单'
                    },
                    {
                        value: '1',
                        label: '按钮'
                    }
                ],
                webAppList: [
                    {
                        value: '0',
                        label: '不开启'
                    },
                    {
                        value: '1',
                        label: '开启'
                    }
                ]
            }
        },
        methods: {
            onSubmit () {
                this.moduleMenuForm.parentId = this.moduleMenuForm.superiorId[this.moduleMenuForm.superiorId.length - 1]
                if (this.moduleMenuForm && this.moduleMenuForm.isEditor === true) {
                    this.moduleMenuForm.id = ''
                    addModuleMenuTree (this.moduleMenuForm).then(result => {
                        if (result.code === 200) {
                            this.isShowElement = !this.isShowElement
                            this.$emit('menu')
                            this.$message.success('操作成功')
                        }
                    })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    updateModuleMenuTree (this.moduleMenuForm).then(result => {
                        if (result.code === 200) {
                            this.isShowElement = !this.isShowElement
                            this.$emit('menu')
                            this.$message.success('操作成功')
                        }
                    })
                        .catch(err => {
                            console.log(err)
                        })
                }
            },
            updateData () {
                this.moduleMenuForm = this.data
                if (!this.moduleMenuForm.webApp) this.moduleMenuForm.webApp = '0'
                if (this.data && this.data.isEditor === true) {
                    this.isShowElement = true
                }
            },

            updataElement () {
                this.isShowElement = true
            }
        },
        components: {
            'qqt-switch':qqtSwitch,
            'qqt-select': qqtSelect,
            'qqt-radio': qqtRadio,
            'qqt-cascader': qqtCascader,
            'qqt-input-number': qqtInputNumber,
            'qqt-icon-select': qqtIconSelect,
            'qqt-input': qqtInput,
            'qqt-icon-font-select': qqtIconFontSelect
        },
        watch: {
            data () {
                this.updateData()
            }
        }
    }
</script>

<style scoped lang="scss">
    .module-menu-details {
        padding: 10px 0;
        .module-menu-details-header {
            border-bottom: 1px solid $color-straight-line3;
            height: 45px;
            line-height: 45px;
            color: $color-button-typeface3;
            p {
                display: inline-block;
                padding-left: 15px;
                font-size: 14px;
            }
            i {
                float: right;
                padding-right: 13px;
                padding-top: 15px;
                font-size: 15px;
                color: $color-button-typeface2;
            }
        }
        .module-menu-details-center {
            padding: 35px;
            .module-menu-details-center___icon {
                height: 40px;
            }
            .module-menu-details-center___button {
                margin-top: 100px;
                text-align: center;
                button {
                    height: 30px;
                    padding: 6px 10px;
                }
                margin-left: -80px;
            }
        }
            
    }

</style>
