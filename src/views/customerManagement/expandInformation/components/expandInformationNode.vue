<template>
    <div class="expand-information-node">
        <div class="expand-information-node-title">
            <i class="expand-information-node-title___line"></i>
            <p>拓展字段</p>
        </div>
        <div class="expand-information-node-option">
            <div v-for="(data, index) of options" :key="index" ref="optionStyle" @click="getNodeData(data)">
                <div class="expand-information-node-option-style" :class="{'backgroundColor-actice': data.isShow, 'backgroundColor-cancel': !data.isShow}">
                    <span >
                        {{ data.proName }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "expandInformationNode",
        props: {
            options: {
                type: Array,
                default: () => []
            }
        },
        
        data () {
            return {
                historicalData: ''
            }
        },

        methods: {

            getNodeData (item) {
                this.resetBackgroundColor (item)
                this.$emit('information', item)
            },

            resetBackgroundColor (item) {
                item['isShow'] = true
                if (this.historicalData === '' && this.options[0].id !== item.id) {
                    this.options[0]['isShow'] = false
                } else if (this.historicalData !== '' && this.historicalData.id !== item.id) {
                    this.historicalData['isShow'] = false
                }
                this.historicalData = item
            },
        }

    }
</script>

<style lang="scss" scoped>
    .expand-information-node {
        padding: 10px;
        .expand-information-node-title {
            font-weight: 500;
            border-bottom: 2px dashed $color-straight-line;
            height: 50px;
            padding-left: 5px;
            line-height: 50px;
            .expand-information-node-title___line {
                border-left: 3px solid $color-vertical-line;
            }
            p {
                display: inline-block;
                padding-left: 15px;
                font-size: 16px;
            }
        }
        .expand-information-node-option {
            padding: 15px 0;
            .expand-information-node-option-button {
                button {
                    padding: 5px 13px;
                    margin-left: -20px;
                    background: $color-button-typeface2;
                    margin-bottom: 10px;
                }
            }
            .expand-information-node-option-style {
                cursor: pointer;
                height: 38px;
                line-height: 38px;
                width: 100%;
                font-size: 14px;
                padding-left: 25px
            }
            .expand-information-node-option-style-button {
                top: -27px;
                position: relative;
                float: right;
                i {
                    padding-right: 15px;
                    color: $color-button-typeface1;
                    cursor: pointer;
                    font-size: 20px
                }
            }
            .expand-information-node-option-style:hover {
                background: $color-tree-hover
            }
        }
    }
    .backgroundColor-actice {
        background: #d6e8ff !important
    }
    .backgroundColor-cancel {
        background: #ffffff
    }
</style>
