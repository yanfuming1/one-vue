<template>
    <el-form :model="formInline" class="demo-form-inline">
        <el-row>
            <el-col :span="20">
                <div class="top-option">
                    <el-input placeholder="请输入关键字" class="search-con" prefix-icon="el-icon-search" v-model="formInline.keywords"></el-input>
                    <span style="margin-right:5px;">状态</span>
                    <el-select class="select" v-model="formInline.isJob" clearable filterable placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                    <el-button size="mini" type="primary" @click.native="search">搜索</el-button>
                    <el-button size="mini" type="info" @click.native="resetSearch">重置</el-button>
                    <el-button size="mini" type="success" @click.native="generate">生成系统账号</el-button>
                    <el-button size="mini" style="margin-right:10px;" @click.native="exportFun" icon="el-icon-upload2">导出</el-button>
                    <el-upload style="display: inline-block" class="upload-demo" action="" :auto-upload="false" :show-file-list="false"  :on-change="onFileChange"  :before-upload="beforeUpload" :file-list="fileList">
                        <el-button size="mini" icon="el-icon-download">导入</el-button>
                    </el-upload>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
    import { importExcel } from '../../../../api/system/staff/staff'
    export default {
        name: "staff-search",
        data () {
            return {
                searchAll: '',
                selectValue: '',
                options: [{
                    value: '1',
                    label: '在职'
                }, {
                    value: '0',
                    label: '离职'
                }],
                formInline: {
                    keywords: '',
                    isJob: ''
                },
                fileList: []
            }
        },
        methods: {
            search () {
                this.$emit('submit', this.formInline)
            },
            generate () {
                this.$emit('generate')
            },
            exportFun () {
            //    // this.$emit('generate')
            //     const elink = document.createElement('a')
            //     // elink.download = row.name
            //     elink.style.display = 'none';
            //     elink.href = process.env.VUE_APP_API+"/system/staff/exportXls";
            //     document.body.appendChild(elink)
            //     elink.click()
            //     URL.revokeObjectURL(elink.href) // 释放URL 对象
            //     document.body.removeChild(elink)
                this.$emit('uploadFun')
            },
            exportLead(){ },
            beforeUpload (e) {

            },
            onFileChange (file, fileList) {
                let form = new FormData();
                form.append('file', file.raw);
                importExcel(form).then(res => {
                    this.$message.success(res.message)
                })
            },
            resetSearch () {
                this.formInline.keywords = ''
                this.formInline.isJob = ''
                this.$emit('submit', this.formInline)
            }
        }
    }
</script>

<style lang="scss">
.top-option{
    .search-con{
        width: 150px;
        float: left;
    }
    .el-input{
        padding-right: 10px;
    }
    input,.top-option .el-input__inner{
        height: 30px !important;
    }
    .el-input__icon{
        line-height: 30px !important;
    }
    .style{
        font-size: 14px !important;
    }
    .select{
        width: 120px;
        padding-right: 10px;
        .el-input{
            padding-right: 0px;
        }
    }
}
</style>
