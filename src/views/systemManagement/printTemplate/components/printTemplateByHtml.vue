<template>
	<div class="print_template_container">
		<el-container class="print_template_main" style="height: 100vh;">
			<el-aside width="240px">
				<el-row>
					<el-col :span="24" class="rect-printElement-types hiprintEpContainer">
						<el-row class="drag_item_title">组件列表</el-row>
						<el-row style="height: 100px;">
							<el-col :span="12" class="drag_item_box">
								<div>
									<a class="ep-draggable-item" tid="defaultModule.text">
										<span class="iconfont iconwenzi" aria-hidden="true"></span>
										<p>文本</p>
									</a>
								</div>
							</el-col>
							<el-col :span="12" class="drag_item_box">
								<div>
									<a class="ep-draggable-item" tid="defaultModule.longText">
										<span class="iconfont iconwenbenyu" aria-hidden="true"></span>
										<p>长文</p>
									</a>
								</div>
							</el-col>
						</el-row>
						<el-row style="height: 100px;" v-for="(item, index) in twoDimensionList" :key="index">
							<el-col :span="12" v-for="(list, index) in item" :key="index" class="drag_item_box">
								<div>
									<a class="ep-draggable-item" :tid="list.tid">
										<span class="el-icon-s-grid" aria-hidden="true"></span>
										<p>{{ list.title }}</p>
									</a>
								</div>
							</el-col>
						</el-row>
						<el-row class="drag_item_title">自定义列表</el-row>
						<el-row style="height: 100px;">
							<el-col :span="12" class="drag_item_box">
								<div>
									<a class="ep-draggable-item" tid="defaultModule.customText">
										<span class="el-icon-document" aria-hidden="true"></span>
										<p>自定义文本</p>
									</a>
								</div>
							</el-col>
							<el-col :span="12" class="drag_item_box">
								<div>
									<a class="ep-draggable-item" tid="defaultModule.customLongText">
										<span class="el-icon-document" aria-hidden="true"></span>
										<p>自定义长文</p>
									</a>
								</div>
							</el-col>
						</el-row>
						<el-row class="drag_item_title">辅助列表</el-row>
						<el-row style="height: 100px;">
							<el-col :span="12" class="drag_item_box">
								<div>
									<a class="ep-draggable-item" tid="defaultModule.hline">
										<span class="iconfont iconxian" aria-hidden="true"></span>
										<p>横线</p>
									</a>
								</div>
							</el-col>
							<el-col :span="12" class="drag_item_box">
								<div>
									<a class="ep-draggable-item" tid="defaultModule.vline">
										<span class="iconfont iconxian" aria-hidden="true"></span>
										<p>竖线</p>
									</a>
								</div>
							</el-col>
						</el-row>
						<el-row style="height: 100px;">
							<el-col :span="12" class="drag_item_box">
								<div>
									<a class="ep-draggable-item" tid="defaultModule.rect">
										<span class="iconfont iconfangkuang" aria-hidden="true"></span>
										<p>矩形</p>
									</a>
								</div>
							</el-col>
							<el-col :span="12" class="drag_item_box">
								<div>
									<a class="ep-draggable-item" tid="defaultModule.oval">
										<span class="iconfont iconyuancircle46" aria-hidden="true"></span>
										<p>椭圆</p>
									</a>
								</div>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-aside>
			<el-container>
				<el-header>
					<el-row>
						<el-col :span="24">
							<el-button-group>
								<el-button size="small" :type="currentPaperType === 'A3' ? 'primary' : 'info'" @click="setPaper('A3')">A3</el-button>
								<el-button size="small" :type="currentPaperType === 'A4Vertical' ? 'primary' : 'info'" @click="setPaper('A4Vertical')">A4(竖)</el-button>
								<el-button size="small" :type="currentPaperType === 'A4Across' ? 'primary' : 'info'" @click="setPaper('A4Across')">A4(横)</el-button>
								<el-button size="small" :type="currentPaperType === 'A5' ? 'primary' : 'info'" @click="setPaper('A5')">A5</el-button>
								<el-button size="small" :type="currentPaperType === 'B3' ? 'primary' : 'info'" @click="setPaper('B3')">B3</el-button>
								<el-button size="small" :type="currentPaperType === 'B4' ? 'primary' : 'info'" @click="setPaper('B4')">B4</el-button>
								<el-button size="small" :type="currentPaperType === 'B5' ? 'primary' : 'info'" @click="setPaper('B5')">B5</el-button>
							</el-button-group>
							<el-button-group>
								<el-button type="info" size="small" icon="el-icon-refresh-right" @click="rotatePaper">旋转</el-button>
								<el-button type="info" size="small" icon="el-icon-delete" @click="clearTemplate">清空</el-button>
							</el-button-group>
							<el-button-group>
								<el-button type="info" size="small" icon="el-icon-view" @click="previewTemplate">快速预览</el-button>
								<el-button type="info" size="small" icon="el-icon-document" @click="getJson">预览JSON</el-button>
								<el-button type="info" size="small" icon="el-icon-tickets" @click="getHtml">预览HTML</el-button>
							</el-button-group>
							<el-button-group>
								<el-button type="info" size="small" icon="el-icon-printer" @click="printTemplate (printData)">打印</el-button>
								<el-button type="info" size="small" icon="el-icon-folder-add" @click="savePrintTemplate">保存</el-button>
								<el-button type="info" size="small" icon="el-icon-delete" @click="closePageTag">关闭</el-button>
							</el-button-group>
						</el-col>
					</el-row>
				</el-header>
				<el-main>
					<el-row>
						<el-col
							style="padding: 20px"
							:span="18"
							id="hiprint-printTemplate"
							class="hiprint-printTemplate"
						></el-col>
						<el-col :span="6" style="display:none" class="params_setting_container">
							<el-row class="hinnn-layout-sider" style="padding: 10px;">
								<div id="PrintElementOptionSetting"></div>
							</el-row>
						</el-col>
					</el-row>

					<el-drawer
						size="100%"
						class="params_drawer"
						:title="paramsDrawerTitle"
						:modal="false"
						:wrapperClosable="true"
						@opened="handleParamsOpened"
						:visible.sync="paramsDrawerStatus"
						direction="rtl"
					>
						<h4 slot="title">参数设置: {{ paramsDrawerTitle }}</h4>
						<div id="params_content"></div>
					</el-drawer>
				</el-main>
			</el-container>
		</el-container>

		<el-dialog
			class="preview_dialog"
			ref="previewDialog"
			title="快速预览"
			@opened="handlePreviewOpened()"
			:width="currentPaper.width * 1 + 'mm'"
			:visible.sync="previewDialogStatus"
		>
			<div id="preview_content"></div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="previewDialogStatus = false">取 消</el-button>
				<el-button type="primary" @click="previewDialogStatus = false">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog
			ref="infoDialog"
			:title="infoDialogTitle"
			:lock-scroll="true"
			:visible.sync="infoDialogStatus"
		>
			<el-input
				type="textarea"
				:readonly="true"
				:autosize="{ minRows: 15}"
				placeholder="请输入内容"
				v-model="infoTextarea"
			></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="infoDialogStatus = false">取 消</el-button>
				<el-button type="primary" @click="infoDialogStatus = false">复 制</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>

import '@/assets/hiprint/polyfill.min.js'
import '@/assets/hiprint/plugins/jquery.minicolors.min.js'
import '@/assets/hiprint/plugins/jquery.hiwprint.js'

import defaultElementType from '@/assets/hiprint/plugins/default-etype-provider.js'

import { hiprint } from '@/assets/hiprint/hiprint.bundle.js'
import { TEMPLATECODE, BASICSCODE } from '@/enum/PRINTTEMPLATE.js'
import { editPrintTemplate, getPrintTemplateQueryById, getPrintTemplateQueryByTableCode } from '../../../../api/system/printTemplate'
import { tablePrintJson } from '@/assets/hiprint/custom_test/custom-print-json'
import { mapActions } from 'vuex'

const basics = {
	editable: true,
	columnResizable: true,
	columnAlignEditable: true,
	columnDisplayEditable: true,
	columnDisplayIndexEditable: true,
}

export default {
	
	props: {
		code: {
			type: String,
			default: () => ''
		},

		printHeader: {
			type: Object || Array,
			default: () => ({})
		}
	},

	data() {
		return {
			tableCode: this.code,
			printData: {},
			customPrintJson: {},
			hiprintTemplate: {},
			dataOrigin: {},
			previewDialogStatus: false,
			paramsDrawerStatus: false,
			infoDialogStatus: false,
			infoTextarea: '',
			infoDialogTitle: '',
			paramsDrawerTitle: '',
			previewHtml: null,
			paperMap: {
				A3: {
					width: 420,
					height: 296.6
				},
				A4Vertical: {
					width: 210,
					height: 296.6
				},
				A4Across: {
					width: 296.6,
					height: 210
				},
				A5: {
					width: 210,
					height: 147.6
				},
				B3: {
					width: 500,
					height: 352.6
				},
				B4: {
					width: 250,
					height: 352.6
				},
				B5: {
					width: 250,
					height: 175.6
				}
			},
			currentPaper: {
				width: null,
				height: null
			},
			tableList: [],
			twoDimensionList: []
		}
	},

	computed: {
		
		// 处理当前选中纸张
		currentPaperType () {
			let paper = null;
			for (const key in this.paperMap) {
				let item = this.paperMap[key]
				let { width, height } = this.currentPaper
				if (item.width === width && item.height === height) {
					paper = key
				}
			}

			return paper
		}
	},

	methods: {

		...mapActions ('d2admin/page', [
			'close',
		]),

		// 设置纸张属性
		setCurrentPaper (obj) {
			let { width, height } = obj;
			this.currentPaper.width = width;
			this.currentPaper.height = height;
			this.hiprintTemplate.addPrintPanel({ paperFooter: 340, paperHeader: 10 });
        },
        
		// 设置纸张大小
		setPaper (type, width, height) {
			try {
				if (type === 'other') {
					this.hiprintTemplate.setPaper(width, height);
					this.setCurrentPaper({ width: width, height: height})
				} else {
					this.hiprintTemplate.setPaper(type, null);
					this.setCurrentPaper(this.paperMap[type])
				}
			} catch (error) {
				this.$message({
					message: '操作失败:' + error,
					type: 'error'
				});
			}
		},
        
        // 旋转
		rotatePaper () {
			try {
				this.hiprintTemplate.rotatePaper();
			} catch (error) {
				this.$message({
					message: '操作失败:' + error,
					type: 'error'
				});
			}
		},
        
        // 清除配置
		clearTemplate () {
			try {
				this.hiprintTemplate.clear();
			} catch (error) {
				this.$message({
					message: '操作失败:' + error,
					type: 'error'
				});
			}
		},
        
        // 快速预览
		previewTemplate () {
			this.previewDialogStatus = true;
		},
        
        // 打开预览dialog回调
		handlePreviewOpened () {
			$('#preview_content').html(this.hiprintTemplate.getHtml(this.printData))
		},
        
        // 打印
		printTemplate (data) {
			let item = this.tableCode != BASICSCODE.TABLE_PRINT ? this.updataToLowerCaseObj (data) : data
			this.hiprintTemplate.print (item)
		},

		updataToLowerCaseObj (obj) {
			let key, keys = Object.keys(obj)
			let n = keys.length
			let newObj = {}
			while (n--) {
				key = keys[n];
				newObj[key.toLowerCase()] = obj[key]
			}
			return newObj
		},
        
        // 设置element click事件监听
		elementAddEventListen() {
			window.hinnn.event.on(this.hiprintTemplate.getPrintElementSelectEventKey (), t => {
				this.paramsDrawerTitle = t.printElement.printElementType.title
				this.paramsDrawerStatus = true
			})
		},
        
        // 参数设置drawer回调,将参数设置dom添加到弹出层中
		handleParamsOpened () {
			$('#params_content').append($('.hinnn-layout-sider'))
		},
        
        // 获取配置JSON
		getJson () {
			this.infoTextarea = JSON.stringify(this.hiprintTemplate.getJson()['panels'])
			this.infoDialogTitle = '预览JSON'
			this.infoDialogStatus = true;
		},
        
        // 获取配置HTML
		getHtml () {
			this.infoTextarea = this.hiprintTemplate.getHtml(this.printData)[0].outerHTML
			this.infoDialogTitle = '预览HTML'
			this.infoDialogStatus = true;
		},

		savePrintTemplate () {
			let list = this.hiprintTemplate.getJson()['panels'][0]
			let data = { panels: [list] }
			this.dataOrigin['html'] = JSON.stringify(data)
			editPrintTemplate (this.dataOrigin).then (res => {
				if (res.code == 200) {
					this.$message.success (res.message)
					this.closePageTag ()
				}
			})
		},

		closePageTag () {
			let tagName = `${this.$route.path}?code=${this.tableCode}`
			let path = `/systemManagement/printTemplate`
			this.close ({tagName, path})
		},

		initPrintTemplate () {
			let data = defaultElementType.defaultElementTypeProvider ()

			//初始化打印插件
			hiprint.init({
				providers: [new data ()]
			});

			//设置左侧拖拽事件
			hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
			this.hiprintTemplate = new hiprint.PrintTemplate({
				template: this.customPrintJson,
				settingContainer: '#PrintElementOptionSetting',
				paginationContainer: '.hiprint-printPagination'
			})
			
			//打印设计
			this.hiprintTemplate.design('#hiprint-printTemplate')
			this.setCurrentPaper(this.tableCode == BASICSCODE.TABLE_PRINT ? this.paperMap.A4Across : this.paperMap.A4Vertical);
			this.elementAddEventListen ()
			$('.params_drawer').width($('.params_setting_container').width() * 1) //动态设置右部参数设置框宽度
		
			document.onkeydown = e => {
				let _key = window.event.keyCode;
				if(_key == 46){
					$('.hiprint-option-item-deleteBtn').click();
				}
			}
		},

		getPrintTemplateByCode (code) {
			getPrintTemplateQueryById ({'id': code}).then (res => {
				if (res) {
					this.dataOrigin = res
					if (res && res.html) {
						this.customPrintJson = JSON.parse (res.html)
						if (this.printHeader instanceof Object) {
							this.updateObjectPrintTemplate ()
						}
						if (this.printHeader instanceof Array) {
							this.updateArrayPrintTemplate ()
						}
					}
					this.updataLeftShortcutBar (res.fieldJson)
				}
			})
		},

		updateObjectPrintTemplate () {
			if (this.customPrintJson.panels && this.customPrintJson.panels[0].printElements.length > 0) {
				this.customPrintJson.panels[0].printElements.forEach (res => {
					if (res.tid === this.printHeader.key) res.options.columns = this.printHeader.value
				})
			}
		},

		updateArrayPrintTemplate () {
			if (this.customPrintJson.panels && this.customPrintJson.panels[0].printElements.length > 0) {
				this.printHeader.forEach (res => {
					let item = this.customPrintJson.panels[0].printElements.find (f => f.tid === res.key)
					if (item) item.options.columns = res.value
				})
			}
		},

		updataLeftShortcutBar (res = []) {
			let item = defaultElementType.getDefaultElementType ()
			if (res && res.length > 0) {
				res.forEach (f => { f.field = f.field.toLowerCase () })
				item.forEach (element => { if (!element.isCustom) element['fields'] = res })
			}
			item.push (...this.tableList)
			defaultElementType.setDefaultElementType (JSON.parse (JSON.stringify (item)))
			this.initPrintTemplate ()
		},

		ininUploadData () {
			if (this.$route.query.code) this.tableCode = this.$route.query.code
			if (!this.tableCode) { 
				this.$message.warning ('数据有误')
				return
			}
			this.twoDimensionList = []
			let tableElement = TEMPLATECODE.find (f => f.CODE == this.tableCode)
			if (tableElement && tableElement.TABLE.length > 0) {
				tableElement.TABLE.forEach (res => { return Object.assign (res, basics) })
				let i = 0, list = []
				tableElement.TABLE.forEach ((res, index) => {
					res.tid == this.printHeader.key ? res.columns = this.printHeader.staticValue : ''
					i ++
					list.push (res)
					if (i == 2) {
						this.twoDimensionList.push (list)
						list = []
						i = 0
					}
					if (index == tableElement.TABLE.length - 1 && list.length != 0) {
						this.twoDimensionList.push (list)
					}
				})
				this.tableList = tableElement.TABLE
			}
			if (this.tableCode != BASICSCODE.TABLE_PRINT) {
				this.getPrintTemplateByCode (this.tableCode)
			} else {
				this.customPrintJson = tablePrintJson
				this.updateObjectPrintTemplate ()
				this.updataLeftShortcutBar ()
			}
		}
    },
    
	created () {
		this.ininUploadData ()
	},

	watch: {
		printHeader: {
			deep: true,
			handler (val) {
				this.ininUploadData ()
			}
		}
	}
}
</script>

<style lang="scss">
@import '~@/assets/hiprint/css/hiprint.css';
.print_template_container {
	user-select: none;
	.el-header,
	.el-footer {
		background-color: #b3c0d1;
		color: #333;
		line-height: 60px;
	}

	.el-aside {
		background-color: #d3dce6;
		color: #333;
		padding: 6px;
	}

	.el-main {
		background-color: #e9eef3;
		color: #333;
		padding: 0;
	}

	.full_screen_dialog .el-dialog__header {
		padding: 0;
		margin: 0;
	}

	.full_screen_dialog .el-dialog__body {
		padding: 0;
	}

	.el-button-group {
		padding: 0 5px !important
	}
	.ep-draggable-item {
		width: 100%;
	}
}
#params_content .container {
	width: 100% !important;
}

.params_drawer .el-drawer.rtl {
	overflow: auto;
}

.params_drawer .el-drawer__header {
	margin-bottom: 0;
}

.hiprint-printTemplate {
	overflow-x: auto;
}

.hiprint-printPaper {
	background-color: #fff;
}

.drag_item_box {
	height: 100%;
	padding: 6px;
	div {
		height: 100%;
		width: 100%;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		a {
			text-align: center;
			text-decoration-line: none;
			span {
				font-size: 28px;
			}
			p {
				margin: 0;
			}
		}
	}
}

.drag_item_title {
	font-size: 16px;
	padding: 12px 6px 0 6px;
	font-weight: bold;
}

.preview_dialog  {
	.el-dialog__body {
        padding: 0;
    }
}

.params_drawer{
	left: auto !important;
}
</style>
