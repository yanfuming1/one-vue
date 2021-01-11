<template>
    <el-container class="fm2-container">
        <el-main class="fm2-main">
            <el-container>
                <el-aside width="250px">
                    <div class="components-list">
                        <template v-if="basicFields.length">
                            <div class="widget-cate">基础字段</div>
                            <draggable tag="ul" :list="basicComponents"
                                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                                @end="handleMoveEnd"
                                @start="handleMoveStart"
                                :move="handleMove"
                              >
                                <li @click="handleField(item)" v-if="basicFields.indexOf(item.type)>=0" class="form-edit-widget-label" :class="{'no-put': item.type == 'divider'}" v-for="(item, index) in basicComponents" :key="index">
                                    <a>
                                        <i class="icon iconfont" :class="item.icon"></i>
                                        <span>{{item.name}}</span>
                                    </a>
                                </li>
                            </draggable>
                        </template>
                        <template v-if="advanceFields.length">
                            <div class="widget-cate">高级字段</div>
                            <draggable tag="ul" :list="advanceComponents"
                                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                                @end="handleMoveEnd"
                                @start="handleMoveStart"
                                :move="handleMove"
                            >
                                <li @click="handleField(item)" v-if="advanceFields.indexOf(item.type) >= 0" class="form-edit-widget-label" :class="{'no-put': item.type == 'table'}" v-for="(item, index) in advanceComponents" :key="index">
                                    <a>
                                        <i class="icon iconfont" :class="item.icon"></i>
                                        <span>{{item.name}}</span>
                                    </a>
                                </li>
                            </draggable>
                        </template>
                        <template v-if="layoutFields.length">
                            <div class="widget-cate">布局字段</div>
                            <draggable tag="ul" :list="layoutComponents"
                                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                                @end="handleMoveEnd"
                                @start="handleMoveStart"
                                :move="handleMove"
                            >
                              <li @click="handleField(item)" v-if="layoutFields.indexOf(item.type) >=0" class="form-edit-widget-label no-put" v-for="(item, index) in layoutComponents" :key="index">
                                  <a>
                                      <i class="icon iconfont" :class="item.icon"></i>
                                      <span>{{item.name}}</span>
                                  </a>
                              </li>
                            </draggable>
                        </template>
                    </div>
                </el-aside>
                <el-container class="center-container" direction="vertical">
                    <el-header class="btn-bar" style="height: 45px;">
                        <slot name="action">
                        </slot>
                        <el-button type="text" :disabled="!undo" size="medium" icon="el-icon-back" @click="handleUndo">撤销</el-button>
                        <el-button type="text" :disabled="!redo" size="medium" icon="el-icon-right" @click="handleRedo">恢复</el-button>

                        <el-button v-if="upload" type="text" size="medium" icon="el-icon-upload2" @click="handleUpload">导入JSON</el-button>
                        <el-button v-if="clearable" type="text" size="medium" icon="el-icon-delete" @click="handleClear">清空</el-button>
                        <el-button v-if="preview" type="text" size="medium" icon="el-icon-view" @click="handlePreview">预览</el-button>
                        <!-- <el-button v-if="generateJson" type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">查看JSON</el-button>
                        <el-button v-if="generateCode" type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">生成代码</el-button> -->
                        <el-button type="text" size="medium" icon="el-icon-document" @click="saveFormData">保存表单</el-button>
                        <el-button type="text" size="medium" icon="el-icon-close" @click="closePage">关闭</el-button>
                    </el-header>
                    <el-main :class="{'widget-empty': widgetForm.list.length == 0}">
                        <widget-form v-if="!resetJson"  ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
                    </el-main>
                </el-container>

                <el-aside class="widget-config-container">
                    <el-container>
                        <el-header height="45px">
                            <div class="config-tab" :class="{active: configTab == 'widget'}" @click="handleConfigSelect('widget')">字段属性</div>
                            <div class="config-tab" :class="{active: configTab == 'form'}" @click="handleConfigSelect('form')">表单属性</div>
                        </el-header>
                        <el-main class="config-content">
                            <widget-config v-show="configTab == 'widget'" :data="widgetFormSelect"></widget-config>
                            <form-config v-show="configTab == 'form'" :data="widgetForm.config"></form-config>
                        </el-main>
                      </el-container>
                </el-aside>
                <cus-dialog
                    :visible="previewVisible"
                    @on-close="previewVisible = false"
                    ref="widgetPreview"
                    width="1000px"
                    form
                >
                    <generate-form insite="true" v-if="previewVisible" :data="widgetForm" :isCreated="true" :value="widgetModels" :transform="transform" :remote="remoteFuncs" ref="generateForm">
                        <template v-slot:blank="scope">
                            宽度：<el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                            高度：<el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                        </template>

                        <template v-slot:abc="scope">
                            宽度：<el-input v-model="scope.model.abc" style="width: 100px"></el-input>
                        </template>
                    </generate-form>
                    <template slot="action">
                        <el-button type="primary" @click="handleTest">获取数据</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </template>
                </cus-dialog>
                <cus-dialog
                    :visible="jsonVisible"
                    @on-close="jsonVisible = false"
                    ref="jsonPreview"
                    width="800px"
                    form>
                    <div id="jsoneditor" style="height: 400px;width: 100%;">{{jsonTemplate}}</div>
                    <template slot="action">
                        <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">复制数据</el-button>
                    </template>
                </cus-dialog>
                <!-- <cus-dialog
                    :visible="uploadVisible"
                    @on-close="uploadVisible = false"
                    @on-submit="handleUploadJson"
                    ref="uploadJson"
                    width="800px"
                    form>
                    <el-alert type="info" title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可"></el-alert>
                    <div id="uploadeditor" style="height: 400px;width: 100%;">{{jsonEg}}</div>
                </cus-dialog>
                <cus-dialog
                    :visible="codeVisible"
                    @on-close="codeVisible = false"
                    ref="codePreview"
                    width="800px"
                    form
                    :action="false">
                    <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div>
                </cus-dialog> -->
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'
import Clipboard from 'clipboard'
import { mapActions } from 'vuex'
import { EventBus } from '../util/event-bus.js'

// import 'ace-builds/webpack-resolver' // 在 webpack 环境中使用必须要导入
import {basicComponents, layoutComponents, advanceComponents} from './componentsConfig.js'
import generateCode from './generateCode.js'
import historyManager from '../util/history-manager.js'

export default {

    name: 'fm-making-form',
    
    components: {
        Draggable,
        WidgetConfig,
        FormConfig,
        WidgetForm,
        CusDialog,
        GenerateForm
    },
    
    props: {
        preview: {
            type: Boolean,
            default: false
        },
        generateCode: {
            type: Boolean,
            default: false
        },
        generateJson: {
            type: Boolean,
            default: false
        },
        upload: {
            type: Boolean,
            default: true
        },
        clearable: {
            type: Boolean,
            default: false
        },
        basicFields: {
            type: Array,
            default: () => ['input', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'rate', 'color', 'select', 'switch', 'slider', 'text']
        },
        advanceFields: {
            type: Array,
            default: () => ['blank', 'fileupload', 'imgupload', 'editor', 'cascader', 'table']
        },
        layoutFields: {
            type: Array,
            default: () => ['grid', 'tabs', 'divider']
        }
    },

    data () {
        return {
            basicComponents,
            layoutComponents,
            advanceComponents,
            resetJson: false,
            widgetForm: {
                list: [],
                config: {
                    labelWidth: 100,
                    labelPosition: 'right',
                    size: 'small',
                    customClass: '',
                    layout: 'horizontal',
                    labelCol: 3
                },
            },
            configTab: 'widget',
            widgetFormSelect: null,
            previewVisible: false,
            jsonVisible: false,
            codeVisible: false,
            uploadVisible: false,
            transform: {
                isShowDetails: false
            },
            remoteFuncs: {
                func_test (resolve) {
                    setTimeout(() => {
                        const options = [
                          {id: '1', name: '1111'},
                          {id: '2', name: '2222'},
                          {id: '3', name: '3333'}
                        ]

                      resolve(options)
                  }, 2000)
                },

                // funcGetToken (resolve) {
                //   request.get('http://tools-server.xiaoyaoji.cn/api/uptoken').then(res => {
                //     resolve(res.uptoken)
                //   })
                // },

                upload_callback (response, file, fileList) {
                    console.log('callback', response, file, fileList)
                },
            },
            widgetModels: {},
            blank: '',
            jsonTemplate: '',
            uploadEditor: null,
            jsonCopyValue: '',
            jsonClipboard: null,
            jsonEg: `{
               "list": [],
                "config": {
                    "labelWidth": 100,
                    "labelPosition": "right",
                    "size": "small",
                    "customClass": "",
                    "ui": "element",
                    "layout": "horizontal",
                    "labelCol": 3
                }
            }`,
            undo: false,
            redo: false
        }
    },

    mounted () {
        const _this = this
        historyManager.clear().then(() => {
            EventBus.$on('on-history-add', () => {
                console.log('xxx', this.widgetFormSelect)
                historyManager.add(this.widgetForm, (this.widgetFormSelect && this.widgetFormSelect.key) ? this.widgetFormSelect.key : '').then(() => {
                    _this.undo = true
                    _this.redo = false
                })
            })
        })
    },

    methods: {
        ...mapActions('d2admin/page', [
            'close',
        ]),

        handleConfigSelect (value) {
            this.configTab = value
        },

        handleMoveEnd (evt) {
            // console.log('end', evt)
        },

        handleMoveStart ({oldIndex}) {
            // console.log('start', oldIndex, this.basicComponents)
        },

        handleMove () {
            return true
        },

        handlePreview () {
            this.previewVisible = true
        },

        handleReset () {
            this.$refs.generateForm.reset()
        },

        handleTest () {
            this.$refs.generateForm.getData().then(data => {
                this.jsonVisible = true
                this.jsonTemplate = data
                this.$nextTick(() => {
                  // const editor = ace.edit('jsoneditor')
                  // editor.session.setMode("ace/mode/json")

                    if (!this.jsonClipboard) {
                        this.jsonClipboard = new Clipboard('.json-btn')
                        this.jsonClipboard.on('success', (e) => {
                            this.$message.success('复制成功')
                        })
                    }
                    this.jsonCopyValue = JSON.stringify(data)
                })
                this.$refs.widgetPreview.end()
            }).catch(e => {
                this.$refs.widgetPreview.end()
            })
        },

        handleClear () {
            this.widgetForm = {
                list: [],
                config: {
                    labelWidth: 100,
                    labelPosition: 'right',
                    size: 'small',
                    customClass: ''
                },
            }
            this.widgetFormSelect = {}
        },

        handleField (item) {
            EventBus.$emit('on-field-add', item)
        },

        handleUndo () {
            historyManager.updateLatest(this.widgetForm, (this.widgetFormSelect && this.widgetFormSelect.key) ? this.widgetFormSelect.key : '').then(() => {
                historyManager.undo().then((data) => {
                this.widgetForm = {...data.data}
                // this.widgetFormSelect = this.widgetForm.list.length ? this.widgetForm.list[0] : {}
                console.log('bbb',this, this._findWidgetItem(this.widgetForm.list, data.key))
                this.widgetFormSelect = this._findWidgetItem(this.widgetForm.list, data.key)
                this.undo = data.undo
                this.redo = data.redo
                })
            })
        },
        handleRedo () {
            historyManager.redo().then((data) => {
                this.widgetForm = {...data.data}
                this.widgetFormSelect = this._findWidgetItem(this.widgetForm.list, data.key)

                this.undo = data.undo
                this.redo = data.redo
            })
        },

        _findWidgetItem (list, key) {
            const index = list.findIndex(item => item.key == key)
            
            if (index >= 0) {
                return list[index]
            } else {
                for (let m = 0; m < list.length; m++) {
                const item = list[m]

                if (item.type === 'grid') {

                    for (let i = 0; i < item.columns.length; i++) {
                    return this._findWidgetItem(item.columns[i].list, key)
                    }
                }
                if (item.type === 'table') {
                    return this._findWidgetItem(item.tableColumns, key)
                }
                if (item.type === 'tabs') {

                    for (let i = 0; i < item.tabs.length; i++) {
                    return this._findWidgetItem(item.tabs[i].list, key)
                    }
                }
                }

                return {}
            }
        },

        saveFormData() {
            this.$emit('saveFormData',this.getJSON())
        },

        getJSON () {
            return this.widgetForm
        },

        getHtml () {
            return generateCode(JSON.stringify(this.widgetForm))
        },

        setJSON (json) {
            if (typeof json === 'string') {
                json = JSON.parse(json)
            }

            this.widgetForm = json

            if (json.list.length> 0) {
                this.widgetFormSelect = json.list[0]
            }

            this.$nextTick(() => {         EventBus.$emit('on-history-add')       })
        },

        handleInput (val) {
            this.blank = val
        },

        handleUpload () {
            this.uploadVisible = true
        },

        closePage () {
            let tagName = this.$route.path
            let path = '/systemManagement/fromManagement'
            this.close ({ tagName, path })
        }
    },

    watch: {
        widgetForm: {
            deep: true,
            handler: function (val) {
              // console.log(this.$refs.widgetForm)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.widget-empty{
    background-position: 50%;
}

.custom1 .el-col{
    border: 1px solid #ccc;
    overflow: hidden;
    padding: 5px;
    // margin-right:-1px;
    // margin-bottom:-1px;
    margin-right: -1px;
    margin-bottom: -1px;
}
.custom .el-col{
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
}

</style>
