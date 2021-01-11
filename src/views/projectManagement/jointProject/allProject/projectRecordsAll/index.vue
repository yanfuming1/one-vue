<template>
    <d2-container class="address-book">
        <el-card class="box-card">
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFunctions"
                :remoteOption="remoteOption"
                :value="values"
                :transform="transform"
                @on-change="change"
                ref="generateForm"/>
            <bottomInformation :values="values" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            <div class="drawer-btn">
                <el-button type="primary" v-if="!transform.isShowDetails" size="mini" @click="saveNewPro">确定</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails" size="mini" @click="submitNewPro">提交</el-button>
                <el-button size="mini" @click="cancel">取消</el-button>
            </div>
        </el-card>
    </d2-container>
</template>

<script>
import bottomInformation from '../../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { jointProectAdd, getProEdit, getProSubmit, jointContactListById, getProjectAllOptions } from '../../../../../api/jointProject/index'
import { staffListAllByDep } from '../../../../../api/system/staff/staff'
import { staffStaffDictionary } from '../../../../../api/system/staff/staff'
import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { CERTIFICATE } from '../../../../../enum/FORMCODE'
import { PORJECT_INFO } from '../../../../../enum/PROJECT'
import { mapActions } from 'vuex'
import util from '../../../../../libs/util'
let that = this
export default {
    name: "index",
    components: { bottomInformation },
    data () {
        return {
            jsonData: {},
            allUser: [],
            remoteFunctions: {},
            values: {
                itemNumber: '',
                salesmanCompanyId: '',
                businessDepartmentId: ''
            },
            JointPrincipalId: [],
            transform: {
                isShowDetails: false
            },
            remoteOption: {
                departList: [],
                companyList: []
            },
            num: 0
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        setRemote () {
            this.remoteFunctions= {
                getBusinessPersonnelId (resolve) {resolve(that.allUser)},
                getJointPrincipalId (resolve) {resolve(that.JointPrincipalId)},
            }
        },
        
        formatData (data) {
            let associatedTem = this.JointPrincipalId.find(el => el.id === data.associatedPersonId)
            data.associatedPerson = associatedTem ? associatedTem.cusName : ''
            let userTem = this.allUser.find(el => el.id === data.businessPersonnelId)
            data.businessPersonnel = userTem ? userTem.name : ''
            let departTem = this.remoteOption.departList.find(el => el.id === data.businessDepartmentId)
            data.businessDepartment = departTem ? departTem.name : ''
            let companyTem = this.remoteOption.companyList.find(el => el.id === data.salesmanCompanyId)
            data.salesmanCompanyName = companyTem ? companyTem.name : ''
            return data
        },

        submitNewPro(){
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(data => {
                if(data && item) {
                    data = Object.assign({}, data, item)
                    data = this.formatData(JSON.parse(JSON.stringify(data)))
                    if(this.$route.params.isEdit){
                        data.id = this.$route.params.info.id;
                    }
                    getProSubmit(data).then(res => {
                        this.$message.success('提交成功~~~')
                        this.cancel()
                    });
                }
            });
        },
        saveNewPro () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(data => {
                if (data && item) {
                    data = Object.assign( {}, data, item )
                    data = this.formatData(JSON.parse(JSON.stringify(data)))
                    if(this.$route.params.isEdit){
                        data.id = this.$route.params.info.id;
                        let tem = {
                            id: this.$route.params.info.id,
                            jointProject: data
                        };
                        getProEdit(tem).then(res => {
                            this.$message.success('编辑成功~~~');
                            this.cancel()
                        })
                    }else{
                        jointProectAdd(data).then(res => {
                            this.$message.success('添加成功~~~');
                            this.cancel()
                        })
                    }
                }
            })
        },
        cancel () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        change(field, value, model){
            switch(field){
                case 'associatedPersonId':
                    this.JointPrincipalId.forEach(item => {
                        if(item.id === value){
                            model.phone = item.cusPhone
                            model.unitAddress = item.unitAddress
                        }
                    })
                    this.values = model
                    break
                case 'businessPersonnelId':
                    // if (this.num > 0) {
                        this.values.salesmanCompanyId = ''
                        this.values.businessDepartmentId = ''
                    // } else {
                    //     this.num++
                    // }
                    this.values.businessPersonnelId = value
                    this.getPositionDepartment (value)
                    break
                case 'salesmanCompanyId':
                    if (this.values.salesmanCompanyId == value) return
                    this.values.salesmanCompanyId = value
                    this.getDepIdByCompanyIdList (value, model.businessPersonnelId)
                    break
            }
            this.values[field] = value
        },
        getJson() {
            formGetJson({code: CERTIFICATE.PROJECTRECORDS}).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        getAllOption () {
            staffStaffDictionary ().then(res => {
                if (res && res.length > 0) {
                    this.allUser = res
                    this.setRemote ()
                }
            })
            getProjectAllOptions().then(options => {
                this.JointPrincipalId = options.customer}
            ).finally(() => {
                this.setRemote([])
                if (this.$route.params.isEdit) {
                    this.transform = this.$route.params.transform || { isShowDetails: false }
                    this.values = this.$route.params.info
                    this.values.phone = Number(this.values.phone)
                } else {
                    this.num = 1
                    let year = new Date().getFullYear();
                    this.values.itemNumber = "自动生成";
                }
            })
        },

        getPositionDepartment (id, boolean = false) {
            getCompanyByUserId ({'userId': id}).then(res => {
                if (res && res.length > 0) {
                    this.remoteOption.companyList = res
                } else {
                    this.remoteOption.companyList.splice(0, this.remoteOption.companyList.length)
                }
                if (boolean) {
                    this.getDepIdByCompanyIdList (this.values.salesmanCompanyId, this.values.businessPersonnelId)
                } else if (res.length == 1) {
                    this.values.salesmanCompanyId = res[0]['id']
                    this.getDepIdByCompanyIdList (res[0]['id'], id)
                }

            })
        },

        getDepIdByCompanyIdList (id, userId) {
            getOrganizationByCompanyId({'id': id, 'userId': userId}).then(res => {
                if (res && res.length > 0) {
                    this.remoteOption.departList = res
                } else {
                    this.remoteOption.departList.splice(0, this.remoteOption.departList.length)
                }
                if (res && res.length == 1) {
                    this.values.businessDepartmentId = res[0]['id']
                } else {
                    this.values.businessDepartmentId = ''
                }
            })
        }
    },
    created() {
        this.getJson()
    },
    async mounted() {
        that = this
        this.getAllOption()
    }
}
</script>

<style scoped lang="scss">
.drawer-btn{
    text-align: center;
    // position: absolute;
    // bottom: 60px;
    // left: calc(50% - 99px);
}
</style>
