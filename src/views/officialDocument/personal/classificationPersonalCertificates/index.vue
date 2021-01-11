<template>
    <d2-container type="fulls">
        <div class="classification_personal_certificates_tree">
            <qqt-tree
                :title="title" 
                :btnTitle="btnTitle"
                :data="certificateClassificationData"
                :defaultProps="defaultProps"
                :isShowAdd="true"
                @append="addCertificateClassificationEvent"
                @edit="editCertificateClassificationEvent"
                @delete="delCertificateClassificationEvent"
            />
        </div>

        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="30%">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="分类名称">
                        <qqt-input  v-model="form.credentialName"></qqt-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <qqt-input v-model="form.remark"></qqt-input>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addClassification">确 定</el-button>
            </span>
            </el-dialog>
    </d2-container>
</template>

<script>
import { qqtTree, qqtInput } from '@/components/qqt-subassembly'
import { addCertificateClassification, getCertificateClassification, editCertificateClassification, delCertificateClassification } from '@api/officalDocument/classificationPersonalCertificates'
export default {
    components: {
        'qqt-tree': qqtTree,
        'qqt-input': qqtInput
    },

    data () {
        return {
            title: '个人证书类别或名称',
            btnTitle: {
                name: '新建个人证书类别或名称',
                icon: 'el-icon-folder-add'
            },
            defaultProps: {
                children: 'children',
                label: 'credentialName',
                value: 'id'
            },
            dialogVisible: false,
            dialogTitle: '',
            state: '',
            classificationData: {},
            form: {
                affiliationType: '0',
                credentialName: '',
                remark: '',
                parentId: ''
            },
            certificateClassificationData: []
        }
    },

    methods: {
        addCertificateClassificationEvent (boolean, data) {
            this.form.parentId = data.id
            this.state = '0'
            this.dialogVisible = true
            this.dialogTitle = '新建个人证书类别或名称'
            this.form.credentialName = this.form.remark = ''
        },
        
        getCertificateClassificationEvent () {
            getCertificateClassification({affiliationType:this.form.affiliationType}).then ( res => {
                if (res) this.certificateClassificationData = res
            })
        },

        editCertificateClassificationEvent(data) {
            this.state = '1'
            this.form = data
            this.dialogVisible = true
            this.dialogTitle = '编辑个人证书类别或名称'
        },

        delCertificateClassificationEvent (data) {
            if (data.children.length > 0) {
                this.$message.warning('该层级有子集，不可删除')
                return
            } else {
                delCertificateClassification ({id: data.id}).then( res => {
                    this.getCertificateClassificationEvent ()
                })
            }
            
        },
        addClassification () {
            let url = ''
            this.state == '0' ? url = addCertificateClassification : url = editCertificateClassification
            url(this.form).then ( res => {
                this.getCertificateClassificationEvent ()
                this.dialogVisible = false
            })
        }
    },
    created() {
        this.getCertificateClassificationEvent()
    }
}
</script>

<style lang="scss" scoped>
    .classification_personal_certificates_tree {
        width: 35%;
        background-color: #fff;
    }
</style>