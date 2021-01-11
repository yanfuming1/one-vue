<template>
    <el-row
        :class="{
            [element.options.customClass]: element.options.customClass?true: false
        }"
        type="flex"
        :gutter="element.options.gutter || 0"
        :justify="element.options.justify"
        :align="element.options.align"
        v-if="display[element.model]"
    >
        <el-col v-for="(item, index) in element.columns" :key="index"
            :span="item.span || 0" 
        >
            <template v-for="col in item.list">
                <generate-col-item
                    v-if="col.type == 'grid'"
                    :key="col.key"
                    :model.sync="dataModels"
                    :rules="rules"
                    :element="col"
                    :remote="remote"
                    :blanks="blanks"
                    :display="display"
                    :transform="transform"
                    :edit="edit"
                    :remote-option="remoteOption"
                    @input-change="onInputChange"
                    @btn-click="btnClick"
                    @inputBlur="inputBlur"
                    @btnTableClick="btnTableClick"
                    @inputTableChange="inputTableChange"
                >
                    <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                        <slot :name="blank.name" :model="scope.model"></slot>
                    </template>
                </generate-col-item>

                <generate-tab-item
                    v-else-if="col.type == 'tabs'"
                    :key="col.key"
                    :model.sync="dataModels"
                    :rules="rules"
                    :element="col"
                    :remote="remote"
                    :blanks="blanks"
                    :display="display"
                    :edit="edit"
                    :remote-option="remoteOption"
                    @input-change="onInputChange"
                    @btn-click="btnClick"
                    @inputBlur="inputBlur"
                    @btnTableClick="btnTableClick"
                    @inputTableChange="inputTableChange"
                >
                    <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                        <slot :name="blank.name" :model="scope.model"></slot>
                    </template>
                </generate-tab-item>

                <generate-form-item
                    v-else
                    :key="col.key"
                    :models.sync="dataModels"
                    :rules="rules"
                    :widget="col"
                    :remote="remote"
                    :blanks="blanks"
                    :display="display"
                    :transform="transform"
                    :edit="edit"
                    :remote-option="remoteOption"
                    @input-change="onInputChange"
                    @btn-click="btnClick"
                    @inputBlur="inputBlur"
                    @btnTableClick="btnTableClick"
                    @inputTableChange="inputTableChange"
                >
                    <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                        <slot :name="blank.name" :model="scope.model"></slot>
                    </template>
                </generate-form-item>
            </template>
        </el-col>
    </el-row>
</template>

<script>
import GenerateFormItem from './GenerateFormItem'
import GenerateTabItem from './GenerateTabItem'

export default {

    name: 'generate-col-item',

    components: {
        GenerateFormItem
    },

    props: ['element', 'model', 'rules', 'remote', 'blanks', 'display', 'transform', 'edit', 'remoteOption'],

    data () {
        return {
            dataModels: this.model
        }
    },

    methods: {
        onInputChange (value, field, widget) {
            this.$emit('input-change', value, field, widget)
        },

        btnClick (value, field, label) {
            this.$emit ('btn-click', value, field, label)
        },

        btnTableClick (field, index, list, model, label) {
            this.$emit ('btnTableClick', field, index, list, model, label)
        },

        inputTableChange (field, value, index, parentField) {
            this.$emit ('inputTableChange', field, value, index, parentField)
        },

        inputBlur (field, value) {
            this.$emit ('inputBlur', field, value)
        }
       
    },

    watch: {
        model: {
            deep: true,
            handler (val) {
                this.dataModels = this.model
            }
        },
        dataModels: {
            deep: true,
            handler (val) {
                this.$emit('update:model', val)
            }
        }
    }
}
</script>
