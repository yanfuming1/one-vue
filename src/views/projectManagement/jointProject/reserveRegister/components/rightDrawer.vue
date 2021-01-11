<template>
    <div>
        <fm-generate-form
            v-if="drawer"
            :data="jsonData"
            :remote="remoteFuncs"
            :value="values"
            :transform="transform"
            @on-change="change"
            ref="generateForm"/>
            <bottomInformation :values="values" :isGrid="true" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
        <div class="drawer-btn">
            <el-button type="primary" v-if="!transform.isShowDetails" size="small" @click="subNewPro">确定</el-button>
            <el-button v-if="!transform.isShowDetails" @click="cancel" size="small">取消</el-button>
            <el-button type="primary" v-if="transform.isShowDetails" size="small" @click="cancel">关闭</el-button>
        </div>
    </div>
</template>

<script>
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { jointProAdd, jointProEdit } from '../../../../../api/jointProject/index'
import util from '../../../../../libs/util'
let that = this
export default {
    name: "rightDrawer",
    components: {
        bottomInformation
    },
    props: {
        proType: {
            type: Array,
            default: () => {
                return []
            }
        },
        jointPerson: {
            type: Array,
            default: () => {
                return []
            }
        },
        jointInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        isAdd: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        drawer: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        showDetail: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    data () {
        return {
            jsonData: {},
            values: {},
            remoteFuncs: {
                getProType(resolve){
                    resolve(that.proType)
                },
                getJointPersonId(resolve){
                    resolve(that.jointPerson)
                }
            },
            transform: {
                isShowDetails: false
            },
        }
    },
    methods : {
        change (field, value, model) {
            switch(field){
                case 'jointPersonId': 
                    this.jointPerson.forEach(item => {
                        if(item.id === value){
                            model.phone = item.cusPhone
                        }
                    })
                    this.values = model
                break
            }
        },
        subNewPro () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(data => {
                if(data && item) {
                    data = Object.assign({}, data, item)
                    data.projectType = util.jointData(data.projectType, ',')
                    this.jointPerson.forEach(item => {
                        if(item.id === data.jointPersonId){
                            data.jointPerson = item.cusName
                        }
                    })
                    if(this.isAdd){
                        // 说明是添加
                        jointProAdd(data).then(res => {
                            this.$message.success("添加成功~~~")
                            this.$emit('closeDrawer')
                        })
                    }else{
                        // 说明是编辑
                        data.id = this.jointInfo.id
                        jointProEdit(data).then(res => {
                            this.$message.success("编辑成功~~~")
                            this.$emit('closeDrawer')
                        })
                    }
                }
            })
        },
        handleReset () {
            this.$refs.generateForm.reset()
        },
        setData () {
            if(this.jointInfo.projectType !== undefined && this.jointInfo.projectType !== ''){
                console.log(this.jointInfo)
                this.jointInfo.projectType = this.jointInfo.projectType.split(",")
                this.values = this.jointInfo
            }
        },
        cancel () {
            this.values = {}
            this.$emit('closeDrawer')
        }
    },
    mounted() {
        that = this
        this.setData()
        this.transform.isShowDetails = this.showDetail
        formGetJson({
            code: 'ce9299fe-696d-b53d-5e8b-5065b66efaa9'
        }).then(res => {
            this.jsonData = JSON.parse(res)
        })
    },
    watch : {
        jointInfo(newVal, old){
            this.values = newVal
            this.setData()
        },
        showDetail(newVal, old){
            this.transform.isShowDetails = newVal
        }
    }
}
</script>

<style scoped lang="scss">
.drawer-btn{
    margin-top: 40px;
    text-align: center;
}
</style>
