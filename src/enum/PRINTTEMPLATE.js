/**
 *   表单基础数据
 *   // 展示那些表头
 *   editable: true,
 *   // 调整表头的宽度
 *   columnResizable: true,
 *   // 对齐
 *   columnAlignEditable: true,
 *   // 修改title
 *   columnTitleEditable: true,
 *   // 右侧拓展栏
 *   columnDisplayEditable: true,
 *   // 显示修改列的位置
 *   columnDisplayIndexEditable: true,
 */
export const TEMPLATECODE = [
    {
        // 驻外机构
        CODE: '1206855134861180928',
        TABLE: [
            {
                tid: 'defaultModule.shareholder',
                // 要绑定的字段
                field: 'shareholder',
                title: '股东构成',
                // 表格类型 自定义为tableCustom
                type: 'table',
                columns: [
                    [
                        { title: '股东', align: 'center', checked: true, field: 'line1'},
                        { title: '出资额', align: 'center', checked: true, field: 'line2'},
                        { title: '出资比例', align: 'center', checked: true, field: 'line3'},
                        { title: '出资方式', align: 'center', checked: true, field: 'line4'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.taxregistration',
                field: 'taxregistration',
                title: '出资比例',
                type: 'table',
                columns: [
                    [
                        { title: '缴纳费用名称', align: 'center', checked: true, field: 'line1' },
                        { title: '缴纳费用标准', align: 'center', checked: true, field: 'line2' },
                        { title: '缴纳金额', align: 'center', checked: true, field: 'line3' },
                        { title: '缴纳时间', align: 'center', checked: true, field: 'line4' }
                    ]
                ]
            }
        ]
    },
    {
        // 表格打印
        CODE: 'table_print',
        TABLE: [
            {
                tid: 'defaultModule.table',
                field: 'tableConter',
                type: 'table',
                title: '表格',
                columns: [
                    []
                ]
            }
        ]
    },
    {
        // 行政 - 个人证书信息登记
        CODE: '1304300253637312512',
        TABLE: [
            {
                tid: 'defaultModule.certilinelist',
                field: 'certilinelist',
                title: '证书专业及发证时间',
                type: 'table',
                columns:[
                    [
                        { title: '专业类别', align: 'center', checked: true, field: 'specialtyType'},
                        { title: '级别', align: 'center', checked: true, field: 'level'},
                        { title: '发证日期', align: 'center', checked: true, field: 'openingDate'},
                        { title: '到期日期', align: 'center', checked: true, field: 'dateDue'},
                        { title: '发证单位', align: 'center', checked: true, field: 'issueUnit'}
                    ]
                ]
            }
        ]
    },
    {
        // 行政（个人中心） - 入职登记
        CODE: '1304302393083715584',
        TABLE: [
            {
                tid: 'defaultModule.memberlist',
                field: 'memberlist',
                title: '主要家庭成员',
                type: 'table',
                columns:[
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'line1'},
                        { title: '与本人关系', align: 'center', checked: true, field: 'line2'},
                        { title: '工作单位', align: 'center', checked: true, field: 'line3'},
                        { title: '职务/岗位', align: 'center', checked: true, field: 'line4'},
                        { title: '联系电话', align: 'center', checked: true, field: 'line5'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.educationlist',
                field: 'educationlist',
                title: '主要教育经历',
                type: 'table',
                columns:[
                    [
                        { title: '起止时间', align: 'center', checked: true, field: 'line9'},
                        { title: '学校名称', align: 'center', checked: true, field: 'line1'},
                        { title: '学习形式', align: 'center', checked: true, field: 'line2'},
                        { title: '专业', align: 'center', checked: true, field: 'line3'},
                        { title: '学历层次', align: 'center', checked: true, field: 'line4'},
                        { title: '学历顺序', align: 'center', checked: true, field: 'line8'},
                        { title: '学制', align: 'center', checked: true, field: 'line5'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.careercertificatelist',
                field: 'careercertificatelist',
                title: '现有资格证书',
                type: 'table',
                columns:[
                    [
                        { title: '证书名称', align: 'center', checked: true, field: 'line1'},
                        { title: '级别', align: 'center', checked: true, field: 'line2'},
                        { title: '证书编号', align: 'center', checked: true, field: 'line3'},
                        { title: '发证单位', align: 'center', checked: true, field: 'line4'},
                        { title: '发证时间', align: 'center', checked: true, field: 'line8'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.workexperiencelist',
                field: 'workexperiencelist',
                title: '主要工作经历',
                type: 'table',
                columns:[
                    [
                        { title: '起止时间', align: 'center', checked: true, field: 'line9'},
                        { title: '工作单位', align: 'center', checked: true, field: 'line1'},
                        { title: '职务', align: 'center', checked: true, field: 'line2'},
                        { title: '主要从事工作', align: 'center', checked: true, field: 'line4'},
                        { title: '证明人', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            }
        ]
    },
    {
        // 人事 - 离职申请
        CODE: '1304302828968370176',
        TABLE: [
            {
                tid: 'defaultModule.addline',
                field: 'addline',
                title: '文件及物品移交',
                type: 'table',
                columns:[
                    [
                        { title: '名称', align: 'center', checked: true, field: 'itemname'},
                        { title: '单位', align: 'center', checked: true, field: 'units'},
                        { title: '数量', align: 'center', checked: true, field: 'amount'},
                        { title: '内容', align: 'center', checked: true, field: 'content'},
                        { title: '接收人', align: 'center', checked: true, field: 'recipient'},
                        { title: '交接时间', align: 'center', checked: true, field: 'createdTime'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.addlines',
                field: 'addlines',
                title: '待办事项移交',
                type: 'table',
                columns:[
                    [
                        { title: '待办事项', align: 'center', checked: true, field: 'schedule'},
                        { title: '已完成情况', align: 'center', checked: true, field: 'completion'},
                        { title: '待办重点', align: 'center', checked: true, field: 'keynote'},
                        { title: '接收人', align: 'center', checked: true, field: 'recipient'},
                        { title: '交接时间', align: 'center', checked: true, field: 'createdTime'}
                    ]
                ]
            }
        ]
    },
    {
        // 人事 - 辞退通知
        CODE: '1304303076893679616',
        TABLE: [
            {
                tid: 'defaultModule.addline',
                field: 'addline',
                title: '文件及物品移交',
                type: 'table',
                columns:[
                    [
                        { title: '名称', align: 'center', checked: true, field: 'itemname'},
                        { title: '单位', align: 'center', checked: true, field: 'units'},
                        { title: '数量', align: 'center', checked: true, field: 'amount'},
                        { title: '内容', align: 'center', checked: true, field: 'content'},
                        { title: '接收人', align: 'center', checked: true, field: 'recipient'},
                        { title: '交接时间', align: 'center', checked: true, field: 'createdTime'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.addlines',
                field: 'addlines',
                title: '待办事项移交',
                type: 'table',
                columns:[
                    [
                        { title: '待办事项', align: 'center', checked: true, field: 'schedule'},
                        { title: '已完成情况', align: 'center', checked: true, field: 'completion'},
                        { title: '待办重点', align: 'center', checked: true, field: 'keynote'},
                        { title: '接收人', align: 'center', checked: true, field: 'recipient'},
                        { title: '交接时间', align: 'center', checked: true, field: 'createdTime'}
                    ]
                ]
            }
        ]
    },
    {
        // 联营报名登记
        CODE: '1304305976218902528',
        TABLE: [
            {
                tid: 'defaultModule.line10list',
                field: 'line10list',
                title: '应收联营人费用明细及金额',
                type: 'table',
                columns:[
                    [
                        { title: '费用名称', align: 'center', checked: true, field: 'line1'},
                        { title: '金额', align: 'center', checked: true, field: 'line2'},
                        { title: '备注', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            }
        ]
    },
    {
        // 联营标书制作
        CODE: '1304306508329279488',
        TABLE: [
            {
                tid: 'defaultModule.memberline',
                field: 'memberline',
                title: '项目部组成人员',
                type: 'table',
                columns:[
                    [
                        { title: '职务', align: 'center', checked: true, field: 'line1'},
                        { title: '证书类别或名称', align: 'center', checked: true, field: 'line2'},
                        { title: '姓名', align: 'center', checked: true, field: 'line5'},
                        { title: '身份证号', align: 'center', checked: true, field: 'line3'},
                        { title: '备注', align: 'center', checked: true, field: 'line4'}
                    ]
                ]
            }
        ]
    },
    {
        // 联营保证金缴纳
        CODE: '1304306891193737216',
        TABLE: [
            {
                tid: 'defaultModule.companylist',
                field: 'companylist',
                title: '公司支付账户及金额',
                type: 'table',
                columns:[
                    [
                        { title: '公司付款账户', align: 'center', checked: true, field: 'name'},
                        { title: '开户行', align: 'center', checked: true, field: 'openingBank'},
                        { title: '账号', align: 'center', checked: true, field: 'account'},
                        { title: '付款金额', align: 'center', checked: true, field: 'moneyString'}
                    ]
                ]
            }
        ]
    },
    {
        // 联营保证金退还
        CODE: '1304307008730718208',
        TABLE: [
            {
                tid: 'defaultModule.withholdlist',
                field: 'withholdlist',
                title: '扣除金额',
                type: 'table',
                columns:[
                    [
                        { title: '费用名称', align: 'center', checked: true, field: 'name'},
                        { title: '金额', align: 'center', checked: true, field: 'moneyString'},
                        { title: '扣款说明', align: 'center', checked: true, field: 'remark'},
                        { title: '经办人', align: 'center', checked: true, field: 'createName'},
                        { title: '经办时间', align: 'center', checked: true, field: 'createTime'}
                    ]
                ]
            },{
                tid: 'defaultModule.companypaylist',
                field: 'companypaylist',
                title: '公司支付账户及金额',
                type: 'table',
                columns:[
                    [
                        { title: '公司付款账户', align: 'center', checked: true, field: 'name'},
                        { title: '开户行', align: 'center', checked: true, field: 'openingBank'},
                        { title: '账号', align: 'center', checked: true, field: 'account'},
                        { title: '付款金额', align: 'center', checked: true, field: 'moneyString'}
                    ]
                ]
            },
        ]
    },
    {
        // 联营开标登记
        CODE: '1304306149355577344',
        TABLE: [
            {
                tid: 'defaultModule.memberline',
                field: 'memberline',
                title: '项目部组成人员',
                type: 'table',
                columns:[
                    [
                        { title: '职务', align: 'center', checked: true, field: 'line1'},
                        { title: '证书类别或名称', align: 'center', checked: true, field: 'line2'},
                        { title: '姓名', align: 'center', checked: true, field: 'line5'},
                        { title: '身份证号', align: 'center', checked: true, field: 'line3'},
                        { title: '备注', align: 'center', checked: true, field: 'line4'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.othercompanyline',
                field: 'othercompanyline',
                title: '其他投标公司及报价',
                type: 'table',
                columns:[
                    [
                        { title: '公司名称', align: 'center', checked: true, field: 'line1'},
                        { title: '投标报价', align: 'center', checked: true, field: 'line2'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.costbreakdownline',
                field: 'costbreakdownline',
                title: '应收联营人费用明细及金额',
                type: 'table',
                columns:[
                    [
                        { title: '费用名称', align: 'center', checked: true, field: 'line1'},
                        { title: '金额', align: 'center', checked: true, field: 'line2'},
                        { title: '备注', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            }
        ]
    },
    {
        // 联营立项登记
        CODE: '1304307310594777088',
        TABLE: [
            {
                tid: 'defaultModule.builingunitline',
                field: 'builingunitline',
                title: '参建单位',
                type: 'table',
                columns:[
                    [
                        { title: '单位类别', align: 'center', checked: true, field: 'line1'},
                        { title: '单位名称', align: 'center', checked: true, field: 'line2'},
                        { title: '联系人', align: 'center', checked: true, field: 'line3'},
                        { title: '职务', align: 'center', checked: true, field: 'line4'},
                        { title: '办公电话', align: 'center', checked: true, field: 'line5'},
                        { title: '个人电话', align: 'center', checked: true, field: 'line6'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.memberline',
                field: 'memberline',
                title: '项目部组成人员',
                type: 'table',
                columns:[
                    [
                        { title: '职务', align: 'center', checked: true, field: 'line1'},
                        { title: '姓名', align: 'center', checked: true, field: 'line5'},
                        { title: '身份证号', align: 'center', checked: true, field: 'line3'},
                        { title: '备注', align: 'center', checked: true, field: 'line4'}
                    ]
                ]
            }
        ]
    },
    {
        // 联营工程款支付申请
        CODE: '1304307899512807424',
        TABLE: [
            {
                tid: 'defaultModule.deductlist',
                field: 'deductlist',
                title: '本次应扣',
                type: 'table',
                columns:[
                    [
                        { title: '应扣费用名称', align: 'center', checked: true, field: 'name'},
                        { title: '应扣金额', align: 'center', checked: true, field: 'moneyString'},
                        { title: '扣款说明', align: 'center', checked: true, field: 'remark'},
                        { title: '登记人', align: 'center', checked: true, field: 'createName'},
                        { title: '登记时间', align: 'center', checked: true, field: 'createTime'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.pledgelist',
                field: 'pledgelist',
                title: '本次暂押',
                type: 'table',
                columns:[
                    [
                        { title: '暂押费用名称', align: 'center', checked: true, field: 'name'},
                        { title: '暂押金额', align: 'center', checked: true, field: 'moneyString'},
                        { title: '暂押说明', align: 'center', checked: true, field: 'remark'},
                        { title: '登记人', align: 'center', checked: true, field: 'createName'},
                        { title: '登记时间', align: 'center', checked: true, field: 'createTime'}
                    ]
                ]
            },{
                tid: 'defaultModule.paylist',
                field: 'paylist',
                title: '本次支付',
                type: 'table',
                columns:[
                    [
                        { title: '支付金额', align: 'center', checked: true, field: 'moneyString'},
                        { title: '收款方户名', align: 'center', checked: true, field: 'name'},
                        { title: '开户行', align: 'center', checked: true, field: 'openingBank'},
                        { title: '账号', align: 'center', checked: true, field: 'account'},
                        { title: '账号类型', align: 'center', checked: true, field: 'untitled1'}
                    ]
                ]
            },{
                tid: 'defaultModule.companypaylist',
                field: 'companypaylist',
                title: '公司支付账户及金额',
                type: 'table',
                columns:[
                    [
                        { title: '公司付款账户', align: 'center', checked: true, field: 'name'},
                        { title: '开户行', align: 'center', checked: true, field: 'openingBank'},
                        { title: '账号', align: 'center', checked: true, field: 'account'},
                        { title: '付款金额', align: 'center', checked: true, field: 'moneyString'}
                    ]
                ]
            },{
                tid: 'defaultModule.advisorylist',
                field: 'advisorylist',
                title: '电话咨询登记',
                type: 'table',
                columns:[
                    [
                        { title: '被咨询单位', align: 'center', checked: true, field: 'line1'},
                        { title: '被咨询人', align: 'center', checked: true, field: 'line2'},
                        { title: '联系电话', align: 'center', checked: true, field: 'line3'},
                        { title: '咨询情况', align: 'center', checked: true, field: 'line4'},
                        { title: '咨询人', align: 'center', checked: true, field: 'line6'},
                        { title: '登记时间', align: 'center', checked: true, field: 'line7'}
                    ]
                ]
            }
        ]
    },
    {
        // 联营材料款代收代付
        CODE: '1304308098213765120',
        TABLE: [
            {
                tid: 'defaultModule.deductlist',
                field: 'deductlist',
                title: '本次应扣',
                type: 'table',
                columns:[
                    [
                        { title: '应扣费用名称', align: 'center', checked: true, field: 'name'},
                        { title: '应扣金额', align: 'center', checked: true, field: 'moneyString'},
                        { title: '扣款说明', align: 'center', checked: true, field: 'remark'},
                        { title: '登记人', align: 'center', checked: true, field: 'createName'},
                        { title: '登记时间', align: 'center', checked: true, field: 'createTime'}
                    ]
                ]
            },{
                tid: 'defaultModule.abaaddline',
                field: 'abaaddline',
                title: '本次支付',
                type: 'table',
                columns:[
                    [
                        { title: '收款方户名', align: 'center', checked: true, field: 'accountCredited'},
                        { title: '开户行', align: 'center', checked: true, field: 'openingBank'},
                        { title: '账号', align: 'center', checked: true, field: 'account'},
                        { title: '支付金额', align: 'center', checked: true, field: 'untitled4'},
                        { title: '纳税人识别号', align: 'center', checked: true, field: 'identificationNumber'},
                        { title: '账号类型', align: 'center', checked: true, field: 'accountType'},
                        { title: '账户性质', align: 'center', checked: true, field: 'natureAccount'},
                        { title: '票据类型', align: 'center', checked: true, field: 'instrumentType'},
                        { title: '货物或应税劳务、服务名称', align: 'center', checked: true, field: 'commodityBreakdown'}
                    ]
                ]
            },{
                tid: 'defaultModule.companypaylist',
                field: 'companypaylist',
                title: '公司支付账户及金额',
                type: 'table',
                columns:[
                    [
                        { title: '公司付款账户', align: 'center', checked: true, field: 'name'},
                        { title: '开户行', align: 'center', checked: true, field: 'openingBank'},
                        { title: '账号', align: 'center', checked: true, field: 'account'},
                        { title: '付款金额', align: 'center', checked: true, field: 'moneyString'}
                    ]
                ]
            },
        ]
    },
    {
        // 联营成本票据分类占比
        CODE: '1304308601756737536',
        TABLE: [
            {
                tid: 'defaultModule.costconstitutelist',
                field: 'costconstitutelist',
                title: '成本票据分类占比',
                type: 'table',
                columns:[
                    [
                        { title: '成本类别', align: 'center', checked: true, field: 'category'},
                        { title: '成本名称', align: 'center', checked: true, field: 'name'},
                        { title: '单位', align: 'center', checked: true, field: 'unit'},
                        { title: '数量', align: 'center', checked: true, field: 'num'},
                        { title: '单价（元）', align: 'center', checked: true, field: 'unitPrice'},
                        { title: '合价（元）', align: 'center', checked: true, field: 'combinedPrice'},
                        { title: '占合同价（%）', align: 'center', checked: true, field: 'percent'}
                    ]
                ]
            }
        ]
    },
    {
        // 对外付款申请
        CODE: '1304309815789658112',
        TABLE: [
            {
                tid: 'defaultModule.pays',
                field: 'pays',
                title: '支付事由及费用明细',
                type: 'table',
                columns:[
                    [
                        { title: '支付事由', align: 'center', checked: true, field: 'line1'},
                        { title: '单位', align: 'center', checked: true, field: 'line2'},
                        { title: '数量', align: 'center', checked: true, field: 'line3'},
                        { title: '单价（元）', align: 'center', checked: true, field: 'line4'},
                        { title: '合计（元）', align: 'center', checked: true, field: 'line5'},
                        { title: '备注说明', align: 'center', checked: true, field: 'line6'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.recs',
                field: 'recs',
                title: '收款人账户信息',
                type: 'table',
                columns:[
                    [
                        { title: '户名', align: 'center', checked: true, field: 'line1'},
                        { title: '开户行', align: 'center', checked: true, field: 'line2'},
                        { title: '账号', align: 'center', checked: true, field: 'line3'},
                        { title: '金额（元）', align: 'center', checked: true, field: 'line4'},
                        { title: '账户性质', align: 'center', checked: true, field: 'line5'},
                        { title: '收款凭证类型', align: 'center', checked: true, field: 'line6'},
                        { title: '联系人', align: 'center', checked: true, field: 'line7'},
                        { title: '联系方式', align: 'center', checked: true, field: 'line8'}
                    ]
                ]
            }
            ,
            {
                tid: 'defaultModule.clcu',
                field: 'clcu',
                title: '公司付款账户信息',
                type: 'table',
                columns:[
                    [
                        { title: '户名', align: 'center', checked: true, field: 'line1'},
                        { title: '开户行', align: 'center', checked: true, field: 'line2'},
                        { title: '账号', align: 'center', checked: true, field: 'line3'},
                        { title: '金额（元）', align: 'center', checked: true, field: 'line4'}
                    ]
                ]
            }
        ]
    },
    {
        // 员工报销申请
        CODE: '1304310120501649408',
        TABLE: [
            {
                tid: 'defaultModule.employreimvices',
                field: 'employreimvices',
                title: '报销详情及费用明细',
                type: 'table',
                columns:[
                    [
                        { title: '费用发生时间', align: 'center', checked: true, field: 'line1'},
                        { title: '费用发生地点', align: 'center', checked: true, field: 'line2'},
                        { title: '报销事项详情', align: 'center', checked: true, field: 'line3'},
                        { title: '费用名称', align: 'center', checked: true, field: 'line4'},
                        { title: '单位', align: 'center', checked: true, field: 'line5'},
                        { title: '数量', align: 'center', checked: true, field: 'line6'},
                        { title: '单价（元）', align: 'center', checked: true, field: 'line7'},
                        { title: '合计（元）', align: 'center', checked: true, field: 'line8'},
                        { title: '报销凭证', align: 'center', checked: true, field: 'line9'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.compay',
                field: 'compay',
                title: '公司付款账户及金额',
                type: 'table',
                columns:[
                    [
                        { title: '户名', align: 'center', checked: true, field: 'line1'},
                        { title: '开户行', align: 'center', checked: true, field: 'line2'},
                        { title: '账号', align: 'center', checked: true, field: 'line3'},
                        { title: '金额', align: 'center', checked: true, field: 'line4'}
                    ]
                ]
            }
        ]
    },
    {
        // 员工借款申请
        CODE: '1304310428581707776',
        TABLE: [
            {
                tid: 'defaultModule.employeeverifications',
                field: 'employeeverifications',
                title: '员工借款',
                type: 'table',
                columns:[
                    [
                        { title: '核销金额', align: 'center', checked: true, field: 'name4'},
                        { title: '下欠金额', align: 'center', checked: true, field: 'ownmoney'},
                        { title: '核销百分比', align: 'center', checked: true, field: 'verpercentage'},
                        { title: '核销人', align: 'center', checked: true, field: 'createdby'},
                        { title: '核销时间', align: 'center', checked: true, field: 'createdbytime'},
                        { title: '核销说明', align: 'center', checked: true, field: 'verificationremark'}
                    ]
                ]
            },{
                tid: 'defaultModule.paymentlist',
                field: 'paymentlist',
                title: '付款信息',
                type: 'table',
                columns:[
                    [
                        { title: '户名', align: 'center', checked: true, field: 'payname'},
                        { title: '开户行', align: 'center', checked: true, field: 'paybank'},
                        { title: '账号', align: 'center', checked: true, field: 'payaccount'},
                        { title: '付款金额', align: 'center', checked: true, field: 'paymoney'}
                    ]
                ]
            }
        ]
    },
    {
        // 自营投标项目
        CODE: '1304312836737089536',
        TABLE: [
            {
                tid: 'defaultModule.ownerlist',
                field: 'ownerlist',
                title: '业主负责人信息',
                type: 'table',
                columns:[
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name'},
                        { title: '部门', align: 'center', checked: true, field: 'department'},
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty'},
                        { title: '分管工作', align: 'center', checked: true, field: 'responsibility'},
                        { title: '办公电话', align: 'center', checked: true, field: 'officePhone'},
                        { title: '个人电话', align: 'center', checked: true, field: 'phone'},
                        { title: '备注', align: 'center', checked: true, field: 'remark'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.teamlist',
                field: 'teamlist',
                title: '跟踪团队组建',
                type: 'table',
                columns:[
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name'},
                        { title: '部门', align: 'center', checked: true, field: 'department'},
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty'},
                        { title: '主要职责和任务', align: 'center', checked: true, field: 'responsibility'},
                        { title: '办公电话', align: 'center', checked: true, field: 'officePhone'},
                        { title: '个人电话', align: 'center', checked: true, field: 'phone'},
                        { title: '备注', align: 'center', checked: true, field: 'remark'}
                    ]
                ]
            }
        ]
    },
    {
        // 自营前期跟踪
        CODE: '1304315050486546432',
        TABLE: [
            {
                tid: 'defaultModule.ownerlist',
                field: 'ownerlist',
                title: '业主方负责人',
                type: 'table',
                columns:[
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name'},
                        { title: '部门', align: 'center', checked: true, field: 'department'},
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty'},
                        { title: '分管工作', align: 'center', checked: true, field: 'responsibility'},
                        { title: '办公电话', align: 'center', checked: true, field: 'officePhone'},
                        { title: '个人电话', align: 'center', checked: true, field: 'phone'},
                        { title: '备注', align: 'center', checked: true, field: 'remark'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.teamlist',
                field: 'teamlist',
                title: ' 跟踪团队组建',
                type: 'table',
                columns:[
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name'},
                        { title: '部门', align: 'center', checked: true, field: 'department'},
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty'},
                        { title: '主要职责和任务', align: 'center', checked: true, field: 'responsibility'},
                        { title: '办公电话', align: 'center', checked: true, field: 'officePhone'},
                        { title: '个人电话', align: 'center', checked: true, field: 'phone'},
                        { title: '备注', align: 'center', checked: true, field: 'remark'}
                    ]
                ]
            }
        ]
    },
    {
        // 自营招标公告变更
        CODE: '1304320054538682368',
        TABLE: [
            {
                tid: 'defaultModule.detaillist',
                field: 'detaillist',
                title: '招标公告变更',
                type: 'table',
                columns:[
                    [
                        { title: '变更前内容', align: 'center', checked: true, field: 'beforeChange'},
                        { title: '变更后内容', align: 'center', checked: true, field: 'afterChange'},
                        { title: '变更原因分析', align: 'center', checked: true, field: 'reason'},
                        { title: '变更发布时间', align: 'center', checked: true, field: 'changeTime'},
                        { title: '对投标影响程度', align: 'center', checked: true, field: 'influence'}
                    ]
                ]
            }
        ]
    },
    {
        // 自营招标信息
        CODE: '1304320402305204224',
        TABLE: [
            {
                tid: 'defaultModule.papersrequestedlist',
                field: 'papersrequestedlist',
                title: '证件要求',
                type: 'table',
                columns:[
                    [
                        { title: '证件类型', align: 'center', checked: true, field: 'line1'},
                        { title: '证件名称', align: 'center', checked: true, field: 'line2'},
                        { title: '具体要求', align: 'center', checked: true, field: 'line3'},
                        { title: '备注', align: 'center', checked: true, field: 'line4'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.socialrequestedlist',
                field: 'socialrequestedlist',
                title: ' 社保要求',
                type: 'table',
                columns:[
                    [
                        { title: '社保名称', align: 'center', checked: true, field: 'line1'},
                        { title: '具体要求', align: 'center', checked: true, field: 'line2'},
                        { title: '备注', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.performancerequestedlist',
                field: 'performancerequestedlist',
                title: ' 业绩要求',
                type: 'table',
                columns:[
                    [
                        { title: '业绩名称', align: 'center', checked: true, field: 'line1'},
                        { title: '具体要求', align: 'center', checked: true, field: 'line2'},
                        { title: '备注', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.elserequestedlist',
                field: 'elserequestedlist',
                title: ' 其它要求',
                type: 'table',
                columns:[
                    [
                        { title: '名称', align: 'center', checked: true, field: 'line1'},
                        { title: '具体要求', align: 'center', checked: true, field: 'line2'},
                        { title: '备注', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            }
        ]
    },
    {
        // 自营评分规则
        CODE: '1304320722972327936',
        TABLE: [
            {
                tid: 'defaultModule.papersrequestedlist',
                field: 'papersrequestedlist',
                title: '证件要求',
                type: 'table',
                columns:[
                    [
                        { title: '证件类型', align: 'center', checked: true, field: 'line1'},
                        { title: '证件名称', align: 'center', checked: true, field: 'line2'},
                        { title: '具体要求', align: 'center', checked: true, field: 'line3'},
                        { title: '备注', align: 'center', checked: true, field: 'line4'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.socialrequestedlist',
                field: 'socialrequestedlist',
                title: ' 社保要求',
                type: 'table',
                columns:[
                    [
                        { title: '社保名称', align: 'center', checked: true, field: 'line1'},
                        { title: '具体要求', align: 'center', checked: true, field: 'line2'},
                        { title: '备注', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.performancerequestedlist',
                field: 'performancerequestedlist',
                title: ' 业绩要求',
                type: 'table',
                columns:[
                    [
                        { title: '业绩名称', align: 'center', checked: true, field: 'line1'},
                        { title: '具体要求', align: 'center', checked: true, field: 'line2'},
                        { title: '备注', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.elserequestedlist',
                field: 'elserequestedlist',
                title: ' 其它要求',
                type: 'table',
                columns:[
                    [
                        { title: '名称', align: 'center', checked: true, field: 'line1'},
                        { title: '具体要求', align: 'center', checked: true, field: 'line2'},
                        { title: '备注', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.detaillist',
                field: 'detaillist',
                title: ' 招标评分',
                type: 'table',
                columns:[
                    [
                        { title: '赋分条件', align: 'center', checked: true, field: 'giveCondition'},
                        { title: '满分', align: 'center', checked: true, field: 'fullScore'},
                        { title: '具备条件', align: 'center', checked: true, field: 'possessCondition'},
                        { title: '可控得分', align: 'center', checked: true, field: 'controllableScore'},
                        { title: '争取条件', align: 'center', checked: true, field: 'fightCondition'},
                        { title: '争取得分', align: 'center', checked: true, field: 'fightScore'},
                        { title: '可控后失分', align: 'center', checked: true, field: 'controllableLosing'},
                        { title: '争取后失分', align: 'center', checked: true, field: 'fightLosing'}
                    ]
                ]
            }
        ]
    },
    {
        // 经济核算-成本登记-目标成本
        CODE: '1304330604157009920',
        TABLE: [
            {
                tid: 'defaultModule.costprojectlist',
                field: 'costprojectlist',
                title: '目标成本登记',
                type: 'table',
                columns:[
                    [
                        { title: '序号', align: 'center', checked: true, field: 'numberOrder'},
                        { title: '项目编码', align: 'center', checked: true, field: 'code'},
                        { title: '项目名称', align: 'center', checked: true, field: 'name'},
                        { title: '项目特征', align: 'center', checked: true, field: 'feature'},
                        { title: '计量单位', align: 'center', checked: true, field: 'unit'},
                        { title: '投标数量', align: 'center', checked: true, field: 'num'},
                        { title: '投标单价（元）', align: 'center', checked: true, field: 'unitPriceString'},
                        { title: '投标合价（元）', align: 'center', checked: true, field: 'totalPriceString'},
                        { title: '核算数量', align: 'center', checked: true, field: 'adjustNumber'},
                        { title: '核算单价（元）', align: 'center', checked: true, field: 'adjustUnitPriceString'},
                        { title: '核算合价（元）', align: 'center', checked: true, field: 'adjustTotalPriceString'},
                        { title: '备注', align: 'center', checked: true, field: 'remark'}
                    ]
                ]
            }
        ]
    },
    {
        // 经济核算-成本登记-责任成本
        CODE: '1308602635866275840',
        TABLE: [
            {
                tid: 'defaultModule.costprojectlist',
                field: 'costprojectlist',
                title: '责任成本登记',
                type: 'table',
                columns:[
                    [
                        { title: '序号', align: 'center', checked: true, field: 'numberOrder'},
                        { title: '项目编码', align: 'center', checked: true, field: 'code'},
                        { title: '项目名称', align: 'center', checked: true, field: 'name'},
                        { title: '项目特征', align: 'center', checked: true, field: 'feature'},
                        { title: '计量单位', align: 'center', checked: true, field: 'unit'},
                        { title: '投标数量', align: 'center', checked: true, field: 'num'},
                        { title: '投标单价（元）', align: 'center', checked: true, field: 'unitPriceString'},
                        { title: '投标合价（元）', align: 'center', checked: true, field: 'totalPriceString'},
                        { title: '核算数量', align: 'center', checked: true, field: 'adjustNumber'},
                        { title: '核算单价（元）', align: 'center', checked: true, field: 'adjustUnitPriceString'},
                        { title: '核算合价（元）', align: 'center', checked: true, field: 'adjustTotalPriceString'},
                        { title: '备注', align: 'center', checked: true, field: 'remark'}
                    ]
                ]
            }
        ]
    },
    {
        // 质量整改
        CODE: '1304329682077024256',
        TABLE: [
            {
                tid: 'defaultModule.rectifycontentlist',
                field: 'rectifycontentlist',
                title: '整改内容',
                type: 'table',
                columns:[
                    [
                        { title: '问题描述', align: 'center', checked: true, field: 'line1'},
                        { title: '处理措施', align: 'center', checked: true, field: 'line2'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.rectifycrewlist',
                field: 'rectifycrewlist',
                title: '整改人员',
                type: 'table',
                columns:[
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'line1'},
                        { title: '部门', align: 'center', checked: true, field: 'line2'},
                        { title: '岗位/职务', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            }
        ]
    },
    {
        // 质量检查
        CODE: '1304327235279405056',
        TABLE: [
            {
                tid: 'defaultModule.findproblemlist',
                field: 'findproblemlist',
                title: '检查内容',
                type: 'table',
                columns:[
                    [
                        { title: '问题描述', align: 'center', checked: true, field: 'line1'},
                        { title: '处理措施', align: 'center', checked: true, field: 'line2'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.inspectcrewlist',
                field: 'inspectcrewlist',
                title: '检查人员',
                type: 'table',
                columns:[
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'line1'},
                        { title: '部门', align: 'center', checked: true, field: 'line2'},
                        { title: '岗位/职务', align: 'center', checked: true, field: 'line3'}
                    ]
                ]
            }
        ]
    },
    {
        // 发票管理
        CODE: '1304326456489426944',
        TABLE: [
            {
                tid: 'defaultModule.invoicedetailline',
                field: 'invoicedetailline',
                title: '发票明细',
                type: 'table',
                columns:[
                    [
                        { title: '货物或应税劳务名称', align: 'center', checked: true, field: 'name'},
                        { title: '规格型号', align: 'center', checked: true, field: 'specificationName'},
                        { title: '单位', align: 'center', checked: true, field: 'unit'},
                        { title: '数量', align: 'center', checked: true, field: 'number1'},
                        { title: '单价', align: 'center', checked: true, field: 'money1'},
                        { title: '金额', align: 'center', checked: true, field: 'money2'},
                        { title: '税率', align: 'center', checked: true, field: 'string1'},
                        { title: '税额', align: 'center', checked: true, field: 'string2'}
                    ]
                ]
            }
        ]
    },
    {
        // 销项发票
        CODE: '1314838148815097856',
        TABLE: [
            {
                tid: 'defaultModule.invoicedetailline',
                field: 'invoicedetailline',
                title: '发票明细',
                type: 'table',
                columns:[
                    [
                        { title: '货物或应税劳务名称', align: 'center', checked: true, field: 'name'},
                        { title: '规格型号', align: 'center', checked: true, field: 'specificationName'},
                        { title: '单位', align: 'center', checked: true, field: 'unit'},
                        { title: '数量', align: 'center', checked: true, field: 'number1'},
                        { title: '单价', align: 'center', checked: true, field: 'money1'},
                        { title: '金额', align: 'center', checked: true, field: 'money2'},
                        { title: '税率', align: 'center', checked: true, field: 'string1'},
                        { title: '税额', align: 'center', checked: true, field: 'string2'}
                    ]
                ]
            }
        ]
    },
    {
        // 合同结算
        CODE: '1304325718522609664',
        TABLE: [
            {
                tid: 'defaultModule.goodstype',
                field: 'goodstype',
                title: '货物类',
                type: 'table',
                columns:[
                    [
                        { title: '编码', align: 'center', checked: true, field: 'line1'},
                        { title: '名称', align: 'center', checked: true, field: 'line2'},
                        { title: '品牌', align: 'center', checked: true, field: 'line3'},
                        { title: '规格型号', align: 'center', checked: true, field: 'line4'},
                        { title: '技术参数', align: 'center', checked: true, field: 'line5'},
                        { title: '计量单位', align: 'center', checked: true, field: 'line6'},
                        { title: '合同数量', align: 'center', checked: true, field: 'line7'},
                        { title: '合同单价(元)', align: 'center', checked: true, field: 'line8'},
                        { title: '合同金额(元)', align: 'center', checked: true, field: 'line9'},
                        { title: '累计结算数量', align: 'center', checked: true, field: 'line11'},
                        { title: '本次结算数量', align: 'center', checked: true, field: 'line12'},
                        { title: '剩余结算数量', align: 'center', checked: true, field: 'line13'},
                        { title: '结算金额(元)', align: 'center', checked: true, field: 'line14'},
                        { title: '备注', align: 'center', checked: true, field: 'line10'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.servicetype',
                field: 'servicetype',
                title: '服务类',
                type: 'table',
                columns:[
                    [
                        { title: '编码', align: 'center', checked: true, field: 'line1'},
                        { title: '名称', align: 'center', checked: true, field: 'line2'},
                        { title: '品牌', align: 'center', checked: true, field: 'line3'},
                        { title: '规格型号', align: 'center', checked: true, field: 'line4'},
                        { title: '技术参数', align: 'center', checked: true, field: 'line5'},
                        { title: '计量单位', align: 'center', checked: true, field: 'line6'},
                        { title: '合同数量', align: 'center', checked: true, field: 'line7'},
                        { title: '合同单价(元)', align: 'center', checked: true, field: 'line8'},
                        { title: '合同金额(元)', align: 'center', checked: true, field: 'line9'},
                        { title: '累计结算数量', align: 'center', checked: true, field: 'line11'},
                        { title: '本次结算数量', align: 'center', checked: true, field: 'line12'},
                        { title: '剩余结算数量', align: 'center', checked: true, field: 'line13'},
                        { title: '结算金额(元)', align: 'center', checked: true, field: 'line14'},
                        { title: '备注', align: 'center', checked: true, field: 'line10'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.labortype',
                field: 'labortype',
                title: '劳务类',
                type: 'table',
                columns:[
                    [
                        { title: '编码', align: 'center', checked: true, field: 'line1'},
                        { title: '名称', align: 'center', checked: true, field: 'line2'},
                        { title: '品牌', align: 'center', checked: true, field: 'line3'},
                        { title: '规格型号', align: 'center', checked: true, field: 'line4'},
                        { title: '技术参数', align: 'center', checked: true, field: 'line5'},
                        { title: '计量单位', align: 'center', checked: true, field: 'line6'},
                        { title: '合同数量', align: 'center', checked: true, field: 'line7'},
                        { title: '合同单价(元)', align: 'center', checked: true, field: 'line8'},
                        { title: '合同金额(元)', align: 'center', checked: true, field: 'line9'},
                        { title: '累计结算数量', align: 'center', checked: true, field: 'line11'},
                        { title: '本次结算数量', align: 'center', checked: true, field: 'line12'},
                        { title: '剩余结算数量', align: 'center', checked: true, field: 'line13'},
                        { title: '结算金额(元)', align: 'center', checked: true, field: 'line14'},
                        { title: '备注', align: 'center', checked: true, field: 'line10'}
                    ]
                ]
            }
        ],
    },
    {
        // 合同计量
        CODE: '1304325512930410496',
        TABLE: [
            {
                tid: 'defaultModule.goodstype',
                field: 'goodstype',
                title: '货物类',
                type: 'table',
                columns:[
                    [
                        { title: '编码', align: 'center', checked: true, field: 'line1'},
                        { title: '名称', align: 'center', checked: true, field: 'line2'},
                        { title: '品牌', align: 'center', checked: true, field: 'line3'},
                        { title: '规格型号', align: 'center', checked: true, field: 'line4'},
                        { title: '技术参数', align: 'center', checked: true, field: 'line5'},
                        { title: '计量单位', align: 'center', checked: true, field: 'line6'},
                        { title: '合同数量', align: 'center', checked: true, field: 'line7'},
                        { title: '合同单价(元)', align: 'center', checked: true, field: 'line8'},
                        { title: '合同金额(元)', align: 'center', checked: true, field: 'line9'},
                        { title: '本次计量', align: 'center', checked: true, field: 'line11'},
                        { title: '剩余数量', align: 'center', checked: true, field: 'line12'},
                        { title: '备注', align: 'center', checked: true, field: 'line10'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.servicetype',
                field: 'servicetype',
                title: '服务类',
                type: 'table',
                columns:[
                    [
                        { title: '编码', align: 'center', checked: true, field: 'line1'},
                        { title: '名称', align: 'center', checked: true, field: 'line2'},
                        { title: '品牌', align: 'center', checked: true, field: 'line3'},
                        { title: '规格型号', align: 'center', checked: true, field: 'line4'},
                        { title: '技术参数', align: 'center', checked: true, field: 'line5'},
                        { title: '计量单位', align: 'center', checked: true, field: 'line6'},
                        { title: '合同数量', align: 'center', checked: true, field: 'line7'},
                        { title: '合同单价(元)', align: 'center', checked: true, field: 'line8'},
                        { title: '合同金额(元)', align: 'center', checked: true, field: 'line9'},
                        { title: '本次计量', align: 'center', checked: true, field: 'line11'},
                        { title: '剩余数量', align: 'center', checked: true, field: 'line12'},
                        { title: '备注', align: 'center', checked: true, field: 'line10'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.labortype',
                field: 'labortype',
                title: '劳务类',
                type: 'table',
                columns:[
                    [
                        { title: '编码', align: 'center', checked: true, field: 'line1'},
                        { title: '名称', align: 'center', checked: true, field: 'line2'},
                        { title: '品牌', align: 'center', checked: true, field: 'line3'},
                        { title: '规格型号', align: 'center', checked: true, field: 'line4'},
                        { title: '技术参数', align: 'center', checked: true, field: 'line5'},
                        { title: '计量单位', align: 'center', checked: true, field: 'line6'},
                        { title: '合同数量', align: 'center', checked: true, field: 'line7'},
                        { title: '合同单价(元)', align: 'center', checked: true, field: 'line8'},
                        { title: '合同金额(元)', align: 'center', checked: true, field: 'line9'},
                        { title: '本次计量', align: 'center', checked: true, field: 'line11'},
                        { title: '剩余数量', align: 'center', checked: true, field: 'line12'},
                        { title: '备注', align: 'center', checked: true, field: 'line10'}
                    ]
                ]
            }
        ],
    },
    {
        // 合同签订
        CODE: '1304325179785232384',
        TABLE: [
            {
                tid: 'defaultModule.signingcontract',
                field: 'signingcontract',
                title: '合同签约方',
                type: 'table',
                columns:[
                    [
                        { title: '签约方全称', align: 'center', checked: true, field: 'line1'},
                        { title: '简 称', align: 'center', checked: true, field: 'line2'},
                        { title: '性 质', align: 'center', checked: true, field: 'line3'},
                        { title: '法定代表人或委托人', align: 'center', checked: true, field: 'line4'},
                        { title: '联系电话', align: 'center', checked: true, field: 'line5'},
                        { title: '业务负责人', align: 'center', checked: true, field: 'line6'},
                        { title: '电子邮箱', align: 'center', checked: true, field: 'line7'},
                        { title: '备 注', align: 'center', checked: true, field: 'line8'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.commerceclause',
                field: 'commerceclause',
                title: '商务条款',
                type: 'table',
                columns:[
                    [
                        { title: '条款内容', align: 'center', checked: true, field: 'line1'},
                        { title: '备 注', align: 'center', checked: true, field: 'line2'},
                    ]
                ]
            },
            {
                tid: 'defaultModule.breachclause',
                field: 'breachclause',
                title: '违约条款',
                type: 'table',
                columns:[
                    [
                        { title: '条款内容', align: 'center', checked: true, field: 'line1'},
                        { title: '备 注', align: 'center', checked: true, field: 'line2'},
                    ]
                ]
            },
            {
                tid: 'defaultModule.exonerationclause',
                field: 'exonerationclause',
                title: '免责条款',
                type: 'table',
                columns:[
                    [
                        { title: '条款内容', align: 'center', checked: true, field: 'line1'},
                        { title: '备 注', align: 'center', checked: true, field: 'line2'},
                    ]
                ]
            },
            {
                tid: 'defaultModule.settlementclause',
                field: 'settlementclause',
                title: '结算条款',
                type: 'table',
                columns:[
                    [
                        { title: '条款内容', align: 'center', checked: true, field: 'line1'},
                        { title: '备 注', align: 'center', checked: true, field: 'line2'},
                    ]
                ]
            },
            {
                tid: 'defaultModule.paymentclause',
                field: 'paymentclause',
                title: '支付条款',
                type: 'table',
                columns:[
                    [
                        { title: '条款内容', align: 'center', checked: true, field: 'line1'},
                        { title: '备 注', align: 'center', checked: true, field: 'line2'},
                    ]
                ]
            },
            {
                tid: 'defaultModule.otherclause',
                field: 'otherclause',
                title: '其他条款',
                type: 'table',
                columns:[
                    [
                        { title: '条款内容', align: 'center', checked: true, field: 'line1'},
                        { title: '备 注', align: 'center', checked: true, field: 'line2'},
                    ]
                ]
            },
            {
                tid: 'defaultModule.goodstype',
                field: 'goodstype',
                title: '货物类',
                type: 'table',
                columns:[
                    [
                        { title: '编码', align: 'center', checked: true, field: 'line1'},
                        { title: '名称', align: 'center', checked: true, field: 'line2'},
                        { title: '品牌', align: 'center', checked: true, field: 'line3'},
                        { title: '规格型号', align: 'center', checked: true, field: 'line4'},
                        { title: '技术参数', align: 'center', checked: true, field: 'line5'},
                        { title: '计量单位', align: 'center', checked: true, field: 'line6'},
                        { title: '合同数量', align: 'center', checked: true, field: 'line7'},
                        { title: '合同单价(元)', align: 'center', checked: true, field: 'line8'},
                        { title: '合同金额(元)', align: 'center', checked: true, field: 'line9'},
                        { title: '备注', align: 'center', checked: true, field: 'line10'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.servicetype',
                field: 'servicetype',
                title: '服务类',
                type: 'table',
                columns:[
                    [
                        { title: '编码', align: 'center', checked: true, field: 'line1'},
                        { title: '名称', align: 'center', checked: true, field: 'line2'},
                        { title: '品牌', align: 'center', checked: true, field: 'line3'},
                        { title: '规格型号', align: 'center', checked: true, field: 'line4'},
                        { title: '技术参数', align: 'center', checked: true, field: 'line5'},
                        { title: '计量单位', align: 'center', checked: true, field: 'line6'},
                        { title: '合同数量', align: 'center', checked: true, field: 'line7'},
                        { title: '合同单价(元)', align: 'center', checked: true, field: 'line8'},
                        { title: '合同金额(元)', align: 'center', checked: true, field: 'line9'},
                        { title: '备注', align: 'center', checked: true, field: 'line10'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.labortype',
                field: 'labortype',
                title: '劳务类',
                type: 'table',
                columns:[
                    [
                        { title: '编码', align: 'center', checked: true, field: 'line1'},
                        { title: '名称', align: 'center', checked: true, field: 'line2'},
                        { title: '品牌', align: 'center', checked: true, field: 'line3'},
                        { title: '规格型号', align: 'center', checked: true, field: 'line4'},
                        { title: '技术参数', align: 'center', checked: true, field: 'line5'},
                        { title: '计量单位', align: 'center', checked: true, field: 'line6'},
                        { title: '合同数量', align: 'center', checked: true, field: 'line7'},
                        { title: '合同单价(元)', align: 'center', checked: true, field: 'line8'},
                        { title: '合同金额(元)', align: 'center', checked: true, field: 'line9'},
                        { title: '备注', align: 'center', checked: true, field: 'line10'}
                    ]
                ]
            }
        ],
    },
    {
        // 自营施工方案审批
        CODE: '1304323505544904704',
        TABLE: [
            {
                tid: 'defaultModule.schemeaudit',
                field: 'schemeaudit',
                title: '施工方案审批',
                type: 'table',
                columns:[
                    [
                        { title: '方案编号', align: 'center', checked: true, field: 'code' },
                        { title: '方案名称', align: 'center', checked: true, field: 'name' },
                        { title: '方案类型', align: 'center', checked: true, field: 'schemeTypeDic' },
                        { title: '文件格式', align: 'center', checked: true, field: 'format' },
                        { title: '文件大小', align: 'center', checked: true, field: 'size' },
                        { title: '上传人', align: 'center', checked: true, field: 'createName' },
                        { title: '工作单位', align: 'center', checked: true, field: 'companyName' },
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty' },
                        { title: '上传时间', align: 'center', checked: true, field: 'createTime' },
                        { title: '备注', align: 'center', checked: true, field: 'remark' }
                    ]
                ]
            }
        ]
    },
    {
        // 自营图纸会审
        CODE: '1304323207774486528',
        TABLE: [
            {
                tid: 'defaultModule.ownerslist',
                field: 'ownerslist',
                title: '会审信息-业主单位',
                type: 'table',
                columns:[
                    [
                        { title: '单位名称', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'unitName' },
                        { title: '参加人员', rowspan: '1', colspan: '4', align: 'center', checked: true},
                        { title: '备注', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'remark' },
                    ],
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name' },
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty' },
                        { title: '联系电话', align: 'center', checked: true, field: 'phone' },
                        { title: '电子邮箱', align: 'center', checked: true, field: 'email' }
                    ]
                ]
            },
            {
                tid: 'defaultModule.surveylist',
                field: 'surveylist',
                title: '会审信息-勘测单位',
                type: 'table',
                columns:[
                    [
                        { title: '单位名称', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'unitName' },
                        { title: '参加人员', rowspan: '1', colspan: '4', align: 'center', checked: true},
                        { title: '备注', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'remark' },
                    ],
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name' },
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty' },
                        { title: '联系电话', align: 'center', checked: true, field: 'phone' },
                        { title: '电子邮箱', align: 'center', checked: true, field: 'email' }
                    ]
                ]
            },
            {
                tid: 'defaultModule.designlist',
                field: 'designlist',
                title: '会审信息-设计单位',
                type: 'table',
                columns:[
                    [
                        { title: '单位名称', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'unitName' },
                        { title: '参加人员', rowspan: '1', colspan: '4', align: 'center', checked: true},
                        { title: '备注', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'remark' },
                    ],
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name' },
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty' },
                        { title: '联系电话', align: 'center', checked: true, field: 'phone' },
                        { title: '电子邮箱', align: 'center', checked: true, field: 'email' }
                    ]
                ]
            },
            {
                tid: 'defaultModule.constructionlist',
                field: 'constructionlist',
                title: '会审信息-施工单位',
                type: 'table',
                columns:[
                    [
                        { title: '单位名称', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'unitName' },
                        { title: '参加人员', rowspan: '1', colspan: '4', align: 'center', checked: true},
                        { title: '备注', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'remark' },
                    ],
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name' },
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty' },
                        { title: '联系电话', align: 'center', checked: true, field: 'phone' },
                        { title: '电子邮箱', align: 'center', checked: true, field: 'email' }
                    ]
                ]
            },
            {
                tid: 'defaultModule.supervisorlist',
                field: 'supervisorlist',
                title: '会审信息-监理单位',
                type: 'table',
                columns:[
                    [
                        { title: '单位名称', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'unitName' },
                        { title: '参加人员', rowspan: '1', colspan: '4', align: 'center', checked: true},
                        { title: '备注', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'remark' },
                    ],
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name' },
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty' },
                        { title: '联系电话', align: 'center', checked: true, field: 'phone' },
                        { title: '电子邮箱', align: 'center', checked: true, field: 'email' }
                    ]
                ]
            },
            {
                tid: 'defaultModule.elseslist',
                field: 'elseslist',
                title: '会审信息-其他单位',
                type: 'table',
                columns:[
                    [
                        { title: '单位名称', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'unitName' },
                        { title: '参加人员', rowspan: '1', colspan: '4', align: 'center', checked: true},
                        { title: '备注', rowspan: '2', colspan: '1', align: 'center', checked: true, field: 'remark' },
                    ],
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name' },
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty' },
                        { title: '联系电话', align: 'center', checked: true, field: 'phone' },
                        { title: '电子邮箱', align: 'center', checked: true, field: 'email' }
                    ]
                ]
            },
            {
                tid: 'defaultModule.summarylist',
                field: 'summarylist',
                title: '会审纪要',
                type: 'table',
                columns:[
                    [
                        { title: '内容', align: 'center', checked: true, field: 'line1' },
                        { title: '备注', align: 'center', checked: true, field: 'line3' }
                    ]
                ]
            }
        ]
    },
    {
        // 自营分包管理
        CODE: '1304323013825675264',
        TABLE: [
            {
                tid: 'defaultModule.subcontractdetailslist',
                field: 'subcontractdetailslist',
                title: '分包项目明细',
                type: 'table',
                columns:[
                    [
                        { title: '具体分包内容', align: 'center', checked: true, field: 'content' },
                        { title: '单位', align: 'center', checked: true, field: 'unit' },
                        { title: '数量', align: 'center', checked: true, field: 'num' },
                        { title: '单价(元)', align: 'center', checked: true, field: 'priceString' },
                        { title: '合价(元)', align: 'center', checked: true, field: 'combinePriceString' },
                        { title: '约定质量标准', align: 'center', checked: true, field: 'criterion' },
                        { title: '约定完成时间', align: 'center', checked: true, field: 'time' },
                        { title: '约定付款周期', align: 'center', checked: true, field: 'period' },
                        { title: '约定付款条件', align: 'center', checked: true, field: 'conditions' }
                    ]
                ]
            }
        ]
    },
    {
        // 自营项目部组建
        CODE: '1304322850084241408',
        TABLE: [
            {
                tid: 'defaultModule.memberlist',
                field: 'memberlist',
                title: '人员信息',
                type: 'table',
                columns:[
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name' },
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty' },
                        { title: '联系电话', align: 'center', checked: true, field: 'phone' },
                        { title: '登陆账号', align: 'center', checked: true, field: 'accountNumber' },
                        { title: '项目部门', align: 'center', checked: true, field: 'department' },
                        { title: '项目角色', align: 'center', checked: true, field: 'projectRole' },
                        { title: '电子邮箱', align: 'center', checked: true, field: 'email' },
                        { title: '来源渠道', align: 'center', checked: true, field: 'sources' },
                        { title: '主要职责和分工', align: 'center', checked: true, field: 'responsibility' },
                        { title: '备注', align: 'center', checked: true, field: 'remark' }
                    ]
                ]
            }
        ]
    },
    {
        // 自营立项登记
        CODE: '1304322492083617792',
        TABLE: [
            {
                tid: 'defaultModule.participationunitlist',
                field: 'participationunitlist',
                title: '参建单位',
                type: 'table',
                columns:[
                    [
                        { title: '单位类别', align: 'center', checked: true, field: 'remark' },
                        { title: '单位名称', align: 'center', checked: true, field: 'unitName' },
                        { title: '单位地址', align: 'center', checked: true, field: 'responsibility' },
                        { title: '负责人员', align: 'center', checked: true, field: 'userId' },
                        { title: '职务/岗位', align: 'center', checked: true, field: 'duty' },
                        { title: '办公电话', align: 'center', checked: true, field: 'officePhone' },
                        { title: '个人电话', align: 'center', checked: true, field: 'phone' }
                    ]
                ]
            }
        ]
    },
    {
        // 自营项目开标登记
        CODE: '1304322245185912832',
        TABLE: [
            {
                tid: 'defaultModule.memberlist',
                field: 'memberlist',
                title: '项目部组成人员',
                type: 'table',
                columns:[
                    [
                        { title: '职务', align: 'center', checked: true, field: 'line1' },
                        { title: '姓名', align: 'center', checked: true, field: 'line5' },
                        { title: '身份证号', align: 'center', checked: true, field: 'line3' },
                        { title: '备注', align: 'center', checked: true, field: 'line4' }
                    ]
                ]
            },
            {
                tid: 'defaultModule.othercompanylist',
                field: 'othercompanylist',
                title: '其他投标公司及报价',
                type: 'table',
                columns:[
                    [
                        { title: '公司名称', align: 'center', checked: true, field: 'line1' },
                        { title: '报价', align: 'center', checked: true, field: 'line2' }
                    ]
                ]
            }
        ]
    },
    {
        // 自营招标文件答疑
        CODE: '1304321562848149504',
        TABLE: [
            {
                tid: 'defaultModule.affiliatelist',
                field: 'affiliatelist',
                title: '招标文件答疑',
                type: 'table',
                columns:[
                    [
                        { title: '疑问人', align: 'center', checked: true, field: 'queryPersonnel' },
                        { title: '疑问内容', align: 'center', checked: true, field: 'queryContent' },
                        { title: '答复人', align: 'center', checked: true, field: 'answerPersonnel' },
                        { title: '答复内容', align: 'center', checked: true, field: 'answerContent' },
                        { title: '备注', align: 'center', checked: true, field: 'remark' }
                    ]
                ]
            }
        ]
    },
    {
        // 自营现场勘察登记
        CODE: '1304321408359350272',
        TABLE: [
            {
                tid: 'defaultModule.affiliatelist',
                field: 'affiliatelist',
                title: '招标文件答疑',
                type: 'table',
                columns:[
                    [
                        { title: '勘察地点', align: 'center', checked: true, field: 'explorationSite' },
                        { title: '勘察内容', align: 'center', checked: true, field: 'explorationContent' },
                        { title: '勘察时间', align: 'center', checked: true, field: 'explorationDate' },
                        { title: '勘察人', align: 'center', checked: true, field: 'explorationPersonnel' },
                        { title: '勘察部门', align: 'center', checked: true, field: 'explorationDepartment' },
                        { title: '岗位/职务', align: 'center', checked: true, field: 'explorationDuty' }
                    ]
                ]
            }
        ]
    },
]

export const BASICSCODE = {

    /**
     * 表格
     */
    TABLE_PRINT: 'table_print',

    /**
     * 驻外机构
     */
    ADMIN_OVERSEAS_INSTITUTIONS: '1206855134861180928',

    /**
     * 物采 ---采购订单
     */
    MATERIAL_PURCHASE_REQUEST: 'material_purchase_request',

    /**
     * 档案登记
     */
    ADMIN_FILE: '1303890130233450496',

    /**
     * 借阅记录
     */
    ADMIN_FILE_LOAN: '1304296608418037760',

    /**
     * 发文管理
     */
    ADMIN_SEND_FILE: '1304297197470285824',

    /**
     * 收文管理
     */
    ADMIN_RECEIVE_FILE: '1304297581479788544',

    /**
     * 印章登记
     */
    ADMIN_SEALREG: '1304298198491267072',

    /**
     * 用印申请
     */
    ADMIN_USEAPPLY: '1304298416989339648',

    /**
     * 刻章申请
     */
    ADMIN_ENGAPPLY: '1304298573130694656',

    /**
     * 车补标准设置
     */
    ADMIN_VEHICLE_AMENDANT_RECORD: '1304298934579036160',
    
     /**
     * 车辆使用申请
     */
    ADMIN_VEHICLE_REGISTRATION: '1304299468912394240',

     /**
     * 个人证书信息登记
     */
    ADMIN_CREDENTIAL: '1304300253637312512',

     /**
     * 公司证书信息登记
     */
    ADMIN_CORPORATION_CHARTER: '1304300472315740160',

     /**
     * 个人证书借用记录
     */
    ADMIN_CREDENTIAL_LOAN: '1304300703786795008',

     /**
     * 公司证书借用记录
     */
    ADMIN_CHARTER_LOAN: '1304300897676886016',

     /**
     * 总结计划
     */
    SUMMARY_PLAN: '1304301613451640832',
    
     /**
     * 入职申请
     */
    HR_ENTRY: '1304302393083715584',

    /**
     * 离职申请
     */
    PERSONNELMANAGEMENT_LEAVEOFFICE: '1304302828968370176',

    /**
     * 辞退通知
     */
    PERSONNELMANAGEMENT_DISMISS: '1304303076893679616',

    /**
     * 工作调整
     */
    HR_WORK_ACCOMMODATION: '1304303338806992896',

    /**
     * 普通客户
     */
    CUSTOMERS: '1304304079420416000',

    /**
     * 联营客户
     */
    CUSTOMER: '1304304314649567232',

    /**
     * 普通客户联系记录
     */
    CUSTOMER_RELATIONSHIPS: '1304304559764692992',

    /**
     * 联营客户联系记录
     */
    CUSTOMER_RELATIONSHIP: '1304304723501932544',

    /**
     * 联营投标项目
     */
    JOINT_PROJECT: '1304305504837853184',

    /**
     * 联营报名登记
     */
    JOINT_PROJECTSIGNUP: '1304305976218902528',

    /**
     * 联营开标登记
     */
    JOINT_PROJECTOPEN: '1304306149355577344',
    
    /**
     * 联营标书制作
     */
    JOINT_TENDER_MAKE: '1304306508329279488',

    /**
     * 联营保证金缴纳
     */
    JOINT_MARGIN_PAYMENT: '1304306891193737216',

    /**
     * 联营保证金退还
     */
    JOINT_MARGIN_RETURN: '1304307008730718208',

    /**
     * 联营立项登记
     */
    JOINT_PROJECT_APPROVAL: '1304307310594777088',

    /**
     * 联营工程款到账登记
     */
    JOINT_PROJECT_FUNDS: '1304307672458354688',

    /**
     * 联营工程款支付申请
     */
    JOINT_PROJECT_PAYMENT: '1304307899512807424',

    /**
     * 联营材料款代收代付
     */
    JOINT_AGENT_BUSINESS: '1304308098213765120',

    /**
     * 联营成本票据分类占比
     */
    JOINT_COST_CONSTITUTE: '1304308601756737536',

    /**
     * 联营工程巡查登记
     */
    JOINT_ENGINEERING_INSPECTION_RECORDS: '1304308827062165504',

    /**
     * 对外付款申请
     */
    EXTERNAL_PAYMENT_APPLICATION: '1304309815789658112',

    /**
     * 员工报销申请
     */
    FINANCE_EMPLOYEE_REIMBURSE: '1304310120501649408',

    /**
     * 员工借款申请
     */
    FINANCE_EMPLOYEE_BORROW: '1304310428581707776',

    /**
     * 对外贷款审批
     */
    FINANCE_EXTERNAL_LOAN: '1304310798292762624',

    /**
     * 到账资金登记
     */
    FINANCE_ACCOUNT_FUND: '1304310991125889024',

    /**
     * 银行账户设置
     */
    SYS_BANK_ACCOUNT: '1304311688886108160',

    /**
     * 自营投标项目
     */
    SELF_PROJECT_CREATE: '1304312836737089536',

    /**
     * 自营前期跟踪
     */
    SELF_TRACE_MESSAGE: '1304315050486546432',

    /**
     * 自营招标公告变更
     */
    SELF_INVITATION_ALTERATION: '1304320054538682368',

    /**
     * 自营招标信息
     */
    SELF_INVITATION_REGISTER: '1304320402305204224',

    /**
     * 自营评分规则
     */
    SELF_INVITATION_GRADE: '1304320722972327936',

    /**
     * 自营项目报名申请
     */
    SELF_BID_APPLY: '1304321238645227520',

    /**
     * 自营现场勘察登记
     */
    SELF_BID_EXPLORATION: '1304321408359350272',

    /**
     * 自营招标文件答疑
     */
    SELF_BID_QUERY: '1304321562848149504',

    /**
     * 自营资格预审文件审核
     */
    SELF_BID_FILE: '1304321860605984768',

    /**
     * 自营投标文件编制审核
     */
    SELF_BID_TENDER: '1304322031398043648',

    /**
     * 自营项目开标登记
     */
    SELF_BID_OPEN: '1304322245185912832',

    /**
     * 自营立项登记
     */
    SELF_APPROVAL: '1304322492083617792',

    /**
     * 自营项目部组建
     */
    SELF_DEPARTMENT_CREATE: '1304322850084241408',

    /**
     * 自营分包管理
     */
    SELF_DIRECT_SUBPACKAGE: '1304323013825675264',
    
    /**
     * 自营图纸会审
     */
    SELF_DRAWING_AUDIT: '1304323207774486528',

    /**
     * 自营施工方案审批
     */
    SELF_CONSTRUCTION_SCHEME_AUDIT: '1304323505544904704',

    /**
     * 自营三通一平
     */
    SELF_ELECTRIC: '1304323779172909056',

    /**
     * 合同签订
     */
    BARGAIN_MANAGER_CREATE: '1304325179785232384',

    /**
     * 合同计量
     */
    SELF_CONTRACT_METERING: '1304325512930410496',

    /**
     * 合同结算
     */
    SELF_CONTRACT_SETTLE: '1304325718522609664',

    /**
     * 发票管理
     */
    SELF_INVOICE_ORIGIN: '1304326456489426944',

    /**
     * 销项发票
     */
    SELF_INVOICE_OUTPUT: '1314838148815097856',

    /**
     * 质量检查
     */
    SELF_QUALITY_INSPECT: '1304327235279405056',

    /**
     * 质量整改
     */
    SELF_QUALITY_RECTIFY: '1304329682077024256',

    /**
     * 经济核算-收入登记
     */
    SELF_INCOME_CHECK: '1304329883483308032',

    /**
     * 经济核算-成本登记-责任
     */
    COST_TARGET_RESPONSIBILITY1: '1308602635866275840',

    /**
     * 经济核算-成本登记-目标
     */
    COST_TARGET_RESPONSIBILITY2: '1304330604157009920'
    
}