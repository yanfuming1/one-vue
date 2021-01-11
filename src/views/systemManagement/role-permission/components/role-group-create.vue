<template>
    <el-form ref="form" :model="form" class="role-create-div">
        <el-row>
            <el-col :span="20" :offset="2">
                <el-form-item label="角色组名称" required>
                    <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-form-item label="角色组编码">
                    <el-input v-model="form.encoding" placeholder="请输入编码"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.remark"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
    import QqtSelect from "../../../../components/qqt-subassembly/qqt-select/qqt-select";
    import QqtInput from "../../../../components/qqt-subassembly/qqt-input/qqt-input";
    export default {
        name: "role-group-create",
        components: {QqtSelect, QqtInput},
        props: {
            data: Object
        },
        data () {
            return {
                form: {
                    encoding: '',
                    name: '',
                    remark: '',
                    id: ''
                }

            }
        },
        methods : {
            getForm () {
                const {encoding, name, remark, id} = this.form
                let item = {
                    encoding,
                    name,
                    remark,
                    id
                }
                return item
            }
        },
        mounted () {
            this.form = this.data
        },
        watch: {
            data () {
                this.form = this.data
            }
        }
    }
</script>

<style lang="scss">
.el-dialog__footer{
    padding-bottom: 25px;
    padding-right: calc(4.16667% + 40px);
}
</style>
