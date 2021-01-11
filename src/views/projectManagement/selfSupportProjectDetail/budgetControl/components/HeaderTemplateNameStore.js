// 定义模版名称
// 规则 工程大类-小类    (水利水电工程类-封面)
// 大类 key 需要和后端返回的值对应  小类key需要和后端返回的值对应，小类value是和组件名称对应
const templateName = {
  "1": {//水利水电工程类
    "0": "BWPCover", //-封面
    "1": "BWPTotalPrice",//-投标总价
    "2": "BWPTotalProjectPrice",//-工程项目总价表
    "3": "BWPClassBreakdownProject", // 分类分项工程量清单计价表
    "4": "BWPMeasurementProjectPrice", // 措施项目清单计价表
    "5": "BWPMeasurementProjectDecompose", // 措施项目分解表
    "6": "BWPOtherProjectPrice", // 其他项目清单计价表
    "7": "BWPOddJobPorject", // 零星工作项目计价表
    "8": "BWPProjectUnitPrice", // 建筑工程单价费(税)率汇总表
    "9": "BWPBetonMaterials", // 投标人生产混凝土(砂浆)配合比材料费表
    "10": "BWPMaterialsPrice", // 投标人自行采购主要材料及水、电等预算价格汇总表
    "11": "BWPConstructionMachineryPrice", // 施工机械台时(班)费汇总表
    "12": "BWPUnitpriceCalculationTable", // 建筑工程单价计算表
    "13": "BWPLaborCostUnitpriceTable", // 人工费单价汇总表
  },
  "2": { //市政公用工程
    "0": "BWPTotalPrice"
  }
}

export default templateName