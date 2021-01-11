<template>
    <div>
        <el-dialog
            title="项目划分"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">

            <fm-generate-form 
                :data="jsonData"
                :remote="remote"
                :remoteOption="remoteOption"
                :value="values"
                :transform="transform"
                ref="generateForm">
            </fm-generate-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="saveBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { formGetJson } from '@/api/system/fromManagement/index'
import { PORJECT_INFO } from '@/enum/SELFPROJECT'
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        proData: {
            type: Object,
            default: {}
        }
    },
    data () {
        return {
            jsonData: {},
            remote: {},
            remoteOption: {},
            values: {},
            transform: {
                isShowDetails: false
            },
            processModuleId: PORJECT_INFO.PROJECTSEGREGATIONADD,
        }
    },
    methods: {
        
        handleClose () {
            this.$emit('closeAddProject')
        },

        saveBtn () {
            this.$refs.generateForm.getData().then(res => {
                if(res) {
                    Object.assign(this.values, res)
                    this.$emit('closeAddProject', this.values)
                }
            })
        },

        getJson () {
            formGetJson ({ 'code': this.processModuleId }).then(res => {
                if (res) this.jsonData = JSON.parse(res)
            })
        }
    },
    mounted () {
        this.values = this.proData
        this.getJson()
    },
    watch: {
        proData: {
            deep: true,
            handler (newVal, oldVal) {
                this.values = newVal
            }
        }
    }
}
</script>