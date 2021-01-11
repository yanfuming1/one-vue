<template>
    <el-table-column :label="coloumnHeader.label" :prop="coloumnHeader.label" align="center">
        <template v-for="col in coloumnHeader.children">
            <tableColumn v-if="col.children && col.children.length" :isShowDetails="isShowDetails" :rules="rules" :coloumn-header="col"></tableColumn>
            <el-table-column v-else-if="col.isShow" :label="col.label" :prop="col.prop" :align="col.align">
                <template slot="header">
                    <div v-if="col.required" class="table-header">
                        <i class="table-header-required">*</i>
                        <span>{{ col.label }}</span>
                    </div>
                    <span v-else>{{ col.label }}</span>
                </template>
                <template slot-scope="scope">
                    <el-form-item
                        :prop="'list.' + scope.$index + '.'+ col.prop"
                        :rules="col.required ? rules[col.prop] ? rules[col.prop] : col.rule ? col.rule : [{ required: true, message: `${col.label}不能为空`, trigger: 'change' }] : []"
                    >
                        <qqt-input v-if="col.type === 'text'" :readonly="col.readonly ? true : false" :isShowElement="!isShowDetails ? col.isShowDetails ? false : true : false" v-model="scope.row[col.prop]" :btnTitle="col.btnTitle" @btnClick="btnClick (scope.row, col.prop, scope.$index)" @input="getChangeData (scope.row, col.prop, $event)" @focus="focus (scope.row, col.prop, scope.$index, $event)" @blur="blur (scope.row, col.prop, $event)"/>
                        <qqt-input v-if="col.type === 'money'" :isShowElement="!isShowDetails ? col.isShowDetails ? false : true : false" :isMoneyType="true" :btnTitle="col.btnTitle" @btnClick="btnClick (scope.row, col.prop, scope.$index)" v-model="scope.row[col.prop]" @input="getChangeData (scope.row, col.prop, $event)" @blur="blur (scope.row, col.prop, $event)"/>
                        <qqt-input v-if="col.type === 'total'" :isShowElement="!isShowDetails ? col.isShowDetails ? false : true : false" :isMoneyType="col.isMoneyType" :btnTitle="col.btnTitle" v-model="scope.row[col.prop]" @input="getChangeData (scope.row, col.prop, $event)" @blur="blur (scope.row, col.prop, $event)"/>
                        <qqt-input v-if="col.type === 'capital'" :isShowElement="false" v-model="scope.row[col.prop]" :btnTitle="col.btnTitle" />
                        <qqt-input v-if="col.type === 'disabled'" :isShowElement="false" v-model="scope.row[col.prop]" :btnTitle="col.btnTitle" />
                        <el-date-picker v-if="col.type === 'date'" value-format="yyyy-MM-dd" :class="{'isShowDetails': isShowDetails}" :disabled="isShowDetails ? true : col.isShowDetails ? true : false" v-model="scope.row[col.prop]" type="date" placeholder="选择日期" />
                        <el-date-picker v-if="col.type === 'daterange'" :unlink-panels="true" value-format="yyyy-MM-dd" :class="{'isShowDetails': isShowDetails}" :disabled="isShowDetails ? true : col.isShowDetails ? true : false" v-model="scope.row[col.prop]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
                        <qqt-select v-if="col.type === 'select'"
                            v-model="scope.row[col.prop]"
                            :options="col.options"
                            :isShowElement="!isShowDetails ? col.isShowDetails ? false : true : false"
                            :defaultProp="col.defaultProp"
                            :filterable="col.filterable"
                            :allow-create="col.allowCreate"
                            @select="scope.row[col.prop] = $event, selectChange (scope.row, col.prop, $event,scope.$index)" />
                        <qqt-select v-if="col.type === 'selectNew'"
                            v-model="scope.row[col.prop]"
                            :options="scope.row.options"
                            :isShowElement="!isShowDetails ? col.isShowDetails ? false : true : false"
                            :defaultProp="col.defaultProp"
                            :filterable="col.filterable"
                            :allow-create="col.allowCreate"
                            @select="scope.row[col.prop] = $event, selectChange (scope.row, col.prop, $event,scope.$index)" />
                    </el-form-item>
                </template>
            </el-table-column>
        </template>
    </el-table-column>
</template>

<script>
    import qqtSelect from '../qqt-select/qqt-select'
    import qqtInput from '../qqt-input/qqt-input'
    export default {
        name: 'tableColumn',
        props: {
            coloumnHeader: {
                type: Object,
                required: true
            },
            rules: {
                type: Object,
                required: true
            },
            isShowDetails: {
                type: Boolean,
                required: true
            }
        },

        methods: {

            btnClick (data, prop, index) {
                this.$emit ('btnClick', data, prop, index)
            },

            blur (data, prop, value) {
                this.$emit ('blur', data, prop, value)
            },

            focus (data, prop, index, value) {
                this.$emit ('focus', data, prop, value, index)
            },

            selectChange (data, prop, value, index) {
                this.$emit ('select', data, prop, value, index)
            },

            getChangeData (data, prop, value) {
                data[prop] = value
                this.$emit ('getChangeData', data, prop, value)
            },
        },

        components: {
            'qqt-select': qqtSelect,
            'qqt-input': qqtInput
        },
    }
</script>