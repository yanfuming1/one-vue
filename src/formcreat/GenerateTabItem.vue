<template>
    <el-tabs v-model="tabActive" 
        :type="element.options.type"
        :tab-position="element.options.tabPosition"
        :class="{
            [element.options.customClass]: element.options.customClass?true: false
        }"
        style="margin-bottom: 18px;"
        v-if="display[element.model]"
    >
        <el-tab-pane 
            :key="item.name" 
            :label="item.label" 
            :name="item.name" 
            v-for="item in element.tabs"
        >
            <template v-for="tab in item.list">
                <generate-col-item
                    v-if="tab.type == 'grid'"
                    :key="tab.key"
                    :model.sync="dataModels"
                    :rules="rules"
                    :element="tab"
                    :remote="remote"
                    :blanks="blanks"
                    :display="display"
                    :edit="edit"
                    :transform="transform"
                    :remote-option="remoteOption"
                    @input-change="onInputChange"
                    @btnClick="btnClick"
                    @inputBlur="inputBlur"
                    @btnTableClick="btnTableClick"
                    @inputTableChange="inputTableChange"
                >
                    <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                        <slot :name="blank.name" :model="scope.model"></slot>
                    </template>
                </generate-col-item>

                <generate-tab-item
                    v-else-if="tab.type == 'tabs'"
                    :key="tab.key"
                    :model.sync="dataModels"
                    :rules="rules"
                    :element="tab"
                    :remote="remote"
                    :blanks="blanks"
                    :display="display"
                    :edit="edit"
                    :transform="transform"
                    :remote-option="remoteOption"
                    @input-change="onInputChange"
                    @btnClick="btnClick"
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
                    :key="tab.key"
                    :models.sync="dataModels"
                    :rules="rules"
                    :widget="tab"
                    :remote="remote"
                    :blanks="blanks"
                    :display="display"
                    :edit="edit"
                    :transform="transform"
                    :remote-option="remoteOption"
                    @input-change="onInputChange"
                    @btnClick="btnClick"
                    @inputBlur="inputBlur"
                    @btnTableClick="btnTableClick"
                    @inputTableChange="inputTableChange"
                >
                    <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                        <slot :name="blank.name" :model="scope.model"></slot>
                    </template>
                </generate-form-item>
            </template>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import GenerateFormItem from './GenerateFormItem'

export default {
    
    name: 'generate-tab-item',
    
    components: {
        GenerateFormItem,
        GenerateColItem : () => import('./GenerateColItem.vue')
    },

    props: ['element', 'model', 'rules', 'remote', 'blanks', 'display', 'edit', 'remoteOption', 'transform'],
    
    data () {
        return {
            dataModels: this.model,
            tabActive: this.element.tabs.length ? this.element.tabs[0].name : '',
        }
    },

    methods: {
        onInputChange (value, field) {
            this.$emit('input-change', value, field)
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
