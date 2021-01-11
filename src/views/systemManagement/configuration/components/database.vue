<template>
    <div>
        <!-- <el-button type="primary" @click=""></el-button> -->
        <el-form  ref="form" label-width="100px">
            <el-form-item label="备份">
                <el-button type="primary" size="small" @click="backups">数据库备份</el-button> 
            </el-form-item>
            <el-form-item label="恢复">
                <el-button type="primary" size="small" @click="recover">数据库恢复</el-button> 
            </el-form-item>
        </el-form>
        
        
    </div>
</template>

<script>
    import {backup,recover} from '../../../../api/configuration/index';
import { Loading } from 'element-ui';
    export default {
        data() {
            return {
            }
        },
        methods: {
            backups() {
                const h = this.$createElement;
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('span', null, '此操作将备份数据库, 是否继续?备份时间可能过长，请耐心等待 '),
                    ]),
                    showCancelButton: true,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    showClose: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.cancelButtonLoading = true;
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '备份中...';
                            backup().then(res => {
                                this.$message.success(res.message)
                            }).catch(data => {
                                this.$message.error(res.message)
                            }).finally (() => {
                                instance.confirmButtonLoading = false;
                                instance.cancelButtonLoading = false;
                                done();
                            })
                        } else {
                            done();
                        }
                    }
                })
            },
            recover() {
                const h = this.$createElement;
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('span', null, '此操作将恢复数据库备份数据, 是否继续?恢复时间可能过长，请耐心等待 '),
                    ]),
                    showCancelButton: true,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    showClose: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.cancelButtonLoading = true;
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '恢复中...';
                            recover().then(res => {
                                this.$message.success(res.message)
                            }).catch(data => {
                                this.$message.error(res.message)
                            }).finally (() => {
                                instance.confirmButtonLoading = false;
                                instance.cancelButtonLoading = false;
                                done();
                            })
                        } else {
                            done();
                        }
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>