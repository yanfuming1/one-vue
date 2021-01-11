<template>
    <div>
        <el-form-item v-if="widget.type != 'divider' && display[widget.model]" :label="widget.name" :prop="widget.options.isEnableDisabled ? widget.model : transform.isShowDetails ? '' : widget.options.required ? widget.model : ''"
            :class="{
                [widget.options.customClass]: widget.options.customClass?true: false,
            }"
            :label-width="widget.options.isLabelWidth ? widget.options.labelWidth + 'px' : ''"
        >
            <generate-element-item 
                :blanks="blanks" 
                :is-table="false" 
                :widget="widget" 
                v-model="dataModel" 
                :models.sync="dataModels" 
                :remote="remote"
                :edit="edit"
                :remote-option="remoteOption"
                :key="widget.key"
                :rules="rules"
                :transform="transform"
                @btnClick="btnClick"
                @inputBlur="inputBlur"
                @btnTableClick="btnTableClick"
                @inputTableChange="inputTableChange"
            >
            
                <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                    <slot :name="blank.name" :model="scope.model"></slot>
                </template>
            </generate-element-item>
        </el-form-item>

        <el-divider v-if="widget.type == 'divider' && display[widget.model]" :content-position="!widget.options.contentPosition ? 'left' : widget.options.contentPosition">
            <div class="generate-from-divider___line"></div>
            {{widget.name}}
        </el-divider>
    </div>
</template>

<script>
import GenerateElementItem from './GenerateElementItem'

export default {

    components: {
        GenerateElementItem
    },

    props: ['widget', 'models', 'rules', 'remote', 'blanks', 'display', 'transform', 'display', 'edit', 'remoteOption'],

    data () {
        return {
          
            dataModel: this.models[this.widget.model],
            dataModels: this.models
        }
    },

    methods: {
        btnClick (item) {
            this.$emit('btn-click', item ,this.widget.model, this.widget.name)
        },

        btnTableClick (name, index, list, model, label) {
            this.$emit('btnTableClick', name ,index, list, model, label)
        },

        inputTableChange (field, value, index) {
            this.$emit ('inputTableChange', field, value, index, this.widget.model)
        },

        inputBlur (value) {
            this.$emit ('inputBlur', this.widget.model, value)
        }
    },

    watch: {
        dataModel: {
            deep: true,
            handler (val) {
                this.models[this.widget.model] = val
                this.$emit('update:models', {
                    ...this.models,
                    [this.widget.model]: val
                })
                // console.log(this.widget)
                this.$emit('input-change', val, this.widget.model, this.widget)
            }
        },
        models: {
            deep: true,
            handler (val) {
                this.dataModel = val[this.widget.model]
                this.dataModels = val
            }
        },
    }
}
</script>
<style lang="scss">
.generate-from-divider___line {
    border-left: 3px solid $color-text-title;
    height: 20;
    position: relative;
    display: inline-block;
    height: 15px;
    top: 3px;
    right: 2px;
}
</style>>
