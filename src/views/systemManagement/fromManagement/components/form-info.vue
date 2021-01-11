<template>
<div class="from-create-div">
    <el-row>
        <el-col :span="11">
            <div class="from-create-item">
                <p><span>*</span>姓名</p>
                <qqt-input :readonly="read" :placeholder="placeholder" :value="user.name"></qqt-input>
            </div>
        </el-col>
        <el-col :span="11" :offset="1">
            <div class="from-create-item">
                <p><span>*</span>部门</p>
                <qqt-select :readonly="read" :options="selectionOptions" :value="user.createdBy"></qqt-select>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="11">
            <div class="from-create-item">
                <p>岗位</p>
                <qqt-input :readonly="read" :placeholder="placeholder" :value="user.position"></qqt-input>
            </div>
        </el-col>
        <el-col :span="11" :offset="1">
            <div class="from-create-item">
                <p>直属上级</p>
                <qqt-select :readonly="read" :options="selectionOptions" :value="user.major"></qqt-select>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="11">
            <div class="from-create-item">
                <p>角色编码</p>
                <qqt-input :readonly="read" :placeholder="placeholder" :value="user.id"></qqt-input>
            </div>
        </el-col>
        <el-col :span="11" :offset="1">
            <div class="from-create-item">
                <p><span>*</span>角色类型</p>
                <qqt-select :readonly="read" :options="selectionOptions" :value="user.from"></qqt-select>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="23">
            <div class="from-create-item">
                <p>备注</p>
                <qqt-input :readonly="read" :placeholder="placeholder" :value="user.remark"></qqt-input>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
    import QqtInput from "../../../../components/qqt-subassembly/qqt-input/qqt-input";
    import QqtSelect from "../../../../components/qqt-subassembly/qqt-select/qqt-select";
    export default {
        name: "from-info",
        components: {QqtSelect, QqtInput},
        props: {
            userInfo: Object
        },
        data () {
            return {
                read: false,
                placeholder: '请输入',
                selectionOptions: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }],
                user: {}
            }
        },
        mounted() {
            this.user = this.userInfo
            // console.log(this.user)
        },
        watch: {
            user () {
               this.userInfo = this.user
            }
        }
    }
</script>

<style scoped>

</style>
