<template>
    <div :class="{ 'isShowDetails': !isShowElement }">
        <p> {{ value }} </p>
        <el-button type="text" v-if="pBtnTitle" @click="$emit('button')"> {{ pBtnTitle }} </el-button>
    </div>
</template>

<script>
    export default {
        name: "qqt-p",
        props: {
            value: String,
            pBtnTitle: String,
            isShowElement: {
                type: Boolean,
                default: () => true
            }
        },
        data () {
            return {

            }
        }
    }
</script>

<style lang="scss" scoped>
    p {
        margin: 0px;
        color: $color-text-placehoder;
        padding-left: 12px
    }
    button {
        float: right;
    }
</style>
