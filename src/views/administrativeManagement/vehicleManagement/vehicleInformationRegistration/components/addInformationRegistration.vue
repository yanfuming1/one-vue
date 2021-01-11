<template>
    <d2-container type="fulls">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closeTag"><i class="el-icon-close"></i></el-button>
            </div>

            <div class="qqt-container-full-center___top">
                <fm-generate-form
                    :data="jsonData"
                    :remote="remoteFuncs"
                    :value="values"    
                    :transform="transform"
                    ref="generateForm"/>
            </div>
            <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />

            <div class="operation-button">
                <el-button size="mini" type="warning" v-if="operationBtn" @click="saveInformationRegistration">保存</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
        </el-card>
    </d2-container>
</template>

<script>
import util from '@/libs/util.js'
import { mapActions } from 'vuex'
import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { addVehicleInformation, editVehicleInformation, vehicleInformationQueryById } from '../../../../../api/administrativeManagement/vehicleManagement/vehicleInformationRegistration'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    let that = this
    export default {

        data () {
            let that = this
            return {
                isAdd: false,
                operationBtn: true,
                values:{},
                jsonData: {},
                remark:'',
                remoteFuncs: {
                    getNatureVehicle (resolve) {
                        resolve ([
                            {
                                id: '1',
                                name: '公司车辆'
                            },
                            {
                                id: '2',
                                name: '个人车辆'
                            },
                            {
                                id: '3',
                                name: '社会车辆'
                            },
                            {
                                id: '4',
                                name: '其它'
                            }
                        ])
                    }
                },

                transform: {
                    isShowDetails: false
                },
                upLoadFileDefaultList: []
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.ADDVEHICLEINFORMATIONREGISTRATION}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            // 通过ID获取数据
            getvehicleInformationQueryById () {
                vehicleInformationQueryById ({
                    id: this.$route.params.id
                }).then( res => {
                    this.values = res
                    switch (this.values.natureVehicle) {
                        case '1' :
                            this.values.natureVehicle = '公司车辆'
                            break
                        case '2' :
                            this.values.natureVehicle = '个人车辆'
                    }
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
                })
            },

            addAndEdit () {
                if (this.$route.params.id) {
                    this.getvehicleInformationQueryById ()
                    if (this.$route.params.isDetails) {
                        this.operationBtn = false
                        this.transform.isShowDetails = true
                    }
                }
            },

            // 保存 && 编辑
            saveInformationRegistration () {
                let info = this.$refs.bottomInformation.getData()
                this.$refs.generateForm.getData().then(item => {
                    if (item && info) {
                        Object.assign(item, info)
                        if (this.$route.params.isAdd){
                            addVehicleInformation(item).then( res => {
                                this.$message.success("保存成功")
                                this.closeTag()
                            }).catch(err => {
                                this.$message.error("保存失败")
                            })
                        } else if (this.$route.params.id) {
                            // 编辑
                            item['id'] = this.$route.params.id
                            editVehicleInformation(item).then( res => {
                                this.$message.success("编辑成功")
                                this.closeTag()
                            }).catch( err => {
                                this.$message.error("编辑失败")
                            })
                        }
                    }
                })
            },

            closeTag () {
                let tagName = this.$route.path
                let path = '/administrativeManagement/vehicleManagement/vehicleInformationRegistration'
                this.close ({ tagName, path })
            },
            ...mapActions('d2admin/page', [
                'close' 
            ]),
            
        },

        created () {
            this.getFormByJson ()

            this.addAndEdit ()
        },

        mounted () {

        },

        components: {
            'bottom-information': bottomInformation
        },

        watch: {
        }
    }
</script>


<style lang='scss' scoped>
    .add-information-registration{
        background: #ffffff
    }
    .operation-button{
        margin: 0 auto;
        text-align: center;
        margin-top: 12px
    }
</style>
