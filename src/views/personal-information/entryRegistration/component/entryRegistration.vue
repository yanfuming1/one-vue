<template>
    <d2-container type="fulls" class="conent">
        <el-card class="box-card closeHeader">
            <div slot="header" v-if="showCancelBtn">
                <el-button type="text" @click="closeEnrollmentPage"><i class="el-icon-close"></i></el-button>
            </div>
            <fm-generate-form :data="jsonData" :remote="remote" :value="values" ref="generateForm" @on-change="selectGenerateChange":transform="transform" />
            <bottom-information :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
            <div class="qqt-container-full-content___button" v-if="bottomBtn">
                <div class="button" v-if="!transform.isShowDetails">
                    <el-button type="primary" size="mini" @click="saveEntryRegistration">保存</el-button>
                    <el-button size="mini" @click="closeTag">取消</el-button>
                </div>
                <div class="button" v-else>
                    <el-button type="primary" size="mini" @click="editEntryRegistration">编辑</el-button>
                    <el-button size="mini" @click="closeEnrollmentPage">关闭</el-button>
                </div>
            </div>
            <div class="qqt-container-full-content___button" v-else>
                <el-button type="info" v-if="transform" @click="printTemplate">打印</el-button>
                <el-button size="mini" @click="closeEnrollmentPage">关闭</el-button>
            </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
import { getDictionaryQueryById } from '../../../../api/system/dataDictionary/dataDictionaries'
import { addEntryRegistration, getEntryRegistrationQueryById, editEnrollment } from '../../../../api/personal-information/entryRegistration'
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { DATADICTIONARY } from '../../../../enum/DICTIONARY'
import { PERSONALCENTER } from '../../../../enum/FORMCODE'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import { mapActions } from 'vuex'
import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'

import util from '@/libs/util.js'
export default {
    name: 'entryRegistration',
    components: {
        'bottom-information': bottomInformation,
        'print-template-by-html': printTemplateByHtml

    },
    props: {
        identification: {
            type: Boolean,
            default: false
        },

    },

    data () {
        return {
            values: {
                memberList: [],
                educationList: [],
                careerCertificateList: [],
                workExperienceList: []
            },
            bottomBtn: true,
            jsonData: {},
            showCancelBtn: true,
            remote: {
                getMarital (resolve) {
                    resolve ([
                        {
                            id: '1',
                            name: '未婚'
                        },
                        {
                            id: '2',
                            name: '已婚'
                        }
                    ])
                },

                getSex (resolve) {
                    resolve ([
                        {
                            id: '1',
                            name: '男'
                        },
                        {
                            id: '2',
                            name: '女'
                        }
                    ])
                },
                getPolitics (resolve) {
                    resolve ([
                        {
                            id: '1',
                            name: '党员'
                        },
                        {
                            id: '2',
                            name: '团员'
                        },
                        {
                            id: '3',
                            name: '群众'
                        }
                    ])
                },
                getRelation (resolve) {
                    resolve ([
                        {
                            value: '1',
                            label: '父子'
                        },
                        {
                            value: '2',
                            label: '父女'
                        },
                        {
                            value: '3',
                            label: '母子'
                        },
                        {
                            value: '4',
                            label: '母女'
                        },
                        {
                            value: '5',
                            label: '夫妻'
                        },
                        {
                            value: '6',
                            label: '兄弟'
                        },
                        {
                            value: '7',
                            label: '姐妹'
                        },
                        {
                            value: '8',
                            label: '其他'
                        }
                    ])
                },
                getStudy (resolve) {
                    resolve ([
                        {
                            value: '1',
                            label: '全日制'
                        },
                        {
                            value: '2',
                            label: '非全日制'
                        }
                    ])
                },
                getLearningHierarchy (resolve) {
                    resolve ([
                        {
                            value: '1',
                            label: '高中'
                        },
                        {
                            value: '2',
                            label: '中专'
                        },
                        {
                            value: '3',
                            label: '大专'
                        },
                        {
                            value: '4',
                            label: '本科'
                        }, {
                            value: '5',
                            label: '研究生'
                        },
                        {
                            value: '6',
                            label: '博士'
                        }
                    ])
                },
                getLearningSequence (resolve) {
                    resolve ([
                        {
                            value: '1',
                            label: '第一学历'
                        },
                        {
                            value: '2',
                            label: '第二学历'
                        }, {
                            value: '3',
                            label: '第三学历'
                        },
                        {
                            value: '4',
                            label: '第四学历'
                        }, {
                            value: '5',
                            label: '第五学历'
                        }
                    ])
                }
            },
            
            transform: {
                isShowDetails: false
            },

            code: BASICSCODE.HR_ENTRY
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getFormByJson () {                    
            formGetJson ({'code': PERSONALCENTER.ENTRYREGISTRATION}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },
        
        editEntryRegistration () {
            this.transform.isShowDetails = false
        },

        // 保存
        saveEntryRegistration () {
            let info = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData ().then (data => {
                if (data && info) {
                    Object.assign (this.values, data, info)
                    let url = ''
                    this.values.id == null ? url = addEntryRegistration : url = editEnrollment
                    url (this.values).then ( res => {
                        this.$message.success(res.message)
                        this.transform.isShowDetails = true
                        if (this.identification) {
                            let tagName = this.$route.path
                            let path = '/index'
                            this.close ({ tagName, path})
                        }
                    })
                }
            })
        },
        // 查询详情
        getEntryRegistration () {
            let item = this.$route.query.isShowElement
            if (item === undefined) {
                this.transform.isShowDetails = !this.identification
            } else {
                this.transform.isShowDetails = !item
            }
            // 如果是详情时，调用通过 行Id 查询接口
            let id = ''
            if (this.$route.params.isDetail != null) {
                id = this.$route.params.rowData.id
                this.bottomBtn = false
            } else {
                id = util.cookies.get ('uuid')
            }
            getEntryRegistrationQueryById ({'id': id}).then ( res => {
                this.values = res
                res.procState == '1' ? this.bottomBtn = false : true
            })
        },

        // 表单下拉数据操作
        selectGenerateChange (field, val, models) {
            switch (field) {
                case 'idNumber':
                    let number = ''
                    let timestamp = ''
                    let oldYear = 0
                    let newYear = 0
                    if (val.length === 18) {
                        number = val.substring (6, 14)
                        number = number.substring (0, 4) + '/' + number.substring (4, number.length)
                        number = number.substring (0, 7) + '/' + number.substring (7, number.length)
                        timestamp = new Date(number)
                        oldYear = timestamp.getFullYear ()
                        newYear = new Date ().getFullYear ()
                        models.birthday = new Date(timestamp).format ('yyyy-MM-dd')
                        models.age = newYear - oldYear
                    }
                    break
            }
        },

        closeTag () {
            let path = ''
            let tagName = this.$route.path
            tagName == '/personal-information/entryRegistration' ? this.transform.isShowDetails = true : path = '/login'
            this.close ({ tagName, path})
        },

        // 关闭操作
        closeEnrollmentPage () {
            let id = this.$route.query.id ? '?id=' + this.$route.query.id : ''
            let tagName = this.$route.path + id
            let path = ''
            if( this.$route.params.isDetail ) {
                path = '/personnelManagement/personnelManagementModule'
            } else {
                path = 'personal-data'
            }
            this.close ({ tagName, path })
        },

        printTemplate () {
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.rowData.id}).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        }

    },

    created () {
        this.getFormByJson ()
        if (this.$route.fullPath === '/phoneRequired') {
            this.showCancelBtn = false
        } else {
            this.getEntryRegistration ()
        }
    }
    
}
</script>

<style lang='scss' scoped>

     .entry-registration{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        height: 98%;
        padding: 20px;
        overflow-x: hidden;
        background: $color-bg3;
    }
    
    .button {
        text-align: center;
        margin: 12px 0
    }

</style>
