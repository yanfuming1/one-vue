<template>
    <el-row>
        <el-form :model="essentialInformation" ref="essential" :rules="rules" label-width="160px" size="medium">
            <el-col :span="8">
                <el-form-item label="机构类型:" prop="companytype">
                    <qqt-select v-model="essentialInformation.companytype" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="companytypeOptions" @select="essentialInformation.companytype = $event"></qqt-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="机构名称:" prop="organiname">
                    <qqt-input v-model="essentialInformation.organiname" :isShowElement="isShowElement" @input="essentialInformation.organiname = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="办公地址:" prop="location">
                    <qqt-cascader
                        v-model="essentialInformation.location"
                        :options="cityJson"
                        :isShowElement="isShowElement"
                        :defaultParams="cityJsonParams"
                        @cascaded="essentialInformation.location = $event"
                    >
                    </qqt-cascader>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="经营地域:" prop="managementarea">
                    <qqt-cascader
                        v-model="essentialInformation.managementarea"
                        :options="cityJson"
                        :collapseTags="true"
                        :defaultParams="managementareaParams"
                        :isShowElement="isShowElement"
                        @cascaded="essentialInformation.managementarea = $event"
                    >
                    </qqt-cascader>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="经营负责人:" prop="personCharge">
                    <qqt-input v-model="essentialInformation.personCharge" :isShowElement="isShowElement" @input="essentialInformation.personCharge = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="身份证号:" prop="idnumber">
                    <qqt-input v-model="essentialInformation.idnumber" :isShowElement="isShowElement" @input="essentialInformation.idnumber = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="家庭住址:" prop="homeaddress">
                    <qqt-cascader
                        v-model="essentialInformation.homeaddress"
                        :options="cityJson"
                        :isShowElement="isShowElement"
                        :defaultParams="cityJsonParams"
                        @cascaded="essentialInformation.homeaddress = $event"
                    >
                    </qqt-cascader>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系方式:" prop="contactnumber">
                    <qqt-input v-model="essentialInformation.contactnumber" :isShowElement="isShowElement" @input="essentialInformation.contactnumber = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="经营期限:" prop="stime">
                    <el-date-picker 
                        value-format="yyyy-MM-dd"
                        :class="{'isShowDetails': !isShowElement}"
                        :disabled="!isShowElement"
                        v-model="essentialInformation.stime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="是否办理工商注册登记:">
                    <qqt-radior v-model="essentialInformation.isregist" :options="typeList" :isShowElement="isShowElement" @radio="$emit('isregist', $event)" />
                </el-form-item>
            </el-col>
        </el-form>
    </el-row>
</template>

<script>
    import { CITYJSON } from '../../../../enum/CTIYS'
    import { qqtSelect, qqtCascader, qqtInput, qqtRadio } from '../../../../components/qqt-subassembly'
    export default {

        props: {
            companytypeOptions: Array,
            isShowElement: {
                type: Boolean,
                default: true
            },
            essentialInformation: {
                type: Object,
                default: () => {
                    return {
                        organiname: '',
                        companytype: '',
                        managementarea: [],
                        stime: [],
                        location: [],
                        personCharge: '',
                        idnumber: '',
                        homeaddress: [],
                        contactnumber: ''
                    }
                }
            }
        },

        components: {
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect,
            'qqt-radior': qqtRadio,
            'qqt-cascader': qqtCascader
        },

        data () {
            return {
                cityJson: CITYJSON,
                rules: {
                    'organiname': [
                        { required: true, message: '机构名称不能为空', trigger: 'blur' }
                    ],
                    'companytype': [
                        { required: true, message: '机构类型不能为空', trigger: 'change' }
                    ],
                    'managementarea': [
                        { required: true, message: '经营地域不能为空', trigger: 'change' }
                    ],
                    'stime': [
                        { required: true, message: '经营期限不能为空', trigger: 'change' }
                    ],
                    'location': [
                        { required: true, message: '办公地址不能为空', trigger: 'change' }
                    ],
                    'personCharge': [
                        { required: true, message: '经营负责人不能为空', trigger: 'blur' }
                    ],
                    'idnumber': [
                        { required: true, pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/, message: '请输入正确的身份证号', trigger: 'change' },
                    ],
                    'homeaddress': [
                        { required: true, message: '家庭住址不能为空', trigger: 'change' }
                    ],
                    'contactnumber': [
                        { required: true, pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的联系方式', trigger: 'change' },
                    ],
                },
                cityJsonParams: {
                    value: 'label',
                    label: 'label'
                },
                defaultProp: {
                    value: 'name',
                    label: 'name'
                },
                managementareaParams: {
                    multiple: true, 
                    checkStrictly: false,
                    value: 'label',
                    label: 'label'
                },
                typeList: [
                    {
                        value: '0',
                        label: '是'
                    },
                    {
                        value: '1',
                        label: '否'
                    }
                ]
            }
        },

        methods: {

            verify () {
                let required = false
                return new Promise((resolve, reject) => {
                    this.$refs.essential.validate(valid => {
                        if (!valid) {
                            resolve (false)
                        } else {
                            resolve (JSON.parse (JSON.stringify (this.essentialInformation)))
                        }
                    })
                })
            }
        }
    }
</script>

<style lang='scss' scoped>

</style>
