<template>
    <div class="qqt-switch">
        <div class="input-group">
            <el-switch
                ref="switch"
                v-model="isSelect"
                :active-color="activeColor"
                :inactive-color="inactiveColor"
                :active-text="choseText"
                :inactive-text="unChoseText"
                :disabled="!isShowElement"
                :class="{ 'isShowDetails': !isShowElement }"
                @change="setSwitch">
            </el-switch>
        </div>
    </div>
</template>

<script>
    import QqtP from "../qqt-p/qqt-p";
    export default {
        name: "qqt-switch",
        components: {QqtP},
        data () {
            return {
                activeName: '',
                isSelect: this.value
            }
        },
        props: {
            value: Boolean,
            choseText: String,
            unChoseText: String,
            activeColor: String,
            inactiveColor: String,
            isShowElement: {
                type: Boolean,
                default: () => true
            },
            disable: Boolean
        },
        methods: {
            setSwitch (data) {
                if (data) {
                    if (this.$refs['switch'] && this.$refs['switch'].activeText != null) {
                        this.activeName = this.$refs['switch'].activeText
                    } else {
                        this.activeName = '是'
                    }
                }
                if (!data ) {
                    if (this.$refs['switch'] && this.$refs['switch'].inactiveText != null) {
                        this.activeName = this.$refs['switch'].inactiveText
                    } else {
                        this.activeName = '否'
                    }
                }
                this.$emit('getSwitch', data)
            }
        },
        watch: {
            value () {
                this.isSelect = this.value
                this.setSwitch(this.value)
            }
        },
        mounted () {
            this.isSelect = this.value
            this.setSwitch(this.value)
        }
    }
</script>

<style scoped>

</style>
