<template>
    <div class="module-menu-details">
        <div class="module-menu-details-header">
            <p>{{ personalCertificateForm.name }}</p>
            <i class="el-icon-edit" @click="isShowElement = !isShowElement">修改</i>
        </div>
        <div class="module-menu-details-center">
            <el-row>
                <el-form ref="form" :model="personalCertificateForm" label-width="80px">
                    <el-col :span="8">
                        <el-form-item label="证书名称:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入证书名称'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event" required></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="持有人:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入证书持有人'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event" required></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入身份证号'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event" required></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="证书编号:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入证书编号'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event" required></qqt-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="保管人:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入保管人'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event" required></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保管部门:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入保管部门'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event" required></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="职位:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入职位'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event" required></qqt-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="所属部门:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入所属部门'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event" required></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工作单位:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入工作单位'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="专业类别:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入专业类别'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="级别:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入级别'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event"></qqt-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="发证单位:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入发证单位'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发证日期:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入发证日期'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="到期日期:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请输入到期日期'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否在建:">
                            <qqt-input :value="personalCertificateForm.name" :placeholder="'请选择'" :isShowElement="isShowElement" @input="personalCertificateForm.name = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <qqt-input :value="personalCertificateForm.parameter" :isShowElement="isShowElement" @input="personalCertificateForm.parameter = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" class="module-menu-details-center___button">
                        <el-form-item v-if="isShowElement">
                            <el-button type="primary" @click="onSubmit">确认</el-button>
                            <el-button @click="isShowElement = false">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </div>
    </div>
</template>

<script>
    import { qqtInput } from '../../../components/qqt-subassembly'
    export default {
        name: 'personalCertificateDetials',
        props: {
            
        },

        data () {

            return {
                personalCertificateForm: {
                    name: '证书详情',
                    parameter: '',
                },
                isShowElement: false,
            }
        },

        methods: {

            onSubmit () {

            },
        
            updateData () {
  
            }
        },
        
        components: {
            'qqt-input': qqtInput,
        },
        
        watch: {
            
            data () {

                this.updateData()
            }
        }
    }
</script>

<style scoped lang="scss" scoped>
    .module-menu-details {
        .module-menu-details-header {
            border-bottom: 1px solid $color-straight-line3;
            height: 45px;
            line-height: 16px;
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
                color: $color-button-typeface2;
            }
        }
        .module-menu-details-center {
            padding: 35px;
            .module-menu-details-center___icon {
                height: 40px;
            }
            .module-menu-details-center___button {
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
