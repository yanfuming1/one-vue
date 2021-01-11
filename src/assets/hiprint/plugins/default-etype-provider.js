/* eslint-disable */
import { hiprint } from "../hiprint.bundle.js";
const defaultElementType = {}

/**
 * 左侧拖动默认展示数据， tid （defaultModule.text） 是和 printTemplateByHtml.vue组件中
 * <a class="ep-draggable-item" tid="defaultModule.text" style>
 *		<span class="glyphicon glyphicon-text-width" aria-hidden="true"></span>
 *		<p class="glyphicon-class">文本</p>
 *	</a>
 * 绑定，更改时请注意修改对应组件中<a>标签中对应的tid
 */
let list = []
let dataSource = [
	{
		tid: "defaultModule.text",
		title: "文本",
		fields: [],
		data: '',
		type: "text"
	},
	{
		tid: "defaultModule.longText",
		title: "长文",
		fields: [],
		data: "",
		type: "longText"
	},
	{
		tid: "defaultModule.customText",
		title: "自定义文本",
		isCustom: true,
		data: '',
		type: "text"
	},
	{
		tid: "defaultModule.customLongText",
		title: "自定义长文",
		isCustom: true,
		data: '',
		type: "longText"
	}
]

defaultElementType.defaultElementTypeProvider = function() {
	return function(options) {
		var addElementTypes = function(context) {
			context.addPrintElementTypes("defaultModule", [
				new hiprint.PrintElementTypeGroup("常规", list),
				new hiprint.PrintElementTypeGroup("辅助", [
					{
						tid: "defaultModule.hline",
						title: "横线",
						type: "hline"
					},
					{
						tid: "defaultModule.vline",
						title: "竖线",
						type: "vline"
					},
					{
						tid: "defaultModule.rect",
						title: "矩形",
						type: "rect"
					},
					{
						tid: "defaultModule.oval",
						title: "椭圆",
						type: "oval"
					}
				])
			]);
		};
		return {
			addElementTypes: addElementTypes
		};
	};
};

defaultElementType.getDefaultElementType = function () {
	return JSON.parse (JSON.stringify (dataSource))
}

defaultElementType.setDefaultElementType = function (newDataSource) {
	list = newDataSource
}

export default defaultElementType