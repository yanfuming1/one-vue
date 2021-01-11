<template>
    <el-dialog
        v-dialogDrag
        :visible="dialogVisible" 
        :title="dialogTitle" 
        width="40%" 
        :before-close="handleClose">
        <el-form>
            <el-row>
                <el-col :span="15">
                    <el-form-item label="信誉评分:" label-width="100px" class="reputation-score-star">
                        <el-rate
                            @change="starRatingEven"
                            v-model="creditEvaluationData.creditscore"
                            :max="max"
                            show-score
                            score-template="{value}分"
                            :colors="colors"
                            :text-color="textColor"
                        >
                        </el-rate>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="信誉评价:" label-width="100px">
                        {{ creditEvaluationData.creditlevel }}
                    </el-form-item> 
                </el-col>
            </el-row>
            <el-form-item label="评价内容:" label-width="100px">
                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="creditEvaluationData.creditsay"/>
            </el-form-item>
        </el-form>
        
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveCustomerDictionary">确 定</el-button>
            <el-button  @click="$emit('change')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
let that = this
export default {
    props: {
        dialogTitle: String,
        dialogVisible: {
            type: Boolean,
            default: false
        },
        max:Number,
        colors:Array,
        textColor:String,
        data: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            creditEvaluationData:{
                creditlevel:'一般',
                creditsay:'',
                creditscore: 3
            },
            title:'',
            value:'5'
        }
    },

    methods: {
        saveCustomerDictionary () {
            this.$emit("saveCustomerDictionary",this.creditEvaluationData)
            this.creditEvaluationData = {}
        },
        starRatingEven () {
            switch(this.creditEvaluationData.creditscore) {
                case 1:this.creditEvaluationData.creditlevel = '极差'
                    break;
                case 2:this.creditEvaluationData.creditlevel = '差'
                    break;
                case 3:this.creditEvaluationData.creditlevel = '一般'
                    break;
                case 4:this.creditEvaluationData.creditlevel = '良好'
                    break;
                case 5:this.creditEvaluationData.creditlevel = '优秀'
                    break;
            }
        },
        handleClose (done) {
            this.$emit ('change')
        },
    },

    mounted () {

    },
}
</script>
<style lang="scss" scoped>
.reputation-score-star{
    .el-rate{
        margin: 10px;
    }
}
</style>
