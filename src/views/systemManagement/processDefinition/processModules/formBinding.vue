<template>
  <qqt-select :value="formKey" :options="options" :defaultProp="defaultProp" :placeholder="'请选择'" @select="getSelectData"></qqt-select>
</template>

<script>
import { qqtSelect } from '../../../../components/qqt-subassembly'
export default {
    name: 'formBinding',
    props: {
        formKey: String,
        options: Array
    },

    data () {
        return {
            value: '',
            defaultProp: {
                value: 'code',
                label: 'name'
            }
        }
    },

    methods: {
        getSelectData (item) {
            this.$emit('selectFormData', item)
        }
    },

    components: {
        'qqt-select': qqtSelect
    }
}
</script>

<style scoped>

</style>
