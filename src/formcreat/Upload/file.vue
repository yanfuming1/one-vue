<template>
    <el-upload
        :action="action"
        :style="{width: width}"
        :disabled="disabled"
        :limit="limit"
        :on-success="onSuccess"
        :file-list="list"
        :on-remove="onRemove"
    >
        <el-button size="small" type="primary">点击上传</el-button>
        <div v-if="tip" class="el-upload__tip" slot="tip">{{tip}}</div>
    </el-upload>
</template>

<script>
export default {

    props: {
        action: {
            type: String,
            default: ''
        },
        width: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number,
            default: 9
        },
        tip: {
            type: String,
            default: ''
        },
        value: {
            type: Array,
            default: () => []
        }
    },
    data () {
      return {
        list: this.value
      }
    },
    methods: {
        onSuccess (response, file, fileList) {
            if (response) {
                this.list.push({
                    name: file.name,
                    url: response.url,
                    ...response,
                })

                this.$emit('input', this.list)
            }
        },
        onRemove (file, fileList) {
            this.list = [...fileList]
            this.$emit('input', this.list)
        }
    }
}
</script>
