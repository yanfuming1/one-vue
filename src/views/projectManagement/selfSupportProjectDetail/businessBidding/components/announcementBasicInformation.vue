<template>
    <fm-generate-form 
        :data="jsonData"
        :remote="remote"
        :value="values"
        :transform="transform"
        ref="generateForm"
        @on-change="selectGenerateChange"
    />
</template>

<script>
    import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { queryDicByIds } from '@/api/system/dic/dic'
    import { CITYJSON } from '@/enum/CTIYS'

    import util from '@/libs/util.js'
    let than = this
    export default {

        props: {

            transform: {
                type: Object,
                default: () => {
                    return {
                        isShowDetails: false
                    }
                }       
            },

            values: {
                type: Object,
                default: () => ({})
            }
        },

        data () {
            return {
                remote: {},
                jsonData: {},
                information: {},
                processModuleId: PROPRIETARYPROJECT.ANNOUNCEMENTBASICINFORMATION,
                qualificationRequirementDicList: [],
                registrationWayList: [],
                projectCategoryList: [],
                capitalSourceList: [],
                bindingTypeList: [],
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getQueryDicByIdList () {
                let list = [ PROPRIETARYPROJECTDICTIONARY.BIDDINGTYPE,  PROPRIETARYPROJECTDICTIONARY.CAPITALSOURCE,
                    PROPRIETARYPROJECTDICTIONARY.REGISTRATIONWAY, PROPRIETARYPROJECTDICTIONARY.PROJECTCATEGORY,
                    PROPRIETARYPROJECTDICTIONARY.QUALIFICATIONREQUIREMENT
                ]
                queryDicByIds (list).then (item => {
                    this.bindingTypeList = item[PROPRIETARYPROJECTDICTIONARY.BIDDINGTYPE]
                    this.capitalSourceList = item[PROPRIETARYPROJECTDICTIONARY.CAPITALSOURCE]
                    this.registrationWayList = item[PROPRIETARYPROJECTDICTIONARY.REGISTRATIONWAY]
                    this.projectCategoryList = item[PROPRIETARYPROJECTDICTIONARY.PROJECTCATEGORY]
                    this.qualificationRequirementDicList = item[PROPRIETARYPROJECTDICTIONARY.QUALIFICATIONREQUIREMENT]
                    this.neatenData ()
                })
            },

            neatenData () {
                this.remote = {
                    getbindingType (resolve) {
                        resolve (than.bindingTypeList)
                    },

                    getCapitalSource (resolve) {
                        resolve (than.capitalSourceList)
                    },

                    getRegistrationWay (resolve) {
                        resolve (than.registrationWayList)
                    },

                    getProjectCategory (resolve) {
                        resolve (than.projectCategoryList)
                    },

                    getScoringMethod (resolve) {
                        resolve (than.scoringMethodList)
                    },

                    qualificationRequirementDic (resolve) {
                        resolve (than.qualificationRequirementDicList)
                    },

                    getCityJson (resolve) {
                        resolve (CITYJSON)
                    }
                }
            },

            selectGenerateChange (field, val, models) {
                let item = '', str = ''
                switch (field) {
                    case 'biddingTypeDicId':
                        item = this.bindingTypeList.find (f => f.id === val)
                        if (item) this.information['biddingTypeDic'] = item.name
                        break
                    case 'capitalSourceDicId':
                        item = this.capitalSourceList.find (f => f.id === val)
                        if (item) this.information['capitalSourceDic'] = item.name
                        break
                    case 'applyWayDicId':
                        item = this.registrationWayList.find (f => f.id === val)
                        if (item) this.information['applyWayDic'] = item.name
                        break
                    case 'projectCategoryDicId':
                        item = this.projectCategoryList.find (f => f.id === val)
                        if (item) this.information['projectCategoryDic'] = item.name
                        break
                    case 'qualificationRequirementDicIdList':
                        if (val instanceof Array) {
                            val.forEach (res => {
                                item = this.qualificationRequirementDicList.find (f => f.id === res)
                                if (item) str += item.name + ','
                            })
                            this.information['qualificationRequirementDicId'] = JSON.stringify (val)
                            this.information['qualificationRequirementDic'] = str.substring (0, str.length - 1)
                        }
                        break
                    case 'projectAddressIdList':
                        if (val instanceof Array) {
                            this.values['projectAddress'] = ''
                            this.information['projectAddressId'] = JSON.stringify (val)
                            item = CITYJSON.find (f => f.value == val[0])
                            this.values['projectAddress'] += item.label
                            this.neatenCityName (item.children, val, item.label, 1)
                        }
                        break
                }
            },

            neatenCityName (city, ids, str, num) {
                let item = city.find (f => f.value == ids[num])
                this.values['projectAddress'] += ',' + item.label
                if (item.children && item.children.length > 0) {
                    this.neatenCityName (item.children, ids, str, ++num)
                }
            },

            initLoadData () {
                if (this.values.qualificationRequirementDicId) {
                    if ((this.values.qualificationRequirementDicId instanceof Array) == false) this.values['qualificationRequirementDicIdList'] = JSON.parse (this.values.qualificationRequirementDicId)
                    if ((this.values.projectAddressId instanceof Array) == false) this.values['projectAddressIdList']= JSON.parse (this.values.projectAddressId)
                }
            },

            getData () {
                let data = this.$refs.generateForm.getDataNotPromise ()
                if (data) {
                    return Object.assign ({}, data, this.information)
                } else {
                    return false
                }
            }
        },

        created () {
            this.getFormByJson ()
            this.getQueryDicByIdList ()
        },

        mounted () {
            than = this
            this.initLoadData ()
        },

        watch: {
            values () {
                this.initLoadData ()
            }
        }
    }
</script>
