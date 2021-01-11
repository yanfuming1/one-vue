<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" :title="name" width="60%" :before-close="handleClose">
        <fm-generate-form 
            :data="jsonData"
            :remote="remote"
            :value="values"
            :transform="transform"
            ref="generateForm"
            @on-change="selectGenerateChange"
        />
        <div class="add-archive-registration" v-show="filetype.indexOf ('0') !== -1">
            <div class="add-archive-registration-title">
                <div class="add-archive-registration-title___longString">
                    <p>原件</p>
                </div>
                <div class="add-archive-registration-title-right___transverseLine"></div>
            </div>
            <div class="add-archive-registration-content">
                <archive-registration-table :data="[archive]" :transform="transform" ref="original" :rowHeader="originalRowHeader" @returnData="getAddArchiveRegistrationData" />
            </div>
        </div>
        <div class="add-archive-registration" v-show="filetype.indexOf ('1') !== -1">
            <div class="add-archive-registration-title">
                <div class="add-archive-registration-title___longString">
                    <p>复印件</p>
                </div>
                <div class="add-archive-registration-title-right-copies___transverseLine"></div>
            </div>
            <div class="add-archive-registration-content">
                <archive-registration-table :data="[archive]" :transform="transform" ref="copies" :rowHeader="copiesRowHeader" @returnData="getAddArchiveRegistrationData" />
            </div>
        </div>
        <div class="add-archive-registration" v-show="filetype.indexOf ('2') !== -1">
            <div class="add-archive-registration-title">
                <div class="add-archive-registration-title___longString">
                    <p>电子文档</p>
                </div>
                <div class="add-archive-registration-title-right-electronic___transverseLine"></div>
            </div>
            <div class="add-archive-registration-content">
                <archive-registration-table :data="[archive]" :transform="transform" ref="electronicDocument" :rowHeader="electronicDocumentRowHeader" @returnData="getAddArchiveRegistrationData" />
            </div>
        </div>
        <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" v-if="!transform.isShowDetails" @click="saveArchiveRegistration">确 定</el-button>
            <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </el-dialog>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getArchiveRegistrationById, editArchiveRegistration, addArchiveRegistration } from '../../../../../api/administrativeManagement/archivesManagement/archiveRegistration'
    import { ADMINISTRATIVEMANAGEMENTDICTIONARY } from '../../../../../enum/DICTIONARY'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { queryDicById } from '../../../../../api/jointProject/index'
    import { upload } from '../../../../../components/qqt-subassembly'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'

    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import archiveRegistrationTable from './archiveRegistrationTable'
    export default {

        props: {
            dialogVisible: {
                type: Boolean,
                default: () => false
            },
            name: {
                type: String,
                default: () => '添加'
            },
            id: {
                type: String,
                default: () => ''
            },
            transform: {
                type: Object,
                default: () => {
                    return {
                        isShowDetails: true
                    }
                }
            },
            identification: {
                type: String,
                default: () => {
                    return ''
                }
            },
            proId: {
                type: String,
                default: () => {
                    return null
                }
            },
            projectName: {
                type: String,
                default: () => {
                    return null
                }
            }
        },

        components: {
            'archive-registration-table': archiveRegistrationTable,
            'print-template-by-html': printTemplateByHtml,
            'bottomInformation': bottomInformation,
            'up-load': upload
        },

        data () {
            return {
                archive: {
                    id: '',
                    c1: '',
                    c2: '',
                    c3: '',
                    c4: '',
                    cencoding: '',
                    cnumber: '',
                    copy: '',
                    createBy: '',
                    createTime: '',
                    cshare: '',
                    dencoding: '',
                    dnumber: '',
                    document: '',
                    documentType: '',
                    dshare: '',
                    encoding: '',
                    fileState: '',
                    filecategory: '',
                    storagemedium: '',
                    filetype: [],
                    name: '',
                    oencoding: '',
                    o1: '',
                    o2: '',
                    o3: '',
                    o4: '',
                    onumber: '',
                    original: '',
                    oshare: '',
                    remark: '',
                    secretlevel: '',
                    shelfLife: '',
                    storagepath: '',
                },
                values: {},
                filetype: [],
                jsonData: {},
                remote: {},
                originalRowHeader: [
                    {
                        prop: 'oencoding',
                        label: '编码',
                        isShow: true,
                        width: 80,
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'oshare',
                        label: '份数',
                        isShow: true,
                        width: 160,
                        align: 'center',
                        required: true,
                        children: [
                            {
                                value: 'oshare',
                                label: '份',
                                required: true
                            }
                        ]
                    },
                    {
                        prop: 'onumber',
                        label: '每份页数',
                        isShow: true,
                        width: 160,
                        align: 'center',
                        children: [
                            {
                                value: 'onumber',
                                label: '份/页',
                                required: true
                            }
                        ]
                    },
                    {
                        prop: 'storage',
                        label: '存放位置',
                        isShow: true,
                        align: 'center',
                        children: [
                            {
                                value: 'o1',
                                label: '室',
                                required: true
                            },
                            {
                                value: 'o2',
                                label: '柜',
                                required: true
                            },
                            {
                                value: 'o3',
                                label: '层',
                                required: true
                            },
                            {
                                value: 'o4',
                                label: '格',
                                required: true
                            }
                        ],
                        required: true
                    },
                    {
                        prop: 'o1',
                        isShow: false
                    },
                    {
                        prop: 'o2',
                        isShow: false
                    },
                    {
                        prop: 'o3',
                        isShow: false
                    },
                    {
                        prop: 'o4',
                        isShow: false
                    }
                ],
                copiesRowHeader: [
                    {
                        prop: 'cencoding',
                        label: '编码',
                        isShow: true,
                        width: 80,
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'cshare',
                        label: '份数',
                        isShow: true,
                        width: 160,
                        align: 'center',
                        children: [
                            {
                                value: 'cshare',
                                label: '份',
                                required: true
                            }
                        ]
                    },
                    {
                        prop: 'cnumber',
                        label: '每份页数',
                        isShow: true,
                        width: 160,
                        align: 'center',
                        children: [
                            {
                                value: 'cnumber',
                                label: '份/页',
                                required: true
                            }
                        ]
                    },
                    {
                        prop: 'storage',
                        label: '存放位置',
                        isShow: true,
                        align: 'center',
                        children: [
                            {
                                value: 'c1',
                                label: '室',
                                required: true
                            },
                            {
                                value: 'c2',
                                label: '柜',
                                required: true
                            },
                            {
                                value: 'c3',
                                label: '层',
                                required: true
                            },
                            {
                                value: 'c4',
                                label: '格',
                                required: true
                            },
                        ],
                        required: true
                    },
                    {
                        prop: 'c1',
                        isShow: false
                    },
                    {
                        prop: 'c2',
                        isShow: false
                    },
                    {
                        prop: 'c3',
                        isShow: false
                    },
                    {
                        prop: 'c4',
                        isShow: false
                    }
                ],
                electronicDocumentRowHeader: [
                    {
                        prop: 'dencoding',
                        label: '编码',
                        isShow: true,
                        width: 100,
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'dshare',
                        label: '份数',
                        isShow: true,
                        width: 160,
                        align: 'center',
                        children: [
                            {
                                value: 'dshare',
                                label: '份',
                                required: true
                            }
                        ]
                    },
                    {
                        prop: 'documentType',
                        label: '文件类型',
                        isShow: true,
                        width: 160,
                        align: 'center',
                        type: 'select',
                        required: true,
                        options: [
                            {
                                value: '1',
                                label: '音频'
                            },
                            {
                                value: '0',
                                label: '视频'
                            },
                            {
                                value: '2',
                                label: '图片'
                            },
                            {
                                value: '3',
                                label: '文件'
                            },
                            {
                                value: '4',
                                label: '其它'
                            }
                        ]
                    },
                    {
                        prop: 'storagepath',
                        label: '存放路径',
                        isShow: true,
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                ],
                upLoadFileDefaultList: [],
                code: BASICSCODE.ADMIN_FILE,
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.ADDARCHIVEREGISTRATION}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            handleClose () {
                this.$emit ('close')
            },

            saveArchiveRegistration () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        let required = this.verify ()
                        if (required) {
                            data.filetype = JSON.stringify (data.filetype)
                            Object.assign (this.archive, data, item)
                            if (this.identification === '1') {
                                this.archive.projectId = this.proId
                                this.archive.projectName = this.projectName
                            }
                            if (this.archive.id === '') {
                                addArchiveRegistration (this.archive).then (res => {
                                    if (res.code === 200) {
                                        this.$message.success ('保存成功')
                                        this.$emit ('close', true)
                                    }
                                })
                            } else {
                                editArchiveRegistration (this.archive).then (res => {
                                    if (res.code === 200) {
                                        this.$message.success ('修改成功')
                                        this.$emit ('close', true)
                                    }
                                })
                            }
                        }
                    }
                })
            },

            getArchiveRegistration (id) {
                getArchiveRegistrationById ({'id': id}).then (res => {
                    if (res) {
                        if (res.filetype && res.filetype.length !== 0) {
                            this.filetype = res.filetype = JSON.parse (res.filetype)
                        }
                        this.values = res
                        this.archive = JSON.parse (JSON.stringify (res))
                        if (res.fileList && res.fileList.length > 0) {
                            res.fileList.forEach(item => {
                                let m = {
                                    status : 'finished',
                                    response : {
                                        url : item.url,
                                        size: item.size,
                                        name: item.name
                                    }
                                }
                                this.upLoadFileDefaultList.push(m)
                            })
                        }
                    }
                })
            },

            selectGenerateChange (field, val, models) {
                switch (field) {
                    case 'filetype':
                        this.filetype = val
                        break
                }
            },

            verify () {
                let original = ''
                let copies = ''
                let electronicDocument = ''
                this.filetype.forEach(element => {
                    switch (element) {
                        case '0':
                            original = this.$refs.original.verify ()
                            break;
                        case '1':
                            copies = this.$refs.copies.verify ()
                            break;
                        case '2':
                            electronicDocument = this.$refs.electronicDocument.verify ()
                            break;
                    }
                });
                if (original === false || copies === false || electronicDocument === false) {
                    return false
                } else {
                    return true
                }
            },

            getAddArchiveRegistrationData (item) {
                console.log(item);
                this.archive = item
            },

            neatenData (data = []) {
                this.remote = {
                    getSecretLevel (resolve) {
                        resolve ([
                            {
                                value: '0',
                                label: '公开'
                            },
                            {
                                value: '3',
                                label: '秘密'
                            },
                            {
                                value: '1',
                                label: '机密'
                            },
                            {
                                value: '2',
                                label: '绝密'
                            }
                        ])
                    },
                    getStoragemedium (resolve) {
                        resolve ([
                            {
                                value: '1',
                                label: '纸质'
                            },
                            {
                                value: '2',
                                label: '光盘'
                            },
                            {
                                value: '3',
                                label: '磁盘'
                            },
                            {
                                value: '4',
                                label: 'U盘'
                            },
                            {
                                value: '5',
                                label: '移动硬盘'
                            },
                            {
                                value: '6',
                                label: '云盘'
                            },
                            {
                                value: '7',
                                label: '其他'
                            },
                        ])
                    },
                    getFileType (resolve) {
                        resolve (data)
                    },
                    getFileStorage (resolve) {
                        resolve ([
                            {
                                value: '0',
                                label: '原件'
                            },
                            {
                                value: '1',
                                label: '复印件'
                            },
                            {
                                value: '2',
                                label: '电子文档'
                            },
                        ])
                    }
                }
            },

            getQueryDicByIdList () {
                queryDicById ({'id': ADMINISTRATIVEMANAGEMENTDICTIONARY.FILETYPE}).then (res => {
                    if (res) {
                        this.neatenData (res)
                    }
                })
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.id}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            }
        },

        created() {
            this.getFormByJson ()
            this.getQueryDicByIdList ()
            if (this.id !== '') {
                this.getArchiveRegistration (this.id)
            }
        },

        watch: {
            id (val) {
                if (val != '') {
                    this.getArchiveRegistration (val)
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .add-archive-registration {
        padding: 15px 0 0 30px;
        .add-archive-registration-title {
            .add-archive-registration-title___longString {
                    display: inline-block;
                    border-left: 3px solid $color-text-title;
                    p {
                        color:  $color-text-title;
                        display: inline-block;
                        margin: 0px;
                        margin-left: 10px;
                    }
                }
            .add-archive-registration-title-right___transverseLine {
                width: 94.2%;
                top: -5px;
                border-top: solid $color-straight-line3 1px;
                display: inline-block;
                position: relative;
                right: -20px;
            }
            .add-archive-registration-title-right-copies___transverseLine {
                width: 92.88%;
                top: -5px;
                border-top: solid $color-straight-line3 1px;
                display: inline-block;
                position: relative;
                right: -20px;
            }
            .add-archive-registration-title-right-electronic___transverseLine {
                width: 91.55%;
                top: -5px;
                border-top: solid $color-straight-line3 1px;
                display: inline-block;
                position: relative;
                right: -20px;
            }
        }
        .add-archive-registration-content {
            padding: 10px 0;
        }
    }
</style>
