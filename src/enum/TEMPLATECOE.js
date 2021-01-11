export const TEMPLATECOE = [
    {
        // 驻外机构
        CODE: 'admin_overseas_institutions',
        TABLE: [
            {
                tid: 'defaultModule.workExperience',
                field: 'table',
                title: '股东构成',
                type: 'table',
                editable: true,
                columnDisplayEditable: true,
                columnDisplayIndexEditable: true,
                columns: [
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name'},
                        { title: '性别', align: 'center', checked: true, field: 'gender'},
                        { title: '销售数量', align: 'center', checked: true, field: 'count'},
                        { title: '销售金额', align: 'center', checked: true, field: 'amount'}
                    ]
                ]
            },
            {
                tid: 'defaultModule.workExperiences',
                field: 'table',
                title: '出资比例',
                type: 'table',
                editable: true,
                columnDisplayEditable: true,
                columnDisplayIndexEditable: true,
                columns: [
                    [
                        { title: '姓名', align: 'center', checked: true, field: 'name', width: 100 },
                        { title: '性别', align: 'center', checked: true, field: 'gender', width: 100 },
                        { title: '销售数量', align: 'center', checked: true, field: 'count', width: 100 },
                        { title: '销售金额', align: 'center', checked: true, field: 'amount', width: 100 }
                    ]
                ]
            }
        ]

    }
]
