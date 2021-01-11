<template>
    <d2-container class="address-book">
        <el-dialog
            v-dialogDrag
            append-to-body
            title="提示"
            :visible.sync="hint"
            top="10vh"
            width="30%"
            :close-on-click-modal="false"
            :before-close="hintEnter">
            <div style="text-align:center;">
                <img src="../components/img/mark.png">
                <p style="color:red;text-align:center;font-size:18px;">此项目尚未进行立项登记, 不能进行工程款数据录入</p>
            </div>
            <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
                <el-button size="mini" type="primary" @click="hintEnter">去立项登记查看</el-button>
            </span>
        </el-dialog>
        <el-card class="box-card cash-return closeHeader">
            <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <div style="margin-top: 20px;">
                <div class="commInfo-div">
                    <fm-generate-form
                        :data="jsonData"
                        :remote="remoteFuncs"
                        :value="values"
                        :transform="transform"
                        @on-change="valueChange"
                        ref="generateForm"/>
                </div>
                <bottomInformation :fieldTitle="'录入'" :timeTitle="'录入'" :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                <div v-if="canAdd">
                    <div class="drawer-btn" v-if="transform.isShowDetails">
                        <el-button type="primary" size="small" @click="transform.isShowDetails = false">追加</el-button>
                    </div>
                    <div class="drawer-btn" v-if="!transform.isShowDetails">
                        <el-button type="primary" size="small" @click="saveInfo">保存</el-button>
                        <el-button size="small" @click="transform.isShowDetails = true">取消</el-button>
                    </div>
                </div>
                <div v-if="!canAdd">
                    <div class="drawer-btn">
                        <el-button type="primary" size="small" @click="closeTab">关闭</el-button>
                    </div>
                </div>
            </div>
        </el-card>
    </d2-container>
</template>
<script>
import bottomInformation from '../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { getProById, } from '../../../../api/jointProject/index'
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { getBaseMsgById, getBaseMsgAdd } from '../../../../api/jointProject/index'
import { mapActions } from 'vuex'
import util from '@/libs/util'
export default {
    name: "index",
    components: { bottomInformation },
    data() {
        return {
            hint: false,
            jsonData: {},
            remoteFuncs: {},
            values: {
                projectTotalMoney: null,
                prepaid: null,
                deduct: null,
                detain: null,
            },
            transform: {
                isShowDetails: false
            },
            canAdd: true,
            proId: '',
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        hintClose(){
            this.hint = false;
        },
        hintEnter(){
            let tagName = this.$route.path
            let path = '/projectManagement/jontProjectDetail/projectApproval'
            let name = 'projectApproval'
            this.close ({ tagName, path, name })
        },
        closeTab () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        calculateMoney (data, type) {
            let projectTotalMoney = parseFloat(data.projectTotalMoney === null ? '0' : data.projectTotalMoney)
            let prepaid = parseFloat(data.prepaid === null ? '0' : data.prepaid)
            let deduct = parseFloat(data.deduct === null ? '0' : data.deduct)
            let detain = parseFloat(data.detain === null ? '0' : data.detain)

            let result = projectTotalMoney - prepaid - deduct - detain
            if(result < 0) {
                this.$message.warning('剩余可支付金额不可以为负，请确认后重新添加!!!')
                data[type] = '0'
                data['projectBalance'] = '0'
            } else {
                data['projectBalance'] = result + ''
            }
            return data
        },
        valueChange (field, value, model) {
            switch(field){
                case 'projectTotalMoney':  // 累计已到账
                    model = this.calculateMoney(model, 'projectTotalMoney')
                    break
                case 'prepaid':  // 累计已拨付
                    if(parseFloat(model.projectTotalMoney === null ? '0' : model.projectTotalMoney) < parseFloat(value === null ? '0' : value)){
                        this.$message.warning("累计已到账金额不能小于累计已拨付金额!!!")
                        model.prepaid = '0'
                    } else {
                        model = this.calculateMoney(model, 'prepaid')
                    }
                    break
                case 'deduct': // 累计已扣除
                    if(parseFloat(model.projectTotalMoney === null ? '0' : model.projectTotalMoney) < parseFloat(value === null ? '0' : value)){
                        this.$message.warning("累计已到账金额不能小于累计已扣除金额!!!")
                        model.deduct = '0'
                    } else {
                        model = this.calculateMoney(model, 'deduct')
                    }
                    break
                case 'detain': // 累计已暂押
                    if(parseFloat(model.projectTotalMoney === null ? '0' : model.projectTotalMoney) < parseFloat(value === null ? '0' : value)){
                        this.$message.warning("累计已到账金额不能小于累计已暂押金额!!!")
                        model.detain = '0'
                    } else {
                        model = this.calculateMoney(model, 'detain')
                    }
                    break
            }
            this.values = model
        },
        saveInfo () {
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(data => {
                if(data && bottomInformation) {
                    data = Object.assign({}, data, bottomInformation)
                    data.id = this.proId;
                    getBaseMsgAdd(data).then(res =>{
                        this.$message.success('追加成功!!!')
                        this.transform.isShowDetails = true;
                        this.canAdd = false
                    })
                }
            })
        },
        getJosn () {
            formGetJson({ code: 'commonInfoEntering' }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        getProjectInfo(){
            getProById({ id: this.proId }).then(res => {
                this.hint = res.state === '3' ? false :true ;
            })
        },
        echoData(data) {
            data.deduct = data.deduct + ''
            data.detain = data.detain + ''
            data.prepaid = data.prepaid + ''
            data.projectBalance = data.projectBalance + ''
            data.projectTotalMoney = data.projectTotalMoney + ''
            return data
        }

    },
    async mounted () {
        this.getJosn();
        const db = await this.$store.dispatch('d2admin/db/database', {user: true});
        this.proId = db.get('proID').value();
        getBaseMsgById({id: this.proId}).then(res => {
            this.canAdd = res.result === null ? true : false;
            if(!this.canAdd){
                this.transform.isShowDetails = true
                res = this.echoData(res)
                Object.assign(this.values, res)
            }
        });
        this.getProjectInfo();
    }
}
</script>
<style lang="scss" scoped>
.drawer-btn{
    margin-top: 100px;
    text-align: center;
}
.commInfo-div{
    width: 400px;
    margin-left: 30px;
}
</style>
