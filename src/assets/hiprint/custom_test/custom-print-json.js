export const tablePrintJson = {
	"panels": [
		{
			"index": 0,
			"paperType": "A4Across",
			"height": 210,
			"width": 297,
			"paperHeader": 27,
			"paperFooter": 555,
			"printElements": [
				{
					"tid": "defaultModule.customText",
					"options": {
						"left": 312,
						"top": 28.5,
						"height": 51,
						"width": 169.5,
						"fontSize": 15,
						"field": "name",
						"hideTitle": true,
						"textAlign": "center",
						"textContentVerticalAlign": "middle"
					}
				},
				{
					"tid": "defaultModule.customText",
					"options": {
						"left": 25.5,
						"top": 69,
						"height": 9.75,
						"width": 320,
						"field": "time",
						"title": "时间区间",
						"textAlign": "center",
						"textContentVerticalAlign": "middle"
					}
				},
				{
					"tid": "defaultModule.table",
					"options": {
						"left": 25.5,
						"top": 102,
						"height": 69,
						"width": 790.5,
						"columns": [
							[]
						]
					}
				},
				{
					"tid": "defaultModule.customText",
					"options": {
						"left": 125.5,
						"top": 573,
						"height": 9.75,
						"width": 100,
						"field": "user",
						"title": "打印人",
						"textAlign": "center",
						"textContentVerticalAlign": "middle"
					}
				},
				{
					"tid": "defaultModule.customText",
					"options": {
						"left": 280,
						"top": 573,
						"height": 9.75,
						"width": 320,
						"field": "printTime",
						"title": "打印时间",
						"textAlign": "center",
						"textContentVerticalAlign": "middle"
					}
				},
			],
			"paperNumberLeft": 811.5,
			"paperNumberTop": 573,
			// "paperFooter": 570,
		}
	]
}