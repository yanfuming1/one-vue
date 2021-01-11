<template>
    <div>
        <el-row>
            <el-col :span="24" style="margin:30px 0 0 150px">
                <el-button size="mini" type="primary" @click="editFun" v-if="saveShow">编辑</el-button>
                <el-button size="mini" type="success" @click="saveFun"  v-else>保存</el-button>
                <el-button size="mini" @click="saveShow = !saveShow,$emit('editFun')" v-if="!saveShow">取消</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// updateConfiguration
  import {updateConfiguration} from '../../../../api/configuration/index';
    export default {
        props: {
            saveData: {
                type: Array,
                default: () => {
                    return []
                }
            },
        },
        data() {
            return {
                saveShow:true,
                saveJsonData: []
            }
        },
        methods: {
            editFun () {
                this.saveShow = !this.saveShow;
                this.$emit('editFun')
            },
            saveFun () {
                let phoneRow = this.saveJsonData.find(item => item.id === '1197392137171677184');
                let dianhuaRow = this.saveJsonData.find(item => item.id === '1202421490272710656');
                let myreg=/(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)/;
                let phoneReg=/(^((\(\d{3}\))|(\d{3}\-))?(1[3456789]\d{9})$)/;
                if (dianhuaRow) {
                    if (!myreg.test(dianhuaRow.value)) {
                        this.$message.error('请确认固定电话格式')
                        return
                    } 
                }
                if (phoneRow) {
                    if (!phoneReg.test(phoneRow.value)) {
                        this.$message.error('请确认手机号格式')
                        return
                    } 
                }
                updateConfiguration (this.saveJsonData).then( res => {
                    if (res.success ) {
                        this.saveShow = !this.saveShow;
                        this.$message.success('修改成功')
                        this.$emit('editFun')

                    } else {

                    }
                })
            },
        },
        watch: {
            saveData: {
                immediate: true,
                handler (value) {
                    this.saveJsonData = value;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>